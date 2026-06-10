import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useI18n } from "@/lib/i18n";
import { WILAYAS } from "@/lib/wilayas";
import { supabase } from "@/integrations/supabase/client";
import type { ProductRow } from "@/lib/types";

const schema = z.object({
  first_name: z.string().trim().min(1).max(100),
  last_name: z.string().trim().min(1).max(100),
  wilaya: z.string().min(1).max(100),
  commune: z.string().trim().min(1).max(100),
  address: z.string().trim().min(5).max(500),
  phone_1: z.string().trim().regex(/^[+0-9 ]{8,20}$/, { message: "رقم غير صالح" }),
  phone_2: z.string().trim().regex(/^[+0-9 ]{0,20}$/).optional().or(z.literal("")),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  selected_color: z.string().optional(),
  golden_card_number: z.string().trim().min(1, { message: "حقل مطلوب" }).regex(/^[0-9 ]{6,30}$/, { message: "رقم غير صالح" }),
  golden_card_expiry: z.string().trim().min(1, { message: "حقل مطلوب" }).regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: "MM/YY" }),
  notes: z.string().max(1000).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  product: ProductRow;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

export function OrderDialog({ product, open, onOpenChange }: Props) {
  const { t, lang } = useI18n();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: "", last_name: "", wilaya: "", commune: "", address: "",
      phone_1: "", phone_2: "", email: "",
      selected_color: product.colors[0] || "",
      golden_card_number: "", golden_card_expiry: "",
      notes: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    const { error } = await supabase.from("orders").insert({
      product_id: product.id,
      product_name: lang === "fr" && product.name_fr ? product.name_fr : product.name,
      product_price: product.price,
      selected_color: values.selected_color || null,
      first_name: values.first_name,
      last_name: values.last_name,
      wilaya: values.wilaya,
      commune: values.commune,
      address: values.address,
      phone_1: values.phone_1,
      phone_2: values.phone_2 || null,
      email: values.email || null,
      golden_card_number: values.golden_card_number || null,
      golden_card_expiry: values.golden_card_expiry || null,
      notes: values.notes || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error(t("order.error"));
      console.error(error);
      return;
    }
    toast.success(t("order.success"));
    form.reset();
    onOpenChange(false);
  }

  const err = form.formState.errors;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("order.title")}</DialogTitle>
          <DialogDescription>{t("order.subtitle")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
          <Field label={t("order.first_name")} error={err.first_name?.message}>
            <Input {...form.register("first_name")} />
          </Field>
          <Field label={t("order.last_name")} error={err.last_name?.message}>
            <Input {...form.register("last_name")} />
          </Field>
          <Field label={t("order.wilaya")} error={err.wilaya?.message}>
            <Select value={form.watch("wilaya")} onValueChange={(v) => form.setValue("wilaya", v, { shouldValidate: true })}>
              <SelectTrigger><SelectValue placeholder={t("order.wilaya")} /></SelectTrigger>
              <SelectContent className="max-h-60">
                {WILAYAS.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label={t("order.commune")} error={err.commune?.message}>
            <Input {...form.register("commune")} />
          </Field>
          <Field label={t("order.address")} error={err.address?.message} full>
            <Input {...form.register("address")} />
          </Field>
          <Field label={t("order.phone_1")} error={err.phone_1?.message}>
            <Input dir="ltr" {...form.register("phone_1")} placeholder="+213..." />
          </Field>
          <Field label={t("order.phone_2")}>
            <Input dir="ltr" {...form.register("phone_2")} />
          </Field>
          <Field label={t("order.email")}>
            <Input type="email" dir="ltr" {...form.register("email")} />
          </Field>
          {product.colors.length > 0 && (
            <Field label={t("order.color")}>
              <Select value={form.watch("selected_color")} onValueChange={(v) => form.setValue("selected_color", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {product.colors.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          )}
          <Field label={t("order.golden_card_number")} error={err.golden_card_number?.message}>
            <Input dir="ltr" inputMode="numeric" {...form.register("golden_card_number")} placeholder="0000 0000 0000" />
          </Field>
          <Field label={t("order.golden_card_expiry")} error={err.golden_card_expiry?.message}>
            <Input dir="ltr" {...form.register("golden_card_expiry")} placeholder="MM/YY" />
          </Field>
          <Field label={t("order.notes")} full>
            <Textarea rows={3} {...form.register("notes")} />
          </Field>
          <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={submitting} className="btn-glow">
              {submitting ? t("common.loading") : t("order.submit")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, error, full, children }: { label: string; error?: string; full?: boolean; children: React.ReactNode }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <Label className="text-sm font-medium mb-1.5 block">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
