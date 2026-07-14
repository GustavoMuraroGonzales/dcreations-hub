// Central place to update contact info.
export const WHATSAPP_NUMBER = "5515996833192";
export const EMAIL = "contato@gonza3dlab.com";
export const INSTAGRAM = "https://instagram.com/gonza3dlab";

export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
