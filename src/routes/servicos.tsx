import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Boxes, Cog, Sparkles, Zap, Check } from "lucide-react";

export const Route = createFileRoute("/servicos")({
  head: () => ({
    meta: [
      { title: "Serviços — Gonza3DLab" },
      { name: "description", content: "Impressão 3D sob demanda: miniaturas, peças técnicas, personalizados e protótipos." },
      { property: "og:title", content: "Serviços — Gonza3DLab" },
      { property: "og:description", content: "Impressão 3D sob demanda com qualidade e precisão." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Servicos,
});

const services = [
  {
    icon: Boxes,
    title: "Miniaturas",
    desc: "Miniaturas para RPG, coleção, dioramas e maquetes arquitetônicas. Impressão FDM com alta qualidade de camada e pintura opcional.",
    bullets: ["FDM com camadas finas", "Escala configurável", "Pintura sob pedido"],
  },
  {
    icon: Cog,
    title: "Peças técnicas",
    desc: "Suportes, engrenagens, buchas, gabinetes e peças de reposição. Impressão em materiais resistentes como PETG, ABS e Nylon.",
    bullets: ["PETG, ABS, Nylon, PLA+", "Alta precisão dimensional", "Fabricamos a partir de medidas ou peça original"],
  },
  {
    icon: Sparkles,
    title: "Personalizados",
    desc: "Chaveiros, decoração, brindes corporativos e presentes únicos. Personalizamos com nome, logo ou ideia própria.",
    bullets: ["Cores variadas", "Personalização com nome/logo", "Ideal para brindes e presentes"],
  },
  {
    icon: Zap,
    title: "Protótipos",
    desc: "Do STL à peça funcional. Prototipagem rápida para validação de produto, mecanismos articulados e apresentações.",
    bullets: ["Aceitamos seu STL/STEP", "Print-in-place e montagens", "Prazos rápidos"],
  },
];

function Servicos() {
  return (
    <Layout>
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
          <p className="text-xs font-semibold uppercase text-primary">Impressão 3D FDM</p>
          <h1 className="mt-3 font-display text-4xl font-bold md:text-5xl">Nossos serviços</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Trabalhamos com quatro linhas de impressão 3D, cada uma pensada para um tipo de necessidade.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((s) => (
            <div key={s.title} className="rounded-md border border-border bg-card p-6 transition-colors hover:border-primary/50 md:p-8">
              <s.icon className="h-6 w-6 text-primary" />
              <h2 className="mt-5 font-display text-2xl font-semibold">{s.title}</h2>
              <p className="mt-3 text-muted-foreground">{s.desc}</p>
              <ul className="mt-5 space-y-2">
                {s.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </section>
      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
          <h2 className="font-display text-3xl font-bold text-foreground">Não achou o que precisa?</h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Se você tem um projeto diferente, fale conosco. Praticamente qualquer peça em plástico até 25 × 25 × 25 cm é possível.
          </p>
          <Link
            to="/contato"
            className="mt-6 inline-flex rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90"
          >
            Falar sobre meu projeto
          </Link>
        </div>
      </section>
    </Layout>
  );
}
