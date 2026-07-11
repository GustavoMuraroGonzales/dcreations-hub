// Central place to update contact info. Number is a placeholder — replace with real WhatsApp.
export const WHATSAPP_NUMBER = "5511999999999";
export const EMAIL = "contato@gonza3dlab.com";
export const INSTAGRAM = "https://instagram.com/gonza3dlab";

export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
