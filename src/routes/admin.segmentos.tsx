import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { slugify } from "@/lib/products";
import { fetchSegments } from "@/lib/segments";
import { SITE_URL } from "@/lib/site";
import { Trash2, Plus, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/segmentos")({
  component: AdminSegments,
});

function AdminSegments() {
  const qc = useQueryClient();
  const { data: segments = [] } = useQuery({ queryKey: ["segments"], queryFn: fetchSegments });
  const [newName, setNewName] = useState("");
  const refresh = () => qc.invalidateQueries({ queryKey: ["segments"] });

  const create = useMutation({
    mutationFn: async (name: string) => {
      const { error } = await supabase.from("segments").insert({ name, slug: slugify(name) });
      if (error) throw error;
    },
    onSuccess: () => {
      refresh();
      setNewName("");
      toast.success("Tipo de cliente criado");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro"),
  });

  const update = useMutation({
    mutationFn: async (v: { id: string; name?: string; description?: string }) => {
      const { id, ...rest } = v;
      const { error } = await supabase.from("segments").update(rest).eq("id", id);
      if (error) throw error;
    },
    onSuccess: refresh,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("segments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      refresh();
      toast.success("Removido");
    },
  });

  const linkFor = (slug: string) => `${SITE_URL}/catalogo?para=${slug}`;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Tipos de cliente</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Crie listas como "Advocacia" ou "Clínicas", marque os produtos indicados no cadastro de cada produto e
        compartilhe o link. O cliente verá primeiro os produtos indicados para ele.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (newName.trim()) create.mutate(newName.trim());
        }}
        className="mt-6 flex gap-2"
      >
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Ex.: Advocacia"
          className="flex-1 rounded-md border border-border bg-background px-3 py-2"
        />
        <button
          type="submit"
          disabled={create.isPending}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground disabled:opacity-60"
        >
          <Plus className="h-4 w-4" /> Adicionar
        </button>
      </form>

      <div className="mt-8 space-y-3">
        {segments.map((s) => (
          <div key={s.id} className="rounded-md border border-border bg-background p-4">
            <div className="flex items-center gap-3">
              <input
                defaultValue={s.name}
                onBlur={(e) => e.target.value !== s.name && update.mutate({ id: s.id, name: e.target.value })}
                className="flex-1 rounded-md border border-transparent bg-transparent px-2 py-1 font-semibold hover:border-border focus:border-border"
              />
              <button
                onClick={() => confirm(`Excluir "${s.name}"?`) && remove.mutate(s.id)}
                className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                aria-label="Excluir"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <input
              defaultValue={s.description}
              placeholder="Mensagem para o cliente (opcional), ex.: Soluções para escritórios de advocacia"
              onBlur={(e) => e.target.value !== s.description && update.mutate({ id: s.id, description: e.target.value })}
              className="mt-2 w-full rounded-md border border-border bg-background px-2 py-1 text-sm"
            />
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <code className="rounded bg-muted px-2 py-1 text-xs">{linkFor(s.slug)}</code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(linkFor(s.slug));
                  toast.success("Link copiado");
                }}
                className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 hover:border-primary/50"
              >
                <Copy className="h-3 w-3" /> Copiar link
              </button>
              <a
                href={`/catalogo?para=${s.slug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 hover:border-primary/50"
              >
                <ExternalLink className="h-3 w-3" /> Ver
              </a>
            </div>
          </div>
        ))}
        {segments.length === 0 && (
          <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Nenhum tipo de cliente ainda.
          </div>
        )}
      </div>
    </div>
  );
}
