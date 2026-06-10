import { useEffect, useState } from "react";
import { MessageCircle, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function FloatingContact() {
  const [whatsapp, setWhatsapp] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("key,value")
      .in("key", ["whatsapp_number", "phone_number"])
      .then(({ data }) => {
        if (!data) return;
        for (const row of data) {
          if (row.key === "whatsapp_number") setWhatsapp(row.value || "");
          if (row.key === "phone_number") setPhone(row.value || "");
        }
      });
  }, []);

  const waHref = whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, "")}` : "#";
  const telHref = phone ? `tel:${phone}` : "#";

  return (
    <div className="fixed bottom-5 end-5 z-40 flex flex-col gap-3">
      {phone && (
        <a
          href={telHref}
          className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform"
          aria-label="Call"
        >
          <Phone className="h-5 w-5" />
        </a>
      )}
      {whatsapp && (
        <a
          href={waHref}
          target="_blank"
          rel="noopener"
          className="grid h-12 w-12 place-items-center rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 transition-transform"
          aria-label="WhatsApp"
        >
          <MessageCircle className="h-5 w-5" />
        </a>
      )}
    </div>
  );
}
