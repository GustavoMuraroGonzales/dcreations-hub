import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, fetchCategories } from "@/lib/products";
import { Package, Tag, Plus } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminHome,
});

function AdminHome() {
  const products = useQuery({ queryKey: ["admin-products"], queryFn: () => fetchProducts({ activeOnly: false }) });
  const categories = useQuery({ queryKey: ["admin-categories"], queryFn: fetchCategories });

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Bem-vindo</h1>
      <p className="mt-1 text-muted-foreground">Gerencie o catálogo do marketplace.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card
          to="/admin/produtos"
          icon={Package}
          title="Produtos"
          value={products.data?.length ?? "…"}
          hint="Cadastrar, editar, ativar/desativar"
        />
        <Card
          to="/admin/categorias"
          icon={Tag}
          title="Categorias"
          value={categories.data?.length ?? "…"}
          hint="Organizar o catálogo"
        />
      </div>

      <div className="mt-8">
        <Link
          to="/admin/produtos/novo"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> Novo produto
        </Link>
      </div>
    </div>
  );
}

function Card({
  to, icon: Icon, title, value, hint,
}: { to: string; icon: React.ComponentType<{ className?: string }>; title: string; value: string | number; hint: string }) {
  return (
    <Link to={to} className="rounded-xl border border-border bg-background p-6 transition hover:border-primary/50">
      <Icon className="h-6 w-6 text-primary" />
      <div className="mt-4 text-3xl font-bold">{value}</div>
      <div className="text-sm font-medium">{title}</div>
      <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
    </Link>
  );
}
