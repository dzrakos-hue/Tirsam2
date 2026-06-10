import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [{ title: "سياسة الخصوصية — Tirsam Algérie" }, { name: "description", content: "سياسة الخصوصية لموقع Tirsam Algérie." }],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: () => {
    const { lang } = useI18n();
    return (
      <div className="container-app py-12 max-w-3xl">
        <h1 className="text-4xl font-extrabold mb-6">{lang === "ar" ? "سياسة الخصوصية" : "Politique de confidentialité"}</h1>
        <div className="space-y-4 text-muted-foreground">
          <p>{lang === "ar"
            ? "نحن في Tirsam Algérie نحترم خصوصيتك. نجمع فقط المعلومات الضرورية لمعالجة طلبك (الاسم، العنوان، الهاتف)."
            : "Tirsam Algérie respecte votre vie privée. Nous collectons uniquement les informations nécessaires au traitement de votre commande."}</p>
          <p>{lang === "ar"
            ? "لا نخزن أي بيانات دفع حساسة. لا نشارك بياناتك مع أي طرف ثالث دون موافقتك."
            : "Aucune donnée de paiement sensible n'est conservée. Vos données ne sont jamais partagées sans votre consentement."}</p>
          <p>{lang === "ar" ? "لطلب حذف بياناتك، تواصل معنا عبر صفحة الاتصال." : "Pour demander la suppression de vos données, contactez-nous."}</p>
        </div>
      </div>
    );
  },
});
