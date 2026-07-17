import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import type { ProductWithCategory } from "@/lib/products";
import { BuyModal } from "./BuyModal";

export function ProductCard({ product }: { product: ProductWithCategory }) {
  const [buyOpen, setBuyOpen] = useState(false);

  return (
    <>
      <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]">
        <Link
          to="/produto/$id"
          params={{ id: product.slug }}
          className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-700/40 to-slate-900/60"
        >
          {product.cover_image_url ? (
            <img
              src={product.cover_image_url}
              alt={product.name}
              className="h-full w-full object-cover transition group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center">
              <span className="font-display text-6xl font-bold text-white/20">3D</span>
            </div>
          )}
          {product.category && (
            <div className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium">
              {product.category.name}
            </div>
          )}
        </Link>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <Link to="/produto/$id" params={{ id: product.slug }} className="group/title">
            <h3 className="font-display text-lg font-semibold group-hover:text-primary">{product.name}</h3>
          </Link>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.short_description}</p>
          <div className="mt-auto flex items-center justify-between pt-3">
            <span className="text-lg font-semibold">
              {product.price != null ? (
                `R$ ${Number(product.price).toFixed(2).replace(".", ",")}`
              ) : (
                <span className="text-sm text-muted-foreground">Sob consulta</span>
              )}
            </span>
            <button
              type="button"
              onClick={() => setBuyOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
            >
              <ShoppingBag className="h-4 w-4" />
              Comprar
            </button>
          </div>
        </div>
      </div>
      <BuyModal product={product} open={buyOpen} onClose={() => setBuyOpen(false)} />
    </>
  );
}

