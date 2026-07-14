import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fetchCategories, slugify, type Category } from "@/lib/products";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/categorias")({
  component: AdminCategories,
});

function AdminCategories() {
  const qc = useQueryClient();
  const { data: categories = [] } = useQuery({ queryKey: ["admin-categories"], queryFn: fetchCategories });

  const [newName, setNewName] = useState("");

  const create = useMutation({
    mutationFn: async (name: string) => {
      const slug = slugify(name);
      const { error } = await supabase.from("categories").insert({ name, slug });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      qc.invalidateQueries({ queryKey: ["categories"] });
      setNewName("");
      toast.success("Categoria criada");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoria removida");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro"),
  });

  const update = useMutation({
    mutationFn: async (c: Category) => {
      const { error } = await supabase
        .from("categories")
        .update({ name: c.name, sort_order: c.sort_order })
        .eq("id", c.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-categories"] }),
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Categorias</h1>

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
          placeholder="Nova categoria"
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

      <div className="mt-8 divide-y divide-border rounded-lg border border-border bg-background">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center gap-3 p-3">
            <input
              defaultValue={c.name}
              onBlur={(e) => {
                if (e.target.value !== c.name) update.mutate({ ...c, name: e.target.value });
              }}
              className="flex-1 rounded-md border border-transparent bg-transparent px-2 py-1 hover:border-border focus:border-border"
            />
            <input
              type="number"
              defaultValue={c.sort_order}
              onBlur={(e) => {
                const v = parseInt(e.target.value) || 0;
                if (v !== c.sort_order) update.mutate({ ...c, sort_order: v });
              }}
              className="w-20 rounded-md border border-border bg-background px-2 py-1 text-sm"
              title="Ordem"
            />
            <span className="text-xs text-muted-foreground">/{c.slug}</span>
            <button
              onClick={() => {
                if (confirm(`Excluir categoria "${c.name}"?`)) remove.mutate(c.id);
              }}
              className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="p-6 text-center text-sm text-muted-foreground">Nenhuma categoria ainda.</div>
        )}
      </div>
    </div>
  );
}
