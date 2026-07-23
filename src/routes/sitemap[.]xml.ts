import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { fetchProducts } from "@/lib/products";

const BASE_URL = "https://dcreations-hub.lovable.app";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/catalogo", changefreq: "weekly", priority: "0.9" },
          { path: "/servicos", changefreq: "monthly", priority: "0.8" },
          { path: "/como-funciona", changefreq: "monthly", priority: "0.7" },
          { path: "/sobre", changefreq: "monthly", priority: "0.6" },
          { path: "/contato", changefreq: "monthly", priority: "0.6" },
        ];

        try {
          const products = await fetchProducts({ activeOnly: true });
          for (const p of products) {
            entries.push({
              path: `/produto/${p.slug}`,
              lastmod: p.updated_at ? new Date(p.updated_at).toISOString().slice(0, 10) : undefined,
              changefreq: "weekly",
              priority: "0.8",
            });
          }
        } catch {
          // If product fetch fails, still return static entries.
        }

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
