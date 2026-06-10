import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [{ title: "الشروط والأحكام — Tirsam Algérie" }, { name: "description", content: "الشروط والأحكام الخاصة بموقع Tirsam Algérie." }],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: () => {
    const { lang } = useI18n();
    return (
      <div className="container-app py-12 max-w-3xl">
        <h1 className="text-4xl font-extrabold mb-6">{lang === "ar" ? "الشروط والأحكام" : "Conditions générales"}</h1>
        <div className="space-y-4 text-muted-foreground">
          <p>{lang === "ar" ? "باستخدامك لهذا الموقع، فإنك توافق على الشروط التالية." : "En utilisant ce site, vous acceptez les conditions suivantes."}</p>
          <ul className="list-disc ps-6 space-y-2">
            <li>{lang === "ar" ? "جميع الأسعار بالدينار الجزائري وقابلة للتغيير." : "Les prix sont en dinars algériens et peuvent changer."}</li>
            <li>{lang === "ar" ? "الطلب يصبح ساري المفعول بعد تأكيد الفريق هاتفياً." : "La commande est validée après confirmation téléphonique."}</li>
            <li>{lang === "ar" ? "الضمان وفقاً لشروط الشركة المصنعة." : "La garantie suit les conditions du constructeur."}</li>
            <li>{lang === "ar" ? "للموقع الحق في رفض أي طلب يبدو احتيالياً." : "Le site se réserve le droit de refuser toute commande frauduleuse."}</li>
          </ul>
        </div>
      </div>
    );
  },
});
