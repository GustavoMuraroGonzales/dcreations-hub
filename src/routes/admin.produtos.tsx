import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fetchProducts } from "@/lib/products";
import { Plus, Edit, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/produtos")({
  component: AdminProducts,
});

function AdminProducts() {
  const qc = useQueryClient();
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => fetchProducts({ activeOnly: false }),
  });

  const toggle = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("products").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro"),
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Produtos</h1>
        <Link
          to="/admin/produtos/novo"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> Novo produto
        </Link>
      </div>

      {isLoading ? (
        <p className="mt-8 text-muted-foreground">Carregando...</p>
      ) : products.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">Nenhum produto cadastrado ainda.</p>
          <Link
            to="/admin/produtos/novo"
            className="mt-4 inline-block rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground"
          >
            Criar primeiro produto
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-3">
          {products.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-4 rounded-lg border border-border bg-background p-3"
            >
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                {p.cover_image_url ? (
                  <img src={p.cover_image_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center text-xs text-muted-foreground">sem foto</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{p.name}</div>
                <div className="text-xs text-muted-foreground">
                  {p.category?.name ?? "Sem categoria"} · {p.price ? `R$ ${p.price}` : "Sob consulta"}
                </div>
              </div>
              <button
                onClick={() => toggle.mutate({ id: p.id, is_active: !p.is_active })}
                title={p.is_active ? "Desativar" : "Ativar"}
                className={`rounded-md p-2 ${p.is_active ? "text-primary" : "text-muted-foreground"}`}
              >
                {p.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
              <Link
                to="/admin/produtos/$id"
                params={{ id: p.id }}
                className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm hover:border-primary/50"
              >
                <Edit className="h-3 w-3" /> Editar
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
