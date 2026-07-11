import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { getProduct, categoryLabels } from "@/data/products";
import { whatsappLink } from "@/lib/contact";
import { ArrowLeft, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/produto/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Gonza3DLab` },
          { name: "description", content: loaderData.product.shortDescription },
          { property: "og:title", content: `${loaderData.product.name} — Gonza3DLab` },
          { property: "og:description", content: loaderData.product.shortDescription },
        ]
      : [{ title: "Produto — Gonza3DLab" }, { name: "robots", content: "noindex" }],
  }),
  component: ProdutoPage,
  notFoundComponent: () => (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Produto não encontrado</h1>
        <Link to="/catalogo" className="mt-6 inline-flex text-primary hover:underline">
          ← Voltar ao catálogo
        </Link>
      </div>
    </Layout>
  ),
});

function ProdutoPage() {
  const { product } = Route.useLoaderData();
  const msg = `Olá! Tenho interesse no produto "${product.name}" do site.`;

  return (
    <Layout>
      <section className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-20">
        <Link to="/catalogo" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar ao catálogo
        </Link>

        <div className="mt-8 grid gap-10 md:grid-cols-2">
          <div className={`aspect-square overflow-hidden rounded-2xl bg-gradient-to-br ${product.color} relative`}>
            <div className="absolute inset-0 grid place-items-center">
              <span className="font-display text-9xl font-bold text-white/20">3D</span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {categoryLabels[product.category]}
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold md:text-5xl">{product.name}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{product.description}</p>

            <dl className="mt-6 grid grid-cols-2 gap-4 rounded-lg border border-border p-4">
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Material</dt>
                <dd className="mt-1 font-semibold">{product.material}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Preço</dt>
                <dd className="mt-1 font-semibold">
                  {product.price ? `R$ ${product.price}` : "Sob consulta"}
                </dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappLink(msg)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:opacity-90"
              >
                <MessageCircle className="h-5 w-5" /> Quero este produto
              </a>
              <Link
                to="/contato"
                className="inline-flex items-center justify-center rounded-md border border-border px-6 py-3 font-semibold transition hover:border-primary/50"
              >
                Fazer orçamento
              </Link>
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
              Envio para todo o Brasil. Prazo de produção informado no orçamento.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
