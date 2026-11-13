// Central place to update contact info.
export const WHATSAPP_NUMBER = "5515996833192";
export const EMAIL = "gonza3dlab@gmail.com";
export const INSTAGRAM = "https://www.instagram.com/gonza3dlab/";

export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function productQuoteLink(product: { name: string }, quantity = 1): string {
  if (!Number.isSafeInteger(quantity) || quantity < 1) {
    throw new RangeError("Informe uma quantidade inteira maior que zero.");
  }
  return whatsappLink(`Olá! Vim pelo site da Gonza3DLab e gostaria de fazer um orçamento para o produto "${product.name}". Quantidade desejada: ${quantity} ${quantity === 1 ? "unidade" : "unidades"}.`);
}
