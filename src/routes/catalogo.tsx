import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { products, categoryLabels, type ProductCategory } from "@/data/products";

export const Route = createFileRoute("/catalogo")({
  head: () => ({
    meta: [
      { title: "Catálogo — Gonza3DLab" },
      { name: "description", content: "Miniaturas, peças técnicas, personalizados e protótipos em impressão 3D." },
      { property: "og:title", content: "Catálogo — Gonza3DLab" },
      { property: "og:description", content: "Explore nosso catálogo de peças impressas em 3D." },
    ],
  }),
  component: Catalogo,
});

const filters: Array<{ id: "all" | ProductCategory; label: string }> = [
  { id: "all", label: "Todos" },
  { id: "miniaturas", label: categoryLabels.miniaturas },
  { id: "tecnicas", label: categoryLabels.tecnicas },
  { id: "personalizados", label: categoryLabels.personalizados },
  { id: "prototipos", label: categoryLabels.prototipos },
];

function Catalogo() {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const visible = filter === "all" ? products : products.filter((p) => p.category === filter);

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <h1 className="font-display text-4xl font-bold md:text-5xl">Catálogo</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Peças prontas para produção. Cada item pode ser adaptado em cor, escala e material.
        </p>

        <div className="mt-10 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                filter === f.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </Layout>
  );
}
