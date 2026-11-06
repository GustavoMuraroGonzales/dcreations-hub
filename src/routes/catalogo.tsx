import { createFileRoute, useNavigate, stripSearchParams } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { fetchSegmentBySlug, orderBySegment } from "@/lib/segments";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { fetchCategories, fetchProducts } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { canonical } from "@/lib/site";

const searchSchema = z.object({
  categoria: fallback(z.string(), "").default(""),
  para: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/catalogo")({
  validateSearch: zodValidator(searchSchema),
  search: { middlewares: [stripSearchParams({ categoria: "", para: "" })] },
  head: () => ({
    meta: [
      { title: "Catálogo — Gonza3DLab" },
      { name: "description", content: "Miniaturas, peças técnicas, personalizados e protótipos em impressão 3D." },
      { property: "og:title", content: "Catálogo — Gonza3DLab" },
      { property: "og:description", content: "Explore nosso catálogo de peças impressas em 3D." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical("/catalogo") },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: canonical("/catalogo") }],
  }),
  component: Catalogo,
});

function Catalogo() {
  const { categoria, para } = Route.useSearch();
  const navigate = useNavigate({ from: "/catalogo" });
  const filter = categoria || "all";
  const setFilter = (slug: string) =>
    navigate({ search: (prev) => ({ ...prev, categoria: slug === "all" ? "" : slug }), replace: true });
  const { data: seg } = useQuery({
    queryKey: ["segment", para],
    queryFn: () => fetchSegmentBySlug(para),
    enabled: !!para,
  });

  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts({ activeOnly: true }),
  });

  const visible = filter === "all" ? products : products.filter((p) => p.category?.slug === filter);
  const { recommended, others } = seg ? orderBySegment(visible, seg.productIds) : { recommended: [], others: visible };

  return (
    <Layout>
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
          <p className="text-xs font-semibold uppercase text-primary">
            {seg ? "Seleção especial" : "Peças reais"}
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold md:text-5xl">
            {seg ? `Catálogo para ${seg.segment.name}` : "Catálogo"}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            {seg?.segment.description ||
              (seg
                ? `Separamos primeiro os produtos indicados para ${seg.segment.name}. Logo abaixo, o catálogo completo.`
                : "Peças prontas para produção. Cada item pode ser adaptado em cor, escala e material.")}
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <div className="flex flex-wrap gap-2" aria-label="Filtrar por categoria">
          <FilterBtn active={filter === "all"} onClick={() => setFilter("all")}>Todos</FilterBtn>
          {categories.map((c) => (
            <FilterBtn key={c.id} active={filter === c.slug} onClick={() => setFilter(c.slug)}>
              {c.name}
            </FilterBtn>
          ))}
        </div>

        {isLoading ? (
          <p className="mt-10 text-muted-foreground" role="status">Carregando...</p>
        ) : visible.length === 0 ? (
          <p className="mt-10 text-muted-foreground">Nenhum produto disponível nesta categoria.</p>
        ) : (
          <>
            {recommended.length > 0 && (
              <>
                <h2 className="mt-10 font-display text-2xl font-bold">Indicados para {seg!.segment.name}</h2>
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {recommended.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </>
            )}
            {others.length > 0 && (
              <>
                {recommended.length > 0 && (
                  <h2 className="mt-14 font-display text-2xl font-bold">Outros produtos</h2>
                )}
                <div className={`${recommended.length > 0 ? "mt-6" : "mt-10"} grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`}>
                  {others.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </section>
    </Layout>
  );
}

function FilterBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <Button
      type="button"
      variant={active ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      aria-pressed={active}
      className="min-h-9"
    >
      {children}
    </Button>
  );
}
