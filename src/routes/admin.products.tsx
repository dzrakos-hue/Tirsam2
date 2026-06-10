import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, EyeOff, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/i18n";
import type { ProductRow, ProductStatus } from "@/lib/types";

export const Route = createFileRoute("/admin/products")({
  component: ProductsPage,
});

function ProductsPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<ProductRow> | null>(null);

  const { data = [] } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("display_order");
      if (error) throw error;
      return (data || []) as unknown as ProductRow[];
    },
  });

  async function save() {
    if (!editing) return;
    const payload = {
      slug: editing.slug,
      name: editing.name,
      name_fr: editing.name_fr || null,
      description: editing.description || null,
      description_fr: editing.description_fr || null,
      price: Number(editing.price),
      old_price: editing.old_price ? Number(editing.old_price) : null,
      status: editing.status || "available",
      category: editing.category || null,
      warranty: editing.warranty || null,
      specs: editing.specs || {},
      colors: editing.colors || [],
      images: editing.images || [],
      is_featured: !!editing.is_featured,
      is_visible: editing.is_visible !== false,
      display_order: editing.display_order || 0,
    };
    const { error } = editing.id
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase.from("products").insert(payload as any);
    if (error) return toast.error(error.message);
    toast.success("تم الحفظ");
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["admin-products"] });
  }

  async function remove(id: string) {
    if (!confirm("حذف المنتج نهائياً؟")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin-products"] });
  }

  async function toggle(id: string, field: "is_visible" | "is_featured", value: boolean) {
    const { error } = await supabase.from("products").update({ [field]: value } as any).eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin-products"] });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">المنتجات</h1>
        <Button className="btn-glow gap-2" onClick={() => setEditing({ status: "available", is_visible: true, specs: {}, colors: [], images: [] })}>
          <Plus className="h-4 w-4" /> إضافة موديل
        </Button>
      </div>

      <Card className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>الاسم</TableHead>
              <TableHead>السعر</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>ظاهر</TableHead>
              <TableHead>مميز</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((p) => (
              <TableRow key={p.id}>
                <TableCell><img src={p.images[0] || "/images/scooter-white.jpg"} className="h-10 w-14 object-cover rounded" alt="" /></TableCell>
                <TableCell className="font-medium">{p.name}<div className="text-xs text-muted-foreground">{p.slug}</div></TableCell>
                <TableCell>{formatPrice(p.price, "ar")}</TableCell>
                <TableCell><span className="text-xs">{p.status}</span></TableCell>
                <TableCell><Switch checked={p.is_visible} onCheckedChange={(v) => toggle(p.id, "is_visible", v)} /></TableCell>
                <TableCell><Switch checked={p.is_featured} onCheckedChange={(v) => toggle(p.id, "is_featured", v)} /></TableCell>
                <TableCell className="text-end whitespace-nowrap">
                  <Button size="icon" variant="ghost" onClick={() => setEditing(p)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.id ? "تعديل" : "إضافة"} موديل</DialogTitle></DialogHeader>
          {editing && (
            <div className="grid gap-3 sm:grid-cols-2">
              <F label="Slug (URL)"><Input value={editing.slug || ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} placeholder="vms-..." dir="ltr" /></F>
              <F label="الاسم (عربي)"><Input value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></F>
              <F label="Nom (FR)"><Input value={editing.name_fr || ""} onChange={(e) => setEditing({ ...editing, name_fr: e.target.value })} dir="ltr" /></F>
              <F label="السعر (دج)"><Input type="number" value={editing.price || ""} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} /></F>
              <F label="السعر القديم"><Input type="number" value={editing.old_price || ""} onChange={(e) => setEditing({ ...editing, old_price: Number(e.target.value) || null })} /></F>
              <F label="الفئة">
                <Select value={editing.category || ""} onValueChange={(v) => setEditing({ ...editing, category: v })}>
                  <SelectTrigger><SelectValue placeholder="اختر" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scooter">سكوتر</SelectItem>
                    <SelectItem value="moto">موتو</SelectItem>
                  </SelectContent>
                </Select>
              </F>
              <F label="الحالة">
                <Select value={editing.status || "available"} onValueChange={(v: ProductStatus) => setEditing({ ...editing, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">متوفر</SelectItem>
                    <SelectItem value="unavailable">غير متوفر</SelectItem>
                    <SelectItem value="coming_soon">قريباً</SelectItem>
                  </SelectContent>
                </Select>
              </F>
              <F label="الضمان"><Input value={editing.warranty || ""} onChange={(e) => setEditing({ ...editing, warranty: e.target.value })} /></F>
              <F label="الوصف (عربي)" full><Textarea rows={3} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></F>
              <F label="Description (FR)" full><Textarea rows={3} value={editing.description_fr || ""} onChange={(e) => setEditing({ ...editing, description_fr: e.target.value })} dir="ltr" /></F>
              <F label="الألوان (مفصولة بفاصلة)" full>
                <Input value={(editing.colors || []).join(", ")} onChange={(e) => setEditing({ ...editing, colors: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} />
              </F>
              <F label="روابط الصور (واحد في كل سطر)" full>
                <Textarea rows={3} dir="ltr" value={(editing.images || []).join("\n")} onChange={(e) => setEditing({ ...editing, images: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })} />
              </F>
              <F label="المواصفات JSON (مفتاح: قيمة)" full>
                <Textarea rows={4} dir="ltr" value={JSON.stringify(editing.specs || {}, null, 2)} onChange={(e) => {
                  try { setEditing({ ...editing, specs: JSON.parse(e.target.value) }); } catch { /* ignore */ }
                }} />
              </F>
              <F label="ترتيب العرض"><Input type="number" value={editing.display_order || 0} onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })} /></F>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2"><Switch checked={!!editing.is_visible} onCheckedChange={(v) => setEditing({ ...editing, is_visible: v })} /> ظاهر</label>
                <label className="flex items-center gap-2"><Switch checked={!!editing.is_featured} onCheckedChange={(v) => setEditing({ ...editing, is_featured: v })} /> مميز</label>
              </div>
              <div className="sm:col-span-2 flex justify-end gap-2 mt-2">
                <Button variant="ghost" onClick={() => setEditing(null)}>إلغاء</Button>
                <Button className="btn-glow" onClick={save}>حفظ</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function F({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <div className={full ? "sm:col-span-2" : ""}><Label className="mb-1.5 block text-sm">{label}</Label>{children}</div>;
}
