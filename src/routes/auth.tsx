import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useSession } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar — Gonza3DLab" },
      { name: "description", content: "Acesso à área administrativa." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { session, loading } = useSession();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && session) navigate({ to: "/admin" });
  }, [session, loading, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Conta criada! Você já pode entrar.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bem-vindo!");
        navigate({ to: "/admin" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao autenticar");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Erro ao entrar com Google");
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/admin" });
  }

  return (
    <Layout>
      <section className="mx-auto max-w-md px-4 py-20">
        <h1 className="font-display text-3xl font-bold">
          {mode === "signin" ? "Entrar" : "Criar conta"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Acesso restrito à área administrativa.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Senha</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground disabled:opacity-60"
          >
            {busy ? "Aguarde..." : mode === "signin" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> ou <div className="h-px flex-1 bg-border" />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={busy}
          className="w-full rounded-md border border-border bg-background px-4 py-2 font-medium hover:border-primary/40"
        >
          Continuar com Google
        </button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "signin" ? (
            <>
              Não tem conta?{" "}
              <button className="text-primary hover:underline" onClick={() => setMode("signup")}>
                Criar conta
              </button>
            </>
          ) : (
            <>
              Já tem conta?{" "}
              <button className="text-primary hover:underline" onClick={() => setMode("signin")}>
                Entrar
              </button>
            </>
          )}
        </p>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          <Link to="/">← Voltar ao site</Link>
        </p>
      </section>
    </Layout>
  );
}
