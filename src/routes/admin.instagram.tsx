import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Instagram, Plus, Trash2, Edit2, Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  listInstagramPostsAdmin,
  createInstagramPost,
  updateInstagramPost,
  deleteInstagramPost,
} from "@/lib/instagram-posts.functions";
import type { InstagramPost } from "@/lib/instagram-posts";

export const Route = createFileRoute("/admin/instagram")({
  component: AdminInstagramPage,
  head: () => ({
    title: "Instagram | Admin Gonza3DLab",
    meta: [
      { name: "description", content: "Gerencie os posts do Instagram exibidos no site." },
      { property: "og:title", content: "Instagram | Admin Gonza3DLab" },
      { property: "og:description", content: "Gerencie os posts do Instagram exibidos no site." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function AdminInstagramPage() {
  const queryClient = useQueryClient();
  const listFn = useServerFn(listInstagramPostsAdmin);
  const createFn = useServerFn(createInstagramPost);
  const updateFn = useServerFn(updateInstagramPost);
  const deleteFn = useServerFn(deleteInstagramPost);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["admin-instagram-posts"],
    queryFn: () => listFn(),
  });

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    post_url: "",
    caption: "",
    sort_order: 0,
    is_active: true,
  });

  const createMutation = useMutation({
    mutationFn: (data: {
      post_url: string;
      caption?: string;
      sort_order?: number;
      is_active?: boolean;
    }) => createFn({ data }),
    onSuccess: () => {
      toast.success("Post adicionado!");
      queryClient.invalidateQueries({ queryKey: ["admin-instagram-posts"] });
      queryClient.invalidateQueries({ queryKey: ["instagram-posts"] });
      resetForm();
      setIsCreating(false);
    },
    onError: (err: any) => toast.error(err?.message || "Erro ao adicionar post."),
  });

  const updateMutation = useMutation({
    mutationFn: (data: {
      id: string;
      post_url: string;
      caption?: string;
      sort_order?: number;
      is_active?: boolean;
    }) => updateFn({ data }),
    onSuccess: () => {
      toast.success("Post atualizado!");
      queryClient.invalidateQueries({ queryKey: ["admin-instagram-posts"] });
      queryClient.invalidateQueries({ queryKey: ["instagram-posts"] });
      setEditingId(null);
      resetForm();
    },
    onError: (err: any) => toast.error(err?.message || "Erro ao atualizar post."),
  });

  const deleteMutation = useMutation({
    mutationFn: (data: { id: string }) => deleteFn({ data }),
    onSuccess: () => {
      toast.success("Post removido!");
      queryClient.invalidateQueries({ queryKey: ["admin-instagram-posts"] });
      queryClient.invalidateQueries({ queryKey: ["instagram-posts"] });
    },
    onError: (err: any) => toast.error(err?.message || "Erro ao remover post."),
  });

  function resetForm() {
    setForm({ post_url: "", caption: "", sort_order: 0, is_active: true });
  }

  function startEdit(post: InstagramPost) {
    setEditingId(post.id);
    setForm({
      post_url: post.post_url,
      caption: post.caption ?? "",
      sort_order: post.sort_order ?? 0,
      is_active: post.is_active,
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.post_url.trim()) {
      toast.error("Informe a URL do post.");
      return;
    }
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...form });
    } else {
      createMutation.mutate({ ...form });
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">
            <Instagram className="h-6 w-6 text-primary" /> Instagram
          </h1>
          <p className="text-sm text-muted-foreground">
            Cadastre os links dos posts que aparecerão no carrossel da home.
          </p>
        </div>
        <button
          onClick={() => {
            setIsCreating(true);
            setEditingId(null);
            resetForm();
          }}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Novo post
        </button>
      </div>

      {(isCreating || editingId) && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-xl border border-border bg-card p-4 shadow-sm"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">URL do post no Instagram</label>
              <input
                type="url"
                required
                value={form.post_url}
                onChange={(e) => setForm({ ...form, post_url: e.target.value })}
                placeholder="https://www.instagram.com/p/ABC123/"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">Legenda (opcional)</label>
              <textarea
                value={form.caption}
                onChange={(e) => setForm({ ...form, caption: e.target.value })}
                placeholder="Breve descrição do post"
                rows={2}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Ordem</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="h-4 w-4 accent-primary"
              />
              <label htmlFor="is_active" className="text-sm font-medium">
                Ativo
              </label>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingId(null);
                resetForm();
              }}
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm hover:bg-muted"
            >
              <X className="h-4 w-4" /> Cancelar
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              {editingId ? "Salvar" : "Adicionar"}
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="py-12 text-center text-muted-foreground">Carregando...</div>
      ) : posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
          Nenhum post cadastrado. Clique em "Novo post" para começar.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">URL</th>
                <th className="px-4 py-3 font-medium">Legenda</th>
                <th className="px-4 py-3 font-medium">Ordem</th>
                <th className="px-4 py-3 font-medium">Ativo</th>
                <th className="px-4 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 max-w-xs truncate">
                    <a
                      href={post.post_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {post.post_url}
                    </a>
                  </td>
                  <td className="px-4 py-3 max-w-xs truncate text-muted-foreground">
                    {post.caption || "—"}
                  </td>
                  <td className="px-4 py-3">{post.sort_order}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        post.is_active
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {post.is_active ? "Sim" : "Não"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => startEdit(post)}
                        className="rounded-md border border-border p-2 hover:bg-muted"
                        title="Editar"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate({ id: post.id })}
                        disabled={deleteMutation.isPending}
                        className="rounded-md border border-destructive/30 p-2 text-destructive hover:bg-destructive/10 disabled:opacity-60"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
