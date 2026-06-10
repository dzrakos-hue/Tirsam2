import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, MessageCircle, ShieldCheck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ProductCard } from "@/components/ProductCard";
import { OrderDialog } from "@/components/OrderDialog";
import { useI18n, formatPrice } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import type { ProductRow } from "@/lib/types";

export const Route = createFileRoute("/models/$slug")({
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { slug } = Route.useParams();
  const { t, lang } = useI18n();
  const [orderOpen, setOrderOpen] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products").select("*").eq("slug", slug).eq("is_visible", true).maybeSingle();
      if (error) throw error;
      if (!data) throw notFound();
      return data as unknown as ProductRow;
    },
  });

  const { data: similar = [] } = useQuery({
    queryKey: ["products", "similar", product?.category],
    enabled: !!product,
    queryFn: async () => {
      const { data } = await supabase
        .from("products").select("*")
        .eq("is_visible", true).eq("category", product!.category!).neq("id", product!.id).limit(4);
      return (data || []) as unknown as ProductRow[];
    },
  });

  if (isLoading) return <div className="container-app py-16 text-center text-muted-foreground">{t("common.loading")}</div>;
  if (error || !product) return <div className="container-app py-16 text-center">{t("product.no_results")}</div>;

  const name = lang === "fr" && product.name_fr ? product.name_fr : product.name;
  const desc = lang === "fr" && product.description_fr ? product.description_fr : product.description;
  const discount = product.old_price && product.old_price > product.price;
  const images = product.images.length ? product.images : ["/images/scooter-white.jpg"];

  return (
    <div className="container-app py-8">
      <Link to="/models" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t("common.back")}
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-card border border-border">
            <img src={images[activeImg]} alt={name} className="h-full w-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${i === activeImg ? "border-primary" : "border-border"}`}>
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <Badge variant={product.status === "available" ? "default" : "secondary"} className="mb-3">
            {t(`status.${product.status}`)}
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight">{name}</h1>
          {desc && <p className="mt-3 text-muted-foreground">{desc}</p>}

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-4xl font-extrabold text-primary">{formatPrice(product.price, lang)}</span>
            {discount && (
              <span className="text-lg text-muted-foreground line-through">{formatPrice(product.old_price!, lang)}</span>
            )}
          </div>

          {product.colors.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">{t("product.colors")}</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <span key={c} className="px-3 py-1.5 rounded-full bg-secondary text-sm">{c}</span>
                ))}
              </div>
            </div>
          )}

          {product.warranty && (
            <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-success/10 border border-success/20">
              <ShieldCheck className="h-5 w-5 text-success shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-success">{t("product.warranty")}</div>
                <div className="text-sm text-muted-foreground">{product.warranty}</div>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Button size="lg" className="btn-glow flex-1 min-w-[160px]"
              disabled={product.status === "unavailable"}
              onClick={() => setOrderOpen(true)}>
              {t("product.order")}
            </Button>
            <Button size="lg" variant="outline" className="gap-2" asChild>
              <a href="#contact"><MessageCircle className="h-4 w-4" />{t("product.whatsapp")}</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Specs */}
      {Object.keys(product.specs).length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">{t("product.specs")}</h2>
          <Card className="p-6 card-elevated">
            <dl className="grid gap-4 sm:grid-cols-2">
              {Object.entries(product.specs).map(([k, v]) => (
                <div key={k} className="flex items-start gap-3 border-b border-border pb-3">
                  <Check className="h-4 w-4 text-primary mt-1 shrink-0" />
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">{k}</dt>
                    <dd className="font-semibold">{v}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </Card>
        </section>
      )}

      {/* Similar */}
      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">{t("section.similar")}</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      <OrderDialog product={product} open={orderOpen} onOpenChange={setOrderOpen} />
    </div>
  );
}
