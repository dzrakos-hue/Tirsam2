import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, MessageCircle, ShieldCheck, Truck, HeadphonesIcon, TrendingDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProductCard } from "@/components/ProductCard";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import type { ProductRow } from "@/lib/types";
import heroImg from "@/assets/hero-1.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tirsam Algérie — وكيل موتورات وسكوترات Tirsam في الجزائر" },
      { name: "description", content: "اكتشف أحدث موديلات Tirsam من السكوترات والموتورات بأفضل الأسعار في الجزائر. توصيل لجميع الولايات وضمان رسمي." },
      { property: "og:title", content: "Tirsam Algérie" },
      { property: "og:description", content: "أحدث موديلات Tirsam بأفضل الأسعار في الجزائر." },
      { property: "og:image", content: "/images/moto-red.jpg" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

function HomePage() {
  const { t, lang } = useI18n();

  const { data: featured = [] } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_visible", true)
        .eq("is_featured", true)
        .order("display_order");
      if (error) throw error;
      return (data || []) as unknown as ProductRow[];
    },
  });

  const { data: offers = [] } = useQuery({
    queryKey: ["products", "offers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_visible", true)
        .not("old_price", "is", null)
        .order("display_order");
      if (error) throw error;
      return (data || []) as unknown as ProductRow[];
    },
  });

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden hero-gradient">
        <div className="absolute inset-0 opacity-30">
          <img src={heroImg} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        </div>
        <div className="container-app relative py-20 md:py-32">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              ⚡ {t("hero.badge")}
            </span>
            <h1 className="mt-5 text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
              {t("hero.title")}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{t("hero.subtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/models">
                <Button size="lg" className="btn-glow gap-2">
                  {t("hero.cta.models")} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="gap-2" asChild>
                <a href="#contact"><MessageCircle className="h-4 w-4" />{t("hero.cta.whatsapp")}</a>
              </Button>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
              <Stat value="58" label={lang === "ar" ? "ولاية" : "Wilayas"} />
              <Stat value="100%" label={lang === "ar" ? "ضمان" : "Garantie"} />
              <Stat value="24/7" label={lang === "ar" ? "دعم" : "Support"} />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      {featured.length > 0 && (
        <Section title={t("section.featured")}>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </Section>
      )}

      {/* WHY US */}
      <Section title={t("section.why")}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Why icon={<Truck className="h-6 w-6" />} title={t("why.delivery.title")} desc={t("why.delivery.desc")} />
          <Why icon={<ShieldCheck className="h-6 w-6" />} title={t("why.warranty.title")} desc={t("why.warranty.desc")} />
          <Why icon={<HeadphonesIcon className="h-6 w-6" />} title={t("why.support.title")} desc={t("why.support.desc")} />
          <Why icon={<TrendingDown className="h-6 w-6" />} title={t("why.price.title")} desc={t("why.price.desc")} />
        </div>
      </Section>

      {/* OFFERS */}
      {offers.length > 0 && (
        <Section title={t("section.offers")}>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {offers.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </Section>
      )}

      {/* TESTIMONIALS */}
      <Section title={t("section.testimonials")}>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { name: "أحمد بن علي", city: "الجزائر", text: "خدمة ممتازة وتوصيل سريع، الموتور وصل بحالة ممتازة." },
            { name: "Karim B.", city: "Oran", text: "Excellent service, livraison rapide et produit conforme." },
            { name: "محمد ز.", city: "قسنطينة", text: "أسعار منافسة وفريق محترف، أنصح به." },
          ].map((tst) => (
            <Card key={tst.name} className="p-6 card-elevated">
              <div className="flex gap-1 text-warning mb-3">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="text-sm text-muted-foreground">"{tst.text}"</p>
              <div className="mt-4 text-sm font-semibold">{tst.name} <span className="text-muted-foreground font-normal">— {tst.city}</span></div>
            </Card>
          ))}
        </div>
      </Section>

      <div id="contact" className="container-app py-12 text-center">
        <h2 className="text-2xl font-bold mb-3">{lang === "ar" ? "هل أنت مستعد للطلب؟" : "Prêt à commander ?"}</h2>
        <p className="text-muted-foreground mb-6">{lang === "ar" ? "تواصل معنا الآن وسنساعدك في اختيار الموديل المناسب." : "Contactez-nous pour choisir le modèle idéal."}</p>
        <Link to="/models">
          <Button size="lg" className="btn-glow">{t("hero.cta.models")}</Button>
        </Link>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="container-app py-16">
      <h2 className="text-3xl font-extrabold mb-8 tracking-tight">{title}</h2>
      {children}
    </section>
  );
}
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-3xl font-extrabold text-primary">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
function Why({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Card className="p-6 card-elevated">
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/15 text-primary mb-4">{icon}</div>
      <h3 className="font-bold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </Card>
  );
}
