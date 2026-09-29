// Domínio oficial usado em canonical, og:url e sitemap.
export const SITE_URL = "https://gonza3dlab.com.br";

export function canonical(path = "/"): string {
  return path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}
