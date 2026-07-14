import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { fetchCategories, fetchProductById, slugify, type ProductDetail } from "@/lib/products";
import { uploadProductImage, removeProductImage } from "@/lib/storage";
import { toast } from "sonner";
import { Upload, Trash2, Star, StarOff } from "lucide-react";

interface Props {
  productId?: string; // undefined = create
}

export function ProductForm({ productId }: Props) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isEdit = !!productId;

  const { data: categories = [] } = useQuery({ queryKey: ["admin-categories"], queryFn: fetchCategories });
  const { data: existing, isLoading } = useQuery({
    queryKey: ["admin-product", productId],
    queryFn: () => (productId ? fetchProductById(productId) : Promise.resolve(null)),
    enabled: !!productId,
  });

  const [form, setForm] = useState({
    name: "",
    slug: "",
    short_description: "",
    description: "",
    price: "" as string,
    material: "",
    category_id: "" as string,
    cover_image_url: "" as string,
    is_active: true,
    sort_order: 0,
  });
  const [images, setImages] = useState<ProductDetail["images"]>([]);
  const [uploading, setUploading] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.name,
        slug: existing.slug,
        short_description: existing.short_description,
        description: existing.description,
        price: existing.price != null ? String(existing.price) : "",
        material: existing.material,
        category_id: existing.category_id ?? "",
        cover_image_url: existing.cover_image_url ?? "",
        is_active: existing.is_active,
        sort_order: existing.sort_order,
      });
      setImages(existing.images);
      setSlugTouched(true);
    }
  }, [existing]);

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name.trim(),
        slug: (form.slug || slugify(form.name)).trim(),
        short_description: form.short_description,
        description: form.description,
        price: form.price === "" ? null : Number(form.price),
        material: form.material,
        category_id: form.category_id || null,
        cover_image_url: form.cover_image_url || null,
        is_active: form.is_active,
        sort_order: form.sort_order,
      };
      if (isEdit && productId) {
        const { error } = await supabase.from("products").update(payload).eq("id", productId);
        if (error) throw error;
        return productId;
      } else {
        const { data, error } = await supabase.from("products").insert(payload).select("id").single();
        if (error) throw error;
        return data.id as string;
      }
    },
    onSuccess: (id) => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["admin-product", id] });
      toast.success(isEdit ? "Produto atualizado" : "Produto criado");
      if (!isEdit) navigate({ to: "/admin/produtos/$id", params: { id } });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro ao salvar"),
  });

  const remove = useMutation({
    mutationFn: async () => {
      if (!productId) return;
      // remove storage files
      await Promise.all(images.map((i) => removeProductImage(i.storage_path)));
      const { error } = await supabase.from("products").delete().eq("id", productId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produto excluído");
      navigate({ to: "/admin/produtos" });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro"),
  });

  async function handleFileUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    if (!productId) {
      toast.error("Salve o produto primeiro para adicionar imagens.");
      return;
    }
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const { path, url } = await uploadProductImage(file);
        const { data, error } = await supabase
          .from("product_images")
          .insert({ product_id: productId, image_url: url, storage_path: path, sort_order: images.length })
          .select("*")
          .single();
        if (error) throw error;
        setImages((prev) => [...prev, data]);
        // If no cover yet, use this as cover
        if (!form.cover_image_url) {
          setForm((f) => ({ ...f, cover_image_url: url }));
          await supabase.from("products").update({ cover_image_url: url }).eq("id", productId);
        }
      }
      toast.success("Imagens enviadas");
      qc.invalidateQueries({ queryKey: ["products"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro no upload");
    } finally {
      setUploading(false);
    }
  }

  async function handleRemoveImage(imgId: string, path: string | null) {
    if (!confirm("Remover esta imagem?")) return;
    const img = images.find((i) => i.id === imgId);
    await supabase.from("product_images").delete().eq("id", imgId);
    await removeProductImage(path);
    setImages((prev) => prev.filter((i) => i.id !== imgId));
    // If cover was this image, clear it
    if (img && form.cover_image_url === img.image_url && productId) {
      const next = images.find((i) => i.id !== imgId);
      const url = next?.image_url ?? "";
      setForm((f) => ({ ...f, cover_image_url: url }));
      await supabase.from("products").update({ cover_image_url: url || null }).eq("id", productId);
    }
    qc.invalidateQueries({ queryKey: ["products"] });
  }

  async function handleSetCover(url: string) {
    if (!productId) return;
    setForm((f) => ({ ...f, cover_image_url: url }));
    await supabase.from("products").update({ cover_image_url: url }).eq("id", productId);
    toast.success("Capa atualizada");
    qc.invalidateQueries({ queryKey: ["products"] });
  }

  if (isEdit && isLoading) return <p className="text-muted-foreground">Carregando...</p>;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save.mutate();
      }}
      className="space-y-6"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nome" required>
          <input
            required
            value={form.name}
            onChange={(e) => {
              const v = e.target.value;
              setForm((f) => ({ ...f, name: v, slug: slugTouched ? f.slug : slugify(v) }));
            }}
            className={input}
          />
        </Field>
        <Field label="Slug (URL)">
          <input
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              setForm((f) => ({ ...f, slug: e.target.value }));
            }}
            className={input}
          />
        </Field>
        <Field label="Categoria">
          <select
            value={form.category_id}
            onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
            className={input}
          >
            <option value="">— nenhuma —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Preço (R$) — deixe vazio para 'Sob consulta'">
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            className={input}
          />
        </Field>
        <Field label="Material">
          <input
            value={form.material}
            onChange={(e) => setForm((f) => ({ ...f, material: e.target.value }))}
            className={input}
            placeholder="Ex.: PLA Premium"
          />
        </Field>
        <Field label="Ordem de exibição">
          <input
            type="number"
            value={form.sort_order}
            onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
            className={input}
          />
        </Field>
      </div>

      <Field label="Descrição curta">
        <input
          value={form.short_description}
          onChange={(e) => setForm((f) => ({ ...f, short_description: e.target.value }))}
          className={input}
          placeholder="Aparece nos cards do catálogo"
        />
      </Field>
      <Field label="Descrição completa">
        <textarea
          rows={5}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className={input}
        />
      </Field>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.is_active}
          onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
        />
        <span className="text-sm">Ativo (visível no catálogo)</span>
      </label>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-sm font-medium">Galeria de imagens</label>
          <label
            className={`inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm hover:border-primary/50 ${
              uploading || !isEdit ? "opacity-60" : ""
            }`}
          >
            <Upload className="h-4 w-4" />
            {uploading ? "Enviando..." : "Adicionar imagens"}
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              disabled={uploading || !isEdit}
              onChange={(e) => handleFileUpload(e.target.files)}
            />
          </label>
        </div>
        {!isEdit && (
          <p className="text-xs text-muted-foreground">
            Salve o produto primeiro para adicionar imagens.
          </p>
        )}
        {images.length > 0 && (
          <div className="mt-2 grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-5">
            {images.map((img) => {
              const isCover = img.image_url === form.cover_image_url;
              return (
                <div key={img.id} className="group relative aspect-square overflow-hidden rounded-md border border-border">
                  <img src={img.image_url} alt="" className="h-full w-full object-cover" />
                  {isCover && (
                    <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                      capa
                    </span>
                  )}
                  <div className="absolute inset-0 flex items-end justify-between gap-1 bg-gradient-to-t from-black/70 to-transparent p-1 opacity-0 transition group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => handleSetCover(img.image_url)}
                      className="rounded bg-white/90 p-1 text-black"
                      title={isCover ? "Já é a capa" : "Definir como capa"}
                    >
                      {isCover ? <Star className="h-3 w-3" /> : <StarOff className="h-3 w-3" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img.id, img.storage_path)}
                      className="rounded bg-destructive/90 p-1 text-white"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border pt-6">
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={save.isPending}
            className="rounded-md bg-primary px-6 py-2 font-semibold text-primary-foreground disabled:opacity-60"
          >
            {save.isPending ? "Salvando..." : "Salvar"}
          </button>
          <button
            type="button"
            onClick={() => navigate({ to: "/admin/produtos" })}
            className="rounded-md border border-border px-4 py-2"
          >
            Cancelar
          </button>
        </div>
        {isEdit && (
          <button
            type="button"
            onClick={() => {
              if (confirm("Excluir este produto e suas imagens?")) remove.mutate();
            }}
            className="rounded-md border border-destructive/50 px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
          >
            Excluir produto
          </button>
        )}
      </div>
    </form>
  );
}

const input =
  "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 focus:border-primary focus:outline-none";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      {children}
    </div>
  );
}
