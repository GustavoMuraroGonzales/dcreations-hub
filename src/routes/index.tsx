import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { InstagramFeed } from "@/components/InstagramFeed";
import { fetchProducts } from "@/lib/products";
import { ArrowRight, Boxes, Cog, Package, Ruler, Sparkles, Headset, Zap } from "lucide-react";
import heroImg from "@/assets/hero-printer.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gonza3DLab — Impressão 3D sob medida e peças prontas" },
      {
        name: "description",
        content:
          "Impressão 3D FDM de alta precisão: miniaturas, peças técnicas, personalizados e protótipos. Orçamento em até 48h e entrega rápida.",
      },
      { property: "og:title", content: "Gonza3DLab — Impressão 3D sob medida e peças prontas" },
      {
        property: "og:description",
        content:
          "Da ideia ou arquivo STL à peça impressa. Orçamento em até 48h, acabamento cuidadoso e envio para todo o Brasil.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const DIFFERENTIALS = [
  { icon: Ruler, title: "Precisão dimensional", desc: "Camadas de 0,12 a 0,28 mm conforme a peça." },
  { icon: Package, title: "Filamentos selecionados", desc: "PLA, PETG e ABS para cada aplicação." },
  { icon: Headset, title: "Atendimento direto", desc: "Você fala com quem imprime a sua peça." },
  { icon: Zap, title: "Orçamento em até 48h", desc: "Resposta com prazo, material e valor." },
];

const STEPS = [
  { n: "01", title: "Envie o modelo ou a ideia", desc: "Arquivo STL, desenho, foto ou apenas a descrição do que precisa." },
  { n: "02", title: "Análise e orçamento", desc: "Avaliamos material, resistência e acabamento e respondemos em até 48h." },
  { n: "03", title: "Impressão e envio", desc: "Produzimos, revisamos peça a peça e enviamos para todo o Brasil." },
];

const SERVICES = [
  { icon: Boxes, title: "Miniaturas", desc: "Para RPG, coleção e maquetes." },
  { icon: Cog, title: "Peças técnicas", desc: "Suportes, engrenagens e reposição." },
  { icon: Sparkles, title: "Personalizados", desc: "Presentes, brindes e ideias únicas." },
  { icon: Zap, title: "Protótipos", desc: "Do STL à peça funcional." },
];

function Home() {
  const { data: pieces = [] } = useQuery({
    queryKey: ["products-showcase"],
    queryFn: () => fetchProducts({ activeOnly: true, limit: 8 }),
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 md:grid-cols-2 md:px-8 md:py-28">
          <div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Impressão 3D FDM · São Paulo
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.08] text-foreground md:text-5xl lg:text-6xl">
              Da ideia ou arquivo STL <br className="hidden lg:block" />
              <span className="text-primary">à peça pronta</span>.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Miniaturas detalhadas, peças técnicas resistentes, personalizados e protótipos funcionais —
              impressos com acabamento cuidadoso para você ou para a sua empresa.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/contato"
                className="group inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Solicitar orçamento
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/catalogo"
                className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 font-semibold text-foreground transition hover:border-primary/50 hover:text-primary"
              >
                Explorar catálogo
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted-foreground">
              <span>Entrega rápida</span>
              <span className="text-border">|</span>
              <span>Orçamento em até 48h</span>
              <span className="text-border">|</span>
              <span>+100 peças entregues</span>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-border bg-muted/40">
              <img
                src={heroImg}
                alt="Impressora 3D produzindo uma peça na Gonza3DLab"
                width={1600}
                height={1200}
                fetchPriority="high"
                decoding="async"
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="grid grid-cols-3 divide-x divide-border border-t border-border bg-card text-center">
                <div className="px-3 py-4">
                  <p className="font-display text-sm font-semibold text-foreground">PLA · PETG · ABS</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Materiais</p>
                </div>
                <div className="px-3 py-4">
                  <p className="font-display text-sm font-semibold text-foreground">0,12 mm</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Camada mínima</p>
                </div>
                <div className="px-3 py-4">
                  <p className="font-display text-sm font-semibold text-foreground">até 48h</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Orçamento</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 md:px-8 lg:grid-cols-4">
          {DIFFERENTIALS.map((d) => (
            <div key={d.title} className="flex gap-3">
              <d.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <h3 className="font-display text-sm font-semibold text-foreground">{d.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{d.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Como trabalhamos */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">Como trabalhamos</p>
          <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">Três passos até a sua peça</h2>
        </div>
        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="bg-card p-8">
              <span className="font-display text-sm font-semibold text-primary">{s.n}</span>
              <h3 className="mt-3 font-display text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
        <Link to="/como-funciona" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
          Ver o fluxo completo <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* Serviços */}
      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">Serviços</p>
              <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">O que fazemos</h2>
            </div>
            <Link to="/servicos" className="text-sm font-semibold text-primary hover:underline">
              Ver todos os serviços →
            </Link>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="rounded-xl border border-border bg-card p-6 transition hover:border-primary/50"
              >
                <s.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-4 font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vitrine unificada */}
      {pieces.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">Peças reais</p>
              <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">Impressas aqui no laboratório</h2>
              <p className="mt-2 text-muted-foreground">Fotos das peças que saíram da nossa impressora — sem render.</p>
            </div>
            <Link to="/catalogo" className="text-sm font-semibold text-primary hover:underline">
              Ver catálogo completo →
            </Link>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pieces.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Instagram */}
      <InstagramFeed />

      {/* CTA */}
      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center md:px-8">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Tem uma ideia? Nós <span className="text-primary">imprimimos</span>!
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Envie seu arquivo STL ou descreva o que precisa. Respondemos com prazo e orçamento em até 48h.
          </p>
          <Link
            to="/contato"
            className="group mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-8 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Começar agora <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
