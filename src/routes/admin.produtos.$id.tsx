import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductForm } from "@/components/ProductForm";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/admin/produtos/$id")({
  component: EditProduct,
});

function EditProduct() {
  const { id } = Route.useParams();
  return (
    <div>
      <Link to="/admin/produtos" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>
      <h1 className="mt-2 font-display text-3xl font-bold">Editar produto</h1>
      <div className="mt-6">
        <ProductForm productId={id} />
      </div>
    </div>
  );
}
