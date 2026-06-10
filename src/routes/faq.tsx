import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "الأسئلة الشائعة — Tirsam Algérie" },
      { name: "description", content: "إجابات على أكثر الأسئلة شيوعاً حول موتورات Tirsam، التوصيل، الضمان والدفع." },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
  }),
  component: FaqPage,
});

const ITEMS_AR = [
  { q: "كيف يتم التوصيل؟", a: "نوصل لجميع ولايات الوطن خلال 3-7 أيام عمل حسب الولاية." },
  { q: "ما هي طرق الدفع؟", a: "حالياً يتم تأكيد الطلب ثم التواصل مع العميل لتحديد طريقة دفع آمنة. لا نخزن أي معلومات دفع حساسة." },
  { q: "هل يوجد ضمان؟", a: "نعم، جميع موديلاتنا مغطاة بضمان رسمي من سنة إلى سنتين حسب الموديل." },
  { q: "هل تتوفر قطع الغيار؟", a: "نعم، نوفر قطع غيار أصلية لكل موديلاتنا." },
  { q: "كيف أطلب موتور؟", a: "اختر الموديل من صفحة الموديلات، اضغط 'اطلب الآن'، املأ النموذج وسنتواصل معك." },
];
const ITEMS_FR = [
  { q: "Comment se passe la livraison ?", a: "Livraison dans toutes les wilayas sous 3 à 7 jours selon la zone." },
  { q: "Quels sont les moyens de paiement ?", a: "La commande est confirmée puis notre équipe contacte le client pour choisir un moyen de paiement sécurisé. Aucune donnée sensible n'est stockée." },
  { q: "Y a-t-il une garantie ?", a: "Oui, tous nos modèles bénéficient d'une garantie officielle de 1 à 2 ans." },
  { q: "Les pièces détachées sont-elles disponibles ?", a: "Oui, nous fournissons des pièces d'origine pour tous nos modèles." },
  { q: "Comment commander ?", a: "Choisissez votre modèle, cliquez sur 'Commander', remplissez le formulaire et nous vous contacterons." },
];

function FaqPage() {
  const { lang } = useI18n();
  const items = lang === "ar" ? ITEMS_AR : ITEMS_FR;
  return (
    <div className="container-app py-12 max-w-3xl">
      <h1 className="text-4xl font-extrabold mb-8">{lang === "ar" ? "الأسئلة الشائعة" : "FAQ"}</h1>
      <Accordion type="single" collapsible className="space-y-2">
        {items.map((it, i) => (
          <AccordionItem key={i} value={String(i)} className="border border-border rounded-xl px-4 bg-card">
            <AccordionTrigger className="text-start font-semibold">{it.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{it.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
