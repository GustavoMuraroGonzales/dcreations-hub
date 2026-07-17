import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { RealPiecesGallery } from "@/components/RealPiecesGallery";
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
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 bg-grid opacity-60" aria-hidden />
        <div className="absolute inset-0 opacity-10">
          <img src={heroImg} alt="" width={1600} height={1200} fetchPriority="high" decoding="async" className="h-full w-full object-cover" />
        </div>
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/25 blur-3xl animate-float" aria-hidden />
        <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-secondary/25 blur-3xl animate-float" style={{ animationDelay: "-3s" }} aria-hidden />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-24 md:grid-cols-2 md:px-8 md:py-32">
          <div className="flex flex-col justify-center">
            <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary shadow-[var(--shadow-soft)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Impressão 3D em São Paulo
            </span>
            <h1 className="font-display text-5xl font-bold leading-[1.05] text-foreground md:text-6xl lg:text-7xl">
              Do arquivo <span className="text-gradient-primary">à peça pronta</span> em dias.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              Miniaturas detalhadas, peças técnicas resistentes, personalizados únicos e protótipos funcionais.
              Impressão 3D de qualidade para você ou sua empresa.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/catalogo"
                className="group inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:-translate-y-0.5 hover:opacity-95"
              >
                Ver catálogo <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contato"
                className="inline-flex items-center gap-2 rounded-md border border-secondary/40 bg-secondary/5 px-6 py-3 font-semibold text-secondary transition hover:bg-secondary/10 hover:-translate-y-0.5"
              >
                Fazer orçamento
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> Entrega em até 7 dias</div>
              <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-secondary" /> Orçamento em 24h</div>
              <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-graphite" /> +100 peças entregues</div>
            </div>
          </div>
        </div>
        {/* Diagonal divider */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-b from-transparent to-background" aria-hidden />
      </section>



      {/* Serviços resumo */}
      <section className="relative mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="mb-3 inline-block rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-secondary">Serviços</span>
            <h2 className="font-display text-3xl font-bold md:text-4xl">O que fazemos</h2>
            <p className="mt-2 text-muted-foreground">Quatro linhas de trabalho, uma qualidade só.</p>
          </div>
          <Link to="/servicos" className="text-sm font-semibold text-primary hover:underline">
            Ver todos os serviços →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Boxes, title: "Miniaturas", desc: "Para RPG, coleção e maquetes.", accent: "primary" },
            { icon: Cog, title: "Peças técnicas", desc: "Suportes, engrenagens, reposição.", accent: "secondary" },
            { icon: Sparkles, title: "Personalizados", desc: "Presentes, brindes e ideias únicas.", accent: "primary" },
            { icon: Zap, title: "Protótipos", desc: "Do STL à peça funcional.", accent: "secondary" },
          ].map((s) => (
            <div
              key={s.title}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-glow)]"
            >
              <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full ${s.accent === "primary" ? "bg-primary/10" : "bg-secondary/10"} blur-2xl transition-opacity group-hover:opacity-100`} aria-hidden />
              <div className={`relative inline-flex h-12 w-12 items-center justify-center rounded-lg ${s.accent === "primary" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"}`}>
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="relative mt-4 font-display text-xl font-semibold">{s.title}</h3>
              <p className="relative mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>


      {/* Destaques do catálogo */}
      {featured.length > 0 && (
        <section className="relative overflow-hidden bg-muted/40 py-20">
          <div className="absolute inset-0 bg-dots opacity-50" aria-hidden />
          <div className="relative mx-auto max-w-7xl px-4 md:px-8">
            <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
              <div>
                <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">Catálogo</span>
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

      {/* Galeria de peças reais */}
      <RealPiecesGallery />

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/15 via-background to-secondary/15 p-10 text-center shadow-[var(--shadow-elegant)] md:p-16">
          <div className="absolute inset-0 bg-grid opacity-40" aria-hidden />
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/30 blur-3xl animate-float" aria-hidden />
          <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-secondary/30 blur-3xl animate-float" style={{ animationDelay: "-3s" }} aria-hidden />
          <div className="relative">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/60 px-3 py-1 text-xs font-medium text-primary backdrop-blur">
              <Sparkles className="h-3 w-3" /> Pronto para começar?
            </span>
            <h2 className="font-display text-3xl font-bold text-foreground md:text-5xl">
              Tem uma ideia? A gente <span className="text-gradient-primary">imprime</span>.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Envie seu arquivo STL ou descreva o que precisa. Respondemos com prazo e orçamento em até 24h.
            </p>
            <Link
              to="/contato"
              className="group mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-8 py-3 font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:-translate-y-0.5 hover:opacity-95"
            >
              Começar agora <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

    </Layout>
  );
}
