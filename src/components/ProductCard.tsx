import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { formatPrice, useI18n } from "@/lib/i18n";
import type { ProductRow } from "@/lib/types";

export function ProductCard({ product }: { product: ProductRow }) {
  const { t, lang } = useI18n();
  const name = lang === "fr" && product.name_fr ? product.name_fr : product.name;
  const img = product.images[0] || "/images/scooter-white.jpg";
  const discount = product.old_price && product.old_price > product.price;

  const statusLabel = t(`status.${product.status}`);
  const statusColor =
    product.status === "available" ? "bg-success/15 text-success border-success/30"
    : product.status === "coming_soon" ? "bg-warning/15 text-warning border-warning/30"
    : "bg-muted text-muted-foreground border-border";

  return (
    <Link
      to="/models/$slug"
      params={{ slug: product.slug }}
      className="group block card-elevated rounded-2xl overflow-hidden"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={img}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {discount && (
          <Badge className="absolute top-3 start-3 bg-primary text-primary-foreground">
            {t("product.discount")}
          </Badge>
        )}
        <span className={`absolute top-3 end-3 text-xs px-2 py-1 rounded-full border ${statusColor}`}>
          {statusLabel}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{name}</h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-xl font-extrabold text-primary">{formatPrice(product.price, lang)}</span>
          {discount && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.old_price!, lang)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
