import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-24 border-t border-border bg-card/40">
      <div className="container-app py-12 grid gap-8 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="grid h-8 w-8 place-items-center rounded-lg btn-glow font-black">V</span>
            VMS Algérie
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">{t("footer.tagline")}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-3">{t("footer.links")}</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/models" className="hover:text-foreground">{t("nav.models")}</Link></li>
            <li><Link to="/about" className="hover:text-foreground">{t("nav.about")}</Link></li>
            <li><Link to="/faq" className="hover:text-foreground">{t("nav.faq")}</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">{t("nav.contact")}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-3">{t("footer.legal")}</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/privacy" className="hover:text-foreground">{t("footer.privacy")}</Link></li>
            <li><Link to="/terms" className="hover:text-foreground">{t("footer.terms")}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-3">{t("nav.contact")}</h3>
          <p className="text-sm text-muted-foreground">📍 الجزائر</p>
          <p className="text-sm text-muted-foreground mt-1">📞 +213 000 000 000</p>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} VMS Algérie · {t("footer.rights")}
      </div>
    </footer>
  );
}
