import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { fetchProducts } from "@/lib/products";
import { ArrowRight, Boxes, Cog, Sparkles, Zap } from "lucide-react";
import heroImg from "@/assets/hero-printer.jpg";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { data: featured = [] } = useQuery({
    queryKey: ["products-featured"],
    queryFn: () => fetchProducts({ activeOnly: true, limit: 4 }),
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-graphite text-graphite-foreground">
        <div className="absolute inset-0 opacity-40">
          <img src={heroImg} alt="" width={1600} height={1200} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-graphite via-graphite/80 to-transparent" />
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-24 md:grid-cols-2 md:px-8 md:py-32">
          <div className="flex flex-col justify-center">
            <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Zap className="h-3 w-3" /> Impressão 3D em São Paulo
            </span>
            <h1 className="font-display text-5xl font-bold leading-tight md:text-6xl">
              Do arquivo <span className="text-primary">à peça pronta</span> em dias.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-graphite-foreground/70">
              Miniaturas detalhadas, peças técnicas resistentes, personalizados únicos e protótipos funcionais.
              Impressão 3D de qualidade para você ou sua empresa.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/catalogo"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:opacity-90"
              >
                Ver catálogo <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contato"
                className="inline-flex items-center gap-2 rounded-md border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Fazer orçamento
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Serviços resumo */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">O que fazemos</h2>
            <p className="mt-2 text-muted-foreground">Quatro linhas de trabalho, uma qualidade só.</p>
          </div>
          <Link to="/servicos" className="text-sm font-semibold text-primary hover:underline">
            Ver todos os serviços →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Boxes, title: "Miniaturas", desc: "Para RPG, coleção e maquetes." },
            { icon: Cog, title: "Peças técnicas", desc: "Suportes, engrenagens, reposição." },
            { icon: Sparkles, title: "Personalizados", desc: "Presentes, brindes e ideias únicas." },
            { icon: Zap, title: "Protótipos", desc: "Do STL à peça funcional." },
          ].map((s) => (
            <div key={s.title} className="rounded-xl border border-border p-6 transition hover:border-primary/50">
              <s.icon className="h-8 w-8 text-primary" />
              <h3 className="mt-4 font-display text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Destaques do catálogo */}
      {featured.length > 0 && (
        <section className="bg-muted/50 py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h2 className="font-display text-3xl font-bold md:text-4xl">Em destaque</h2>
                <p className="mt-2 text-muted-foreground">Peças recém-saídas da impressora.</p>
              </div>
              <Link to="/catalogo" className="text-sm font-semibold text-primary hover:underline">
                Ver catálogo completo →
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
        <div className="rounded-2xl bg-graphite p-10 text-center text-graphite-foreground md:p-16">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Tem uma ideia? A gente <span className="text-primary">imprime</span>.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-graphite-foreground/70">
            Envie seu arquivo STL ou descreva o que precisa. Respondemos com prazo e orçamento em até 24h.
          </p>
          <Link
            to="/contato"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-8 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Começar agora <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
