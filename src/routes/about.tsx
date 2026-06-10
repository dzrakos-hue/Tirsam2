import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "من نحن — Tirsam Algérie" },
      { name: "description", content: "تعرف على Tirsam Algérie، وكيلك الموثوق لموتورات وسكوترات Tirsam في الجزائر." },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { lang } = useI18n();
  return (
    <div className="container-app py-12 max-w-3xl">
      <h1 className="text-4xl font-extrabold mb-6">{lang === "ar" ? "من نحن" : "À propos"}</h1>
      <div className="prose prose-invert max-w-none text-muted-foreground space-y-4">
        {lang === "ar" ? (
          <>
            <p>Tirsam Algérie هو وكيل معتمد لتسويق موتورات وسكوترات علامة Tirsam العالمية في الجزائر.</p>
            <p>نحرص على توفير أحدث الموديلات بأسعار تنافسية وضمان رسمي، مع خدمة ما بعد البيع وقطع الغيار الأصلية. هدفنا أن نجعل اقتناء موتورك تجربة سهلة وآمنة في كل ولاية من ولايات الوطن.</p>
            <h2 className="text-foreground font-bold text-xl mt-6">قيمنا</h2>
            <ul className="list-disc ps-6">
              <li>الجودة قبل كل شيء</li>
              <li>الشفافية في الأسعار</li>
              <li>دعم العملاء على مدار الساعة</li>
              <li>قطع غيار أصلية فقط</li>
            </ul>
          </>
        ) : (
          <>
            <p>Tirsam Algérie est le concessionnaire officiel de la marque Tirsam en Algérie.</p>
            <p>Nous proposons les derniers modèles à des prix compétitifs avec une garantie officielle et un service après-vente fiable. Notre objectif : rendre l'achat de votre moto simple et sécurisé partout en Algérie.</p>
            <h2 className="text-foreground font-bold text-xl mt-6">Nos valeurs</h2>
            <ul className="list-disc ps-6">
              <li>Qualité avant tout</li>
              <li>Transparence des prix</li>
              <li>Support client 24/7</li>
              <li>Pièces d'origine uniquement</li>
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
