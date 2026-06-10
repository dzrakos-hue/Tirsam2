import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "تسجيل الدخول — Tirsam Algérie" }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: isAdmin ? "/admin" : "/", replace: true });
    }
  }, [user, isAdmin, loading, navigate]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const loginEmail = email.trim().toLowerCase() === "admin" ? "admin@vms.dz" : email.trim();
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("تم تسجيل الدخول");
  }

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${window.location.origin}/` },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("تم إنشاء الحساب! تحقق من بريدك.");
  }

  return (
    <div className="container-app py-16 max-w-md">
      <Card className="p-6 card-elevated">
        <h1 className="text-2xl font-bold mb-1">لوحة الإدارة</h1>
        <p className="text-sm text-muted-foreground mb-6">تسجيل دخول الإدارة فقط</p>
        <Tabs defaultValue="signin">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="signin">دخول</TabsTrigger>
            <TabsTrigger value="signup">حساب جديد</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <form onSubmit={signIn} className="space-y-3">
              <div><Label>Username أو Email</Label><Input dir="ltr" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin" /></div>
              <div><Label>كلمة المرور</Label><Input dir="ltr" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
              <Button type="submit" className="w-full btn-glow" disabled={busy}>{busy ? "..." : "دخول"}</Button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={signUp} className="space-y-3">
              <div><Label>Email</Label><Input dir="ltr" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
              <div><Label>كلمة المرور (6+ أحرف)</Label><Input dir="ltr" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
              <Button type="submit" className="w-full btn-glow" disabled={busy}>{busy ? "..." : "إنشاء حساب"}</Button>
              <p className="text-xs text-muted-foreground">للحصول على صلاحيات admin، اطلب من المسؤول إضافتك إلى جدول user_roles.</p>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
