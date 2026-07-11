import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre — Gonza3DLab" },
      { name: "description", content: "Conheça a Gonza3DLab: paixão por impressão 3D, precisão e atendimento próximo." },
      { property: "og:title", content: "Sobre — Gonza3DLab" },
      { property: "og:description", content: "Nossa história e nosso jeito de trabalhar." },
    ],
  }),
  component: Sobre,
});

function Sobre() {
  return (
    <Layout>
      <section className="mx-auto max-w-4xl px-4 py-20 md:px-8">
        <h1 className="font-display text-4xl font-bold md:text-5xl">Sobre a Gonza3DLab</h1>

        <div className="mt-8 space-y-6 text-lg text-muted-foreground">
          <p>
            A <strong className="text-foreground">Gonza3DLab</strong> nasceu da paixão por transformar ideias em objetos reais.
            Combinamos impressão 3D de alta precisão, materiais de qualidade e atendimento próximo para atender pessoas e empresas.
          </p>
          <p>
            Trabalhamos com quatro linhas: <strong className="text-foreground">miniaturas</strong>,{" "}
            <strong className="text-foreground">peças técnicas</strong>,{" "}
            <strong className="text-foreground">personalizados</strong> e{" "}
            <strong className="text-foreground">protótipos</strong>. Cada projeto passa por conferência antes de ser entregue.
          </p>
          <p>
            Se você tem um arquivo STL, uma peça quebrada ou apenas uma ideia — a gente ajuda a tirar do papel.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { n: "500+", l: "Peças impressas" },
            { n: "48h", l: "Prazo médio" },
            { n: "100%", l: "Compromisso com qualidade" },
          ].map((s) => (
            <div key={s.l} className="rounded-xl border border-border p-6 text-center">
              <div className="font-display text-4xl font-bold text-primary">{s.n}</div>
              <div className="mt-2 text-sm text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <Link to="/contato" className="inline-flex rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90">
            Falar com a gente
          </Link>
        </div>
      </section>
    </Layout>
  );
}
