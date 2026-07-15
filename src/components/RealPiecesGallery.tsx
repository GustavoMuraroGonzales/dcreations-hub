import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Camera } from "lucide-react";
import { fetchProducts } from "@/lib/products";

export function RealPiecesGallery() {
  const { data: pieces = [] } = useQuery({
    queryKey: ["gallery-real-pieces"],
    queryFn: () => fetchProducts({ activeOnly: true, limit: 8 }),
  });

  const withImages = pieces.filter((p) => p.cover_image_url);
  if (withImages.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
      <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Camera className="h-3 w-3" /> Galeria
          </span>
          <h2 className="font-display text-3xl font-bold md:text-4xl">Peças reais impressas</h2>
          <p className="mt-2 text-muted-foreground">
            Fotos das peças que saíram da nossa impressora — sem render, sem retoque.
          </p>
        </div>
        <Link to="/catalogo" className="text-sm font-semibold text-primary hover:underline">
          Ver catálogo completo →
        </Link>
      </div>

      <div className="grid auto-rows-[220px] grid-cols-2 gap-4 md:grid-cols-4">
        {withImages.map((p, i) => {
          // Padrão masonry: 1ª e 6ª ocupam 2 linhas; 4ª ocupa 2 colunas em md+
          const rowSpan = i === 0 || i === 5 ? "row-span-2" : "";
          const colSpan = i === 3 ? "md:col-span-2" : "";
          return (
            <Link
              key={p.id}
              to="/produto/$id"
              params={{ id: p.slug }}
              className={`group relative overflow-hidden rounded-xl border border-border bg-muted ${rowSpan} ${colSpan}`}
            >
              <img
                src={p.cover_image_url!}
                alt={p.name}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-90 transition group-hover:opacity-100" />
              {p.category && (
                <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-medium text-foreground">
                  {p.category.name}
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <h3 className="font-display text-base font-semibold leading-tight md:text-lg">{p.name}</h3>
                {p.short_description && (
                  <p className="mt-1 line-clamp-2 text-xs text-white/80 md:text-sm">{p.short_description}</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
