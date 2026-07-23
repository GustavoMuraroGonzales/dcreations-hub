import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { whatsappLink } from "@/lib/contact";
import {
  MessageCircle,
  FileSearch,
  Wrench,
  Printer,
  Sparkles,
  PackageCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/como-funciona")({
  head: () => ({
    meta: [
      { title: "Como Trabalhamos — Fluxo de trabalho | Gonza3DLab" },
      {
        name: "description",
        content:
          "Do primeiro contato à entrega: veja o mapa mental do fluxo de trabalho da Gonza3DLab para impressão 3D sob demanda.",
      },
      { property: "og:title", content: "Como Trabalhamos — Gonza3DLab" },
      {
        property: "og:description",
        content: "Mapa mental do fluxo de trabalho da Gonza3DLab.",
      },
    ],
  }),
  component: ComoFunciona,
});

type Step = {
  n: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  details: string[];
};

const steps: Step[] = [
  {
    n: "01",
    title: "Contato & briefing",
    desc: "Você chama no WhatsApp ou envia o formulário com sua ideia.",
    icon: MessageCircle,
    details: ["Descrição do projeto", "Referências e imagens", "Prazo desejado"],
  },
  {
    n: "02",
    title: "Análise & orçamento",
    desc: "Avaliamos viabilidade, material ideal e enviamos o orçamento.",
    icon: FileSearch,
    details: ["Análise do STL", "Escolha do material", "Prazo e valor final"],
  },
  {
    n: "03",
    title: "Modelagem & ajustes",
    desc: "Se precisar, modelamos ou ajustamos o arquivo para impressão.",
    icon: Wrench,
    details: ["Modelagem 3D sob demanda", "Reparo de malha", "Otimização de suportes"],
  },
  {
    n: "04",
    title: "Impressão 3D",
    desc: "Sua peça entra na fila de impressão com controle de qualidade.",
    icon: Printer,
    details: ["FDM", "Camadas calibradas", "Acompanhamento do lote"],
  },
  {
    n: "05",
    title: "Acabamento",
    desc: "Removemos suportes, lixamos e finalizamos conforme a peça pede.",
    icon: Sparkles,
    details: ["Lixamento", "Pintura opcional"],
  },
  {
    n: "06",
    title: "Entrega",
    desc: "Retirada combinada ou envio para todo o Brasil.",
    icon: PackageCheck,
    details: ["Embalagem protegida", "Envio rastreado", "Suporte pós-entrega"],
  },
];

function ComoFunciona() {
  return (
    <Layout>
      <section className="mx-auto max-w-6xl px-4 py-20 md:px-8">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Fluxo de trabalho
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold md:text-5xl">
            Como a Gonza3DLab trabalha
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Um mapa mental do caminho que sua peça faz — do primeiro "oi" no
            WhatsApp até chegar na sua mão.
          </p>
        </div>

        {/* Mind map */}
        <div className="relative mt-16">
          {/* Center node */}
          <div className="mx-auto grid max-w-xs place-items-center rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/20 to-primary/5 p-6 text-center shadow-[var(--shadow-glow)]">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground">
              <Printer className="h-7 w-7" />
            </div>
            <div className="mt-3 font-display text-xl font-bold">Seu projeto 3D</div>
            <div className="text-xs text-muted-foreground">Do briefing à entrega</div>
          </div>

          {/* Branches */}
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.n}
                  className="group relative rounded-xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-[var(--shadow-glow)]"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                    {s.n}
                  </div>
                  <div className="mb-3 grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                  <ul className="mt-4 space-y-1.5">
                    {s.details.map((d) => (
                      <li key={d} className="flex items-start gap-2 text-sm">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span className="text-muted-foreground">{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-transparent p-8 text-center md:p-12">
          <h2 className="font-display text-2xl font-bold md:text-3xl">
            Pronto para começar seu projeto?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Conte sua ideia no WhatsApp e receba um orçamento rápido.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={whatsappLink("Olá! Quero um orçamento.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-[#25D366] px-6 py-3 font-semibold text-white shadow-lg transition hover:opacity-90"
            >
              <MessageCircle className="h-5 w-5" /> Orçamento rápido
            </a>
            <Link
              to="/contato"
              className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 font-semibold transition hover:border-primary/50"
            >
              Enviar formulário
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
