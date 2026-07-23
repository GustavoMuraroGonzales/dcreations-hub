import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { EMAIL, INSTAGRAM, whatsappLink } from "@/lib/contact";
import { Mail, MessageCircle, Instagram } from "lucide-react";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Gonza3DLab" },
      { name: "description", content: "Fale com a Gonza3DLab. Orçamentos por WhatsApp, e-mail ou formulário." },
      { property: "og:title", content: "Contato — Gonza3DLab" },
      { property: "og:description", content: "Fale com a Gonza3DLab para orçamento." },
    ],
  }),
  component: Contato,
});

function Contato() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const msg = `Olá! Sou ${form.name} (${form.email}).\n\n${form.message}`;
    window.open(whatsappLink(msg), "_blank");
  }

  return (
    <Layout>
      <section className="mx-auto max-w-6xl px-4 py-20 md:px-8">
        <h1 className="font-display text-4xl font-bold md:text-5xl">Vamos conversar</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Envie seu arquivo STL, tire dúvidas ou peça um orçamento. Respondemos em até 48h.
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_360px]">
          <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border p-6 md:p-8">
            <div>
              <label className="text-sm font-medium">Nome</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium">E-mail</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Mensagem</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Conte sobre seu projeto, quantidade, prazo desejado…"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:opacity-90"
            >
              <MessageCircle className="h-5 w-5" /> Enviar via WhatsApp
            </button>
            <p className="text-xs text-muted-foreground">
              Ao enviar, abrimos uma conversa no WhatsApp com sua mensagem pronta.
            </p>
          </form>

          <div className="space-y-4">
            <a
              href={whatsappLink("Olá! Vim pelo site.")}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 rounded-xl border border-border p-5 transition hover:border-primary/50"
            >
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold">WhatsApp</div>
                <div className="text-sm text-muted-foreground">Resposta rápida</div>
              </div>
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="flex items-center gap-4 rounded-xl border border-border p-5 transition hover:border-primary/50"
            >
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold">E-mail</div>
                <div className="text-sm text-muted-foreground">{EMAIL}</div>
              </div>
            </a>
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 rounded-xl border border-border p-5 transition hover:border-primary/50"
            >
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
                <Instagram className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold">Instagram</div>
                <div className="text-sm text-muted-foreground">@gonza3dlab</div>
              </div>
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
