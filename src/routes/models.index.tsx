import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductCard } from "@/components/ProductCard";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import type { ProductRow } from "@/lib/types";

export const Route = createFileRoute("/models/")({
  component: ModelsPage,
});

function ModelsPage() {
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [maxPrice, setMaxPrice] = useState("");

  const { data = [], isLoading } = useQuery({
    queryKey: ["products", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products").select("*").eq("is_visible", true).order("display_order");
      if (error) throw error;
      return (data || []) as unknown as ProductRow[];
    },
  });

  const filtered = useMemo(() => {
    return data.filter((p) => {
      if (q && !`${p.name} ${p.name_fr ?? ""}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (cat !== "all" && p.category !== cat) return false;
      if (maxPrice && p.price > Number(maxPrice)) return false;
      return true;
    });
  }, [data, q, cat, maxPrice]);

  return (
    <div className="container-app py-10">
      <h1 className="text-4xl font-extrabold mb-2 tracking-tight">{t("section.all")}</h1>
      <p className="text-muted-foreground mb-8">{data.length} {t("section.all")}</p>

      <div className="grid gap-3 sm:grid-cols-4 mb-8 p-4 rounded-2xl bg-card border border-border">
        <div className="relative sm:col-span-2">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="ps-9" placeholder={t("filter.search")} value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select value={cat} onValueChange={setCat}>
          <SelectTrigger><SelectValue placeholder={t("filter.category")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filter.all")}</SelectItem>
            <SelectItem value="scooter">{t("filter.scooter")}</SelectItem>
            <SelectItem value="moto">{t("filter.moto")}</SelectItem>
          </SelectContent>
        </Select>
        <Input type="number" placeholder={t("filter.price_max")} value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
      </div>

      {isLoading ? (
        <p className="text-center py-12 text-muted-foreground">{t("common.loading")}</p>
      ) : filtered.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">{t("product.no_results")}</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}