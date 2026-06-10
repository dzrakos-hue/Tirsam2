import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Search, Download, Trash2, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/i18n";
import type { OrderRow, OrderStatus } from "@/lib/types";

export const Route = createFileRoute("/admin/")({
  component: OrdersPage,
});

const STATUSES: { v: OrderStatus; label: string; color: string }[] = [
  { v: "new", label: "جديد", color: "bg-primary/15 text-primary" },
  { v: "contacted", label: "تم الاتصال", color: "bg-chart-2/15 text-chart-2" },
  { v: "processing", label: "قيد المعالجة", color: "bg-warning/15 text-warning" },
  { v: "sold", label: "تم البيع", color: "bg-success/15 text-success" },
  { v: "cancelled", label: "ملغي", color: "bg-muted text-muted-foreground" },
];

function OrdersPage() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<OrderRow | null>(null);

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as OrderRow[];
    },
  });

  const filtered = useMemo(() => data.filter((o) => {
    if (filter !== "all" && o.status !== filter) return false;
    if (!q) return true;
    const s = q.toLowerCase();
    return [o.first_name, o.last_name, o.phone_1, o.product_name, o.wilaya].some((v) => v?.toLowerCase().includes(s));
  }), [data, q, filter]);

  async function updateStatus(id: string, status: OrderStatus) {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("تم تحديث الحالة");
    qc.invalidateQueries({ queryKey: ["admin-orders"] });
  }

  async function deleteOrder(id: string) {
    if (!confirm("حذف هذا الطلب نهائياً؟")) return;
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("تم الحذف");
    qc.invalidateQueries({ queryKey: ["admin-orders"] });
  }

  function exportCSV() {
    const rows = filtered.map((o) => ({
      id: o.id, date: new Date(o.created_at).toLocaleString("fr-DZ"),
      product: o.product_name, price: o.product_price, color: o.selected_color || "",
      first_name: o.first_name, last_name: o.last_name, wilaya: o.wilaya, commune: o.commune,
      address: o.address, phone_1: o.phone_1, phone_2: o.phone_2 || "", email: o.email || "",
      status: o.status, notes: o.notes || "",
    }));
    const headers = Object.keys(rows[0] || {});
    const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => `"${String((r as any)[h]).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `orders-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">الطلبات</h1>
          <p className="text-sm text-muted-foreground">{data.length} طلب — {data.filter(o => o.status === "new").length} جديد</p>
        </div>
        <Button onClick={exportCSV} variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" /> تصدير CSV
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="ps-9" placeholder="بحث..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الحالات</SelectItem>
            {STATUSES.map((s) => <SelectItem key={s.v} value={s.v}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>التاريخ</TableHead>
              <TableHead>العميل</TableHead>
              <TableHead>الهاتف</TableHead>
              <TableHead>الموديل</TableHead>
              <TableHead>الولاية</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead className="text-end">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8">تحميل...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">لا توجد طلبات</TableCell></TableRow>
            ) : filtered.map((o) => {
              const st = STATUSES.find((s) => s.v === o.status)!;
              return (
                <TableRow key={o.id}>
                  <TableCell className="text-xs whitespace-nowrap">{new Date(o.created_at).toLocaleDateString("fr-DZ")}</TableCell>
                  <TableCell className="font-medium">{o.first_name} {o.last_name}</TableCell>
                  <TableCell dir="ltr" className="text-sm">{o.phone_1}</TableCell>
                  <TableCell>{o.product_name}</TableCell>
                  <TableCell>{o.wilaya}</TableCell>
                  <TableCell>
                    <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v as OrderStatus)}>
                      <SelectTrigger className={`h-7 text-xs border-0 ${st.color}`}><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => <SelectItem key={s.v} value={s.v}>{s.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-end">
                    <Button size="icon" variant="ghost" onClick={() => setSelected(o)}><Eye className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => deleteOrder(o.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-xl">
          {selected && (
            <>
              <DialogHeader><DialogTitle>تفاصيل الطلب</DialogTitle></DialogHeader>
              <div className="space-y-2 text-sm">
                <Row k="العميل" v={`${selected.first_name} ${selected.last_name}`} />
                <Row k="الموديل" v={`${selected.product_name} — ${formatPrice(selected.product_price, "ar")}`} />
                <Row k="اللون" v={selected.selected_color || "—"} />
                <Row k="الهاتف 1" v={selected.phone_1} dir="ltr" />
                {selected.phone_2 && <Row k="الهاتف 2" v={selected.phone_2} dir="ltr" />}
                {selected.email && <Row k="Email" v={selected.email} dir="ltr" />}
                <Row k="الولاية" v={selected.wilaya} />
                <Row k="البلدية" v={selected.commune} />
                <Row k="العنوان" v={selected.address} />
                {selected.golden_card_number && <Row k="رقم البطاقة الذهبية" v={selected.golden_card_number} dir="ltr" />}
                {selected.golden_card_expiry && <Row k="انتهاء البطاقة" v={selected.golden_card_expiry} dir="ltr" />}
                {selected.notes && <Row k="ملاحظات" v={selected.notes} />}
                <Row k="التاريخ" v={new Date(selected.created_at).toLocaleString("fr-DZ")} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({ k, v, dir }: { k: string; v: string; dir?: string }) {
  return (
    <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-border last:border-0">
      <span className="text-muted-foreground">{k}</span>
      <span className="col-span-2" dir={dir}>{v}</span>
    </div>
  );
}
