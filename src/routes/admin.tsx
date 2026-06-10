import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { LayoutDashboard, ShoppingCart, Package, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Tirsam Algérie" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate({ to: "/auth", replace: true });
  }, [user, isAdmin, loading, navigate]);

  if (loading || !isAdmin) {
    return <div className="container-app py-16 text-center text-muted-foreground">جاري التحقق...</div>;
  }

  const links = [
    { to: "/admin", label: "الطلبات", icon: ShoppingCart },
    { to: "/admin/products", label: "المنتجات", icon: Package },
    { to: "/admin/settings", label: "الإعدادات", icon: Settings },
  ];

  async function logout() {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  return (
    <div className="container-app py-6 grid gap-6 md:grid-cols-[220px_1fr]">
      <aside className="space-y-1">
        <div className="flex items-center gap-2 mb-4 font-semibold">
          <LayoutDashboard className="h-5 w-5 text-primary" /> Admin
        </div>
        {links.map((l) => {
          const Icon = l.icon;
          const active = pathname === l.to;
          return (
            <Link key={l.to} to={l.to}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}>
              <Icon className="h-4 w-4" /> {l.label}
            </Link>
          );
        })}
        <Button onClick={logout} variant="ghost" size="sm" className="w-full justify-start gap-2 mt-4">
          <LogOut className="h-4 w-4" /> تسجيل الخروج
        </Button>
      </aside>
      <div className="min-h-[60vh]">
        <Outlet />
      </div>
    </div>
  );
}
