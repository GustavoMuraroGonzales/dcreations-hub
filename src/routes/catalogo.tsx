import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { fetchCategories, fetchProducts } from "@/lib/products";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/catalogo")({
  head: () => ({
    meta: [
      { title: "Catálogo — Gonza3DLab" },
      { name: "description", content: "Miniaturas, peças técnicas, personalizados e protótipos em impressão 3D." },
      { property: "og:title", content: "Catálogo — Gonza3DLab" },
      { property: "og:description", content: "Explore nosso catálogo de peças impressas em 3D." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Catalogo,
});

function Catalogo() {
  const [filter, setFilter] = useState<string>("all");

  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts({ activeOnly: true }),
  });

  const visible = filter === "all" ? products : products.filter((p) => p.category?.slug === filter);

  return (
    <Layout>
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
          <p className="text-xs font-semibold uppercase text-primary">Peças reais</p>
          <h1 className="mt-3 font-display text-4xl font-bold md:text-5xl">Catálogo</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Peças prontas para produção. Cada item pode ser adaptado em cor, escala e material.
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
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
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
