import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "اتصل بنا — Tirsam Algérie" },
      { name: "description", content: "تواصل مع فريق Tirsam Algérie. واتساب، هاتف وبريد إلكتروني متاحون لخدمتك." },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { lang, t } = useI18n();
  const [s, setS] = useState({ whatsapp_number: "", phone_number: "", contact_email: "" });
  useEffect(() => {
    supabase.from("site_settings").select("key,value").then(({ data }) => {
      if (!data) return;
      const obj: any = {};
      data.forEach((r) => { obj[r.key] = r.value || ""; });
      setS({ whatsapp_number: obj.whatsapp_number || "", phone_number: obj.phone_number || "", contact_email: obj.contact_email || "" });
    });
  }, []);
  return (
    <div className="container-app py-12 max-w-4xl">
      <h1 className="text-4xl font-extrabold mb-2">{lang === "ar" ? "اتصل بنا" : "Contactez-nous"}</h1>
      <p className="text-muted-foreground mb-8">{lang === "ar" ? "نحن هنا للإجابة على جميع استفساراتك" : "Nous sommes là pour répondre à toutes vos questions"}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {s.phone_number && (
          <Card className="p-6 card-elevated"><Phone className="h-6 w-6 text-primary mb-3" /><h3 className="font-semibold mb-1">{lang === "ar" ? "اتصال مباشر" : "Téléphone"}</h3><a href={`tel:${s.phone_number}`} dir="ltr" className="text-muted-foreground hover:text-primary">{s.phone_number}</a></Card>
        )}
        {s.whatsapp_number && (
          <Card className="p-6 card-elevated"><MessageCircle className="h-6 w-6 text-primary mb-3" /><h3 className="font-semibold mb-1">WhatsApp</h3><a href={`https://wa.me/${s.whatsapp_number.replace(/\D/g, "")}`} target="_blank" rel="noopener" dir="ltr" className="text-muted-foreground hover:text-primary">{s.whatsapp_number}</a></Card>
        )}
        {s.contact_email && (
          <Card className="p-6 card-elevated"><Mail className="h-6 w-6 text-primary mb-3" /><h3 className="font-semibold mb-1">Email</h3><a href={`mailto:${s.contact_email}`} dir="ltr" className="text-muted-foreground hover:text-primary">{s.contact_email}</a></Card>
        )}
        <Card className="p-6 card-elevated"><MapPin className="h-6 w-6 text-primary mb-3" /><h3 className="font-semibold mb-1">{lang === "ar" ? "العنوان" : "Adresse"}</h3><p className="text-muted-foreground">{lang === "ar" ? "الجزائر العاصمة" : "Alger, Algérie"}</p></Card>
      </div>
      {!s.phone_number && !s.whatsapp_number && !s.contact_email && (
        <p className="text-sm text-muted-foreground mt-6">{lang === "ar" ? "(يمكن للإدارة إضافة معلومات الاتصال من لوحة التحكم)" : "(Coordonnées à configurer dans l'admin)"}</p>
      )}
    </div>
  );
}
