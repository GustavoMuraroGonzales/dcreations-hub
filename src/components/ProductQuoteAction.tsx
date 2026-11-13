import { useId, useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { productQuoteLink } from "@/lib/contact";

export function ProductQuoteAction({ product }: { product: { name: string } }) {
  const inputId = useId();
  const [quantity, setQuantity] = useState("1");
  const amount = Number(quantity);
  const valid = Number.isSafeInteger(amount) && amount >= 1;

  return (
    <form
      className="flex w-full flex-wrap items-end gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        if (!valid) return;
        window.open(productQuoteLink(product, amount), "_blank", "noopener,noreferrer");
      }}
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-xs font-medium text-muted-foreground">
          Quantidade
        </label>
        <Input
          id={inputId}
          aria-label={`Quantidade para ${product.name}`}
          className="w-24"
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          required
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
        />
      </div>
      <Button type="submit" disabled={!valid} className="flex-1 sm:flex-none">
        <MessageCircle className="h-4 w-4" />
        Fazer Orçamento
      </Button>
    </form>
  );
}