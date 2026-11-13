import { Link } from "@tanstack/react-router";
import type { ProductWithCategory } from "@/lib/products";
import { ProductQuoteAction } from "@/components/ProductQuoteAction";

export function ProductCard({ product }: { product: ProductWithCategory }) {
  return (
      <div className="group flex flex-col overflow-hidden rounded-md border border-border bg-card transition-colors hover:border-primary/50">
        <Link
          to="/produto/$id"
          params={{ id: product.slug }}
          className="relative aspect-square overflow-hidden bg-muted/50"
        >
          {product.cover_image_url ? (
            <img
              src={product.cover_image_url}
              alt={product.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center">
              <span className="font-display text-6xl font-bold text-muted-foreground/30">3D</span>
            </div>
          )}
          {product.category && (
            <div className="absolute left-3 top-3 rounded-sm border border-border bg-background px-3 py-1 text-xs font-medium">
              {product.category.name}
            </div>
          )}
        </Link>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <Link to="/produto/$id" params={{ id: product.slug }} className="group/title">
            <h3 className="font-display text-lg font-semibold group-hover:text-primary">{product.name}</h3>
          </Link>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.short_description}</p>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
            <span className="text-lg font-semibold">
              {product.price != null ? (
                `R$ ${Number(product.price).toFixed(2).replace(".", ",")}`
              ) : (
                <span className="text-sm text-muted-foreground">Sob consulta</span>
              )}
            </span>
            <ProductQuoteAction product={product} />
          </div>
        </div>
      </div>
  );
}

