import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductForm } from "@/components/ProductForm";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/admin/produtos/novo")({
  component: NewProduct,
});

function NewProduct() {
  return (
    <div>
      <Link to="/admin/produtos" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>
      <h1 className="mt-2 font-display text-3xl font-bold">Novo produto</h1>
      <div className="mt-6">
        <ProductForm />
      </div>
    </div>
  );
}
