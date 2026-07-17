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
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <h1 className="font-display text-4xl font-bold md:text-5xl">Nossos serviços</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Trabalhamos com quatro linhas de impressão 3D, cada uma pensada para um tipo de necessidade.
        </p>

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {services.map((s) => (
            <div key={s.title} className="rounded-xl border border-border p-8 transition hover:border-primary/50">
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary/10 text-primary">
                <s.icon className="h-6 w-6" />
              </div>
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

        <div className="mt-16 rounded-2xl border border-secondary/30 bg-secondary/5 p-10 md:p-14">
          <h2 className="font-display text-3xl font-bold text-foreground">Não achou o que precisa?</h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Se você tem um projeto diferente, fale com a gente. Praticamente qualquer peça em plástico até 25 × 25 × 25 cm é possível.
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
