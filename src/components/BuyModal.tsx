import { useEffect } from "react";
import { X, MessageCircle, ExternalLink } from "lucide-react";
import { whatsappLink } from "@/lib/contact";
import type { ProductWithCategory } from "@/lib/products";

type BuyableProduct = Pick<
  ProductWithCategory,
  "name" | "mercado_livre_url" | "shopee_url" | "elo7_url" | "amazon_url" | "other_store_url" | "other_store_label"
>;

type Store = {
  key: string;
  label: string;
  url: string;
  color: string; // tailwind bg class
};

function buildStores(product: ProductDetail): Store[] {
  const list: Store[] = [];
  if (product.mercado_livre_url)
    list.push({ key: "ml", label: "Mercado Livre", url: product.mercado_livre_url, color: "bg-[#FFE600] text-black hover:brightness-95" });
  if (product.shopee_url)
    list.push({ key: "shopee", label: "Shopee", url: product.shopee_url, color: "bg-[#EE4D2D] text-white hover:brightness-110" });
  if (product.elo7_url)
    list.push({ key: "elo7", label: "Elo7", url: product.elo7_url, color: "bg-[#3EA5DC] text-white hover:brightness-110" });
  if (product.amazon_url)
    list.push({ key: "amazon", label: "Amazon", url: product.amazon_url, color: "bg-[#232F3E] text-white hover:brightness-125" });
  if (product.other_store_url)
    list.push({
      key: "other",
      label: product.other_store_label || "Outra loja",
      url: product.other_store_url,
      color: "bg-secondary text-secondary-foreground hover:brightness-110",
    });
  return list;
}

export function BuyModal({ product, open, onClose }: { product: ProductDetail; open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const stores = buildStores(product);
  const msg = `Olá! Tenho interesse no produto "${product.name}" do site.`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="buy-modal-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6">
          <h2 id="buy-modal-title" className="font-display text-2xl font-bold">
            Onde comprar
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Escolha o marketplace de sua preferência para adquirir <span className="font-medium text-foreground">{product.name}</span>.
          </p>

          {stores.length > 0 ? (
            <div className="mt-6 space-y-2">
              {stores.map((s) => (
                <a
                  key={s.key}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={`flex items-center justify-between rounded-lg px-4 py-3 font-semibold transition ${s.color}`}
                >
                  <span>Comprar no {s.label}</span>
                  <ExternalLink className="h-4 w-4 opacity-80" />
                </a>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
              Ainda não há lojas online cadastradas para este produto. Fale conosco pelo WhatsApp para receber orientação de compra.
            </div>
          )}

          <div className="mt-4 border-t border-border pt-4">
            <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
              Prefere falar direto conosco?
            </p>
            <a
              href={whatsappLink(msg)}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-4 py-3 font-semibold text-primary transition hover:bg-primary/20"
            >
              <MessageCircle className="h-5 w-5" />
              Orçamento pelo WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
