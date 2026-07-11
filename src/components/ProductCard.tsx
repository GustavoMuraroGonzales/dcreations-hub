import { Link } from "@tanstack/react-router";
import { categoryLabels, type Product } from "@/data/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/produto/$id"
      params={{ id: product.id }}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]"
    >
      <div className={`relative aspect-square overflow-hidden bg-gradient-to-br ${product.color}`}>
        <div className="absolute inset-0 grid place-items-center">
          <span className="font-display text-6xl font-bold text-white/20">3D</span>
        </div>
        <div className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium">
          {categoryLabels[product.category]}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-lg font-semibold group-hover:text-primary">{product.name}</h3>
        <p className="text-sm text-muted-foreground">{product.shortDescription}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-lg font-semibold">
            {product.price ? `R$ ${product.price}` : <span className="text-sm text-muted-foreground">Sob consulta</span>}
          </span>
          <span className="text-sm font-medium text-primary">Ver →</span>
        </div>
      </div>
    </Link>
  );
}
