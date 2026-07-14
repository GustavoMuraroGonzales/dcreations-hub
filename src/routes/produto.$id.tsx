import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { fetchProductBySlug } from "@/lib/products";
import { whatsappLink } from "@/lib/contact";
import { ArrowLeft, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/produto/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Produto — Gonza3DLab` },
      { name: "description", content: "Detalhes do produto." },
      { property: "og:title", content: `Produto — Gonza3DLab` },
    ],
  }),
  component: ProdutoPage,
});

function ProdutoPage() {
  const { id: slug } = Route.useParams();
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProductBySlug(slug),
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (isLoading) {
    return (
      <Layout>
        <div className="mx-auto max-w-3xl px-4 py-24 text-center text-muted-foreground">Carregando...</div>
      </Layout>
    );
  }
  if (!product) {
    return (
      <Layout>
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <h1 className="font-display text-3xl font-bold">Produto não encontrado</h1>
          <Link to="/catalogo" className="mt-6 inline-flex text-primary hover:underline">
            ← Voltar ao catálogo
          </Link>
        </div>
      </Layout>
    );
  }

  const heroImg = selectedImage ?? product.cover_image_url ?? product.images[0]?.image_url ?? null;
  const msg = `Olá! Tenho interesse no produto "${product.name}" do site.`;

  return (
    <Layout>
      <section className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-20">
        <Link to="/catalogo" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar ao catálogo
        </Link>

        <div className="mt-8 grid gap-10 md:grid-cols-2">
          <div>
            <div className="aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-slate-700/40 to-slate-900/60 relative">
              {heroImg ? (
                <img src={heroImg} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <div className="absolute inset-0 grid place-items-center">
                  <span className="font-display text-9xl font-bold text-white/20">3D</span>
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {product.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img.image_url)}
                    className={`aspect-square overflow-hidden rounded-md border-2 transition ${
                      heroImg === img.image_url ? "border-primary" : "border-transparent hover:border-border"
                    }`}
                  >
                    <img src={img.image_url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            {product.category && (
              <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {product.category.name}
              </span>
            )}
            <h1 className="mt-4 font-display text-4xl font-bold md:text-5xl">{product.name}</h1>
            <p className="mt-4 text-lg text-muted-foreground whitespace-pre-line">{product.description}</p>

            <dl className="mt-6 grid grid-cols-2 gap-4 rounded-lg border border-border p-4">
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Material</dt>
                <dd className="mt-1 font-semibold">{product.material || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Preço</dt>
                <dd className="mt-1 font-semibold">
                  {product.price != null
                    ? `R$ ${Number(product.price).toFixed(2).replace(".", ",")}`
                    : "Sob consulta"}
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
