// Central place to update contact info.
export const WHATSAPP_NUMBER = "5515996833192";
export const EMAIL = "gonza3dlab@gmail.com";
export const INSTAGRAM = "https://www.instagram.com/gonza3dlab/";

export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
