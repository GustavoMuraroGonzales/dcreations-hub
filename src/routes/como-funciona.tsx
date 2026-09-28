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
import { Button } from "@/components/ui/button";

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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
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
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-20">
          <p className="text-xs font-semibold uppercase text-primary">Fluxo de trabalho</p>
          <h1 className="mt-3 font-display text-4xl font-bold md:text-5xl">
            Como a Gonza3DLab trabalha
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
            Um mapa mental do caminho que sua peça faz — do primeiro "oi" no
            WhatsApp até chegar na sua mão.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-20">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.n}
                  className="rounded-md border border-border bg-card p-6 transition-colors hover:border-primary/50"
                >
                  <div className="flex items-center justify-between text-primary">
                    <Icon className="h-6 w-6" />
                    <span className="font-display text-sm font-semibold">{s.n}</span>
                  </div>
                  <h2 className="mt-5 font-display text-lg font-semibold">{s.title}</h2>
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
      </section>
      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center md:px-8 md:py-20">
          <h2 className="font-display text-2xl font-bold md:text-3xl">
            Pronto para começar seu projeto?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Conte sua ideia no WhatsApp e receba um orçamento em até 48h.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
            <a
              href={whatsappLink("Olá! Quero um orçamento.")}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="h-5 w-5" /> Orçamento rápido
            </a>
            </Button>
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
