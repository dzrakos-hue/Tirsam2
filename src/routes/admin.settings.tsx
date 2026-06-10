import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

const KEYS = [
  { key: "whatsapp_number", label: "رقم واتساب (مع رمز الدولة، مثال: 213XXXXXXXXX)" },
  { key: "phone_number", label: "رقم الهاتف للاتصال المباشر" },
  { key: "contact_email", label: "البريد الإلكتروني للتواصل" },
];

function SettingsPage() {
  const [vals, setVals] = useState<Record<string, string>>({});

  useEffect(() => {
    supabase.from("site_settings").select("key,value").then(({ data }) => {
      const obj: Record<string, string> = {};
      (data || []).forEach((r) => { obj[r.key] = r.value || ""; });
      setVals(obj);
    });
  }, []);

  async function save() {
    const rows = KEYS.map((k) => ({ key: k.key, value: vals[k.key] || "" }));
    const { error } = await supabase.from("site_settings").upsert(rows);
    if (error) return toast.error(error.message);
    toast.success("تم الحفظ");
  }

  return (
    <div className="space-y-4 max-w-xl">
      <h1 className="text-2xl font-bold">إعدادات الموقع</h1>
      <Card className="p-6 space-y-4">
        {KEYS.map((k) => (
          <div key={k.key}>
            <Label className="mb-1.5 block text-sm">{k.label}</Label>
            <Input dir="ltr" value={vals[k.key] || ""} onChange={(e) => setVals({ ...vals, [k.key]: e.target.value })} />
          </div>
        ))}
        <Button className="btn-glow" onClick={save}>حفظ</Button>
      </Card>
    </div>
  );
}
