import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Languages } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const { t, lang, setLang } = useI18n();
  const { isAdmin, user } = useAuth();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/models", label: t("nav.models") },
    { to: "/about", label: t("nav.about") },
    { to: "/faq", label: t("nav.faq") },
    { to: "/contact", label: t("nav.contact") },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-md">
      <div className="container-app flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="grid h-9 w-9 place-items-center rounded-lg btn-glow font-black">V</span>
          <span className="tracking-wide">VMS Algérie</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              activeProps={{ className: "text-foreground bg-accent" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLang(lang === "ar" ? "fr" : "ar")}
            className="gap-1"
          >
            <Languages className="h-4 w-4" />
            <span className="text-xs font-semibold">{lang === "ar" ? "FR" : "AR"}</span>
          </Button>
          {isAdmin && (
            <Link to="/admin">
              <Button variant="outline" size="sm">{t("nav.admin")}</Button>
            </Link>
          )}
          {!user && (
            <Link to="/auth" className="hidden sm:block">
              <Button variant="ghost" size="sm">{t("nav.signin")}</Button>
            </Link>
          )}
          <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container-app flex flex-col py-2">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-3 py-3 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                {l.label}
              </Link>
            ))}
            {!user && (
              <Link to="/auth" onClick={() => setOpen(false)} className="px-3 py-3 text-sm">
                {t("nav.signin")}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
