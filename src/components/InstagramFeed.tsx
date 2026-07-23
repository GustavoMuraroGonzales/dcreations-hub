import { useEffect, useRef } from "react";
import { Instagram } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchInstagramPosts, extractInstagramPostId } from "@/lib/instagram-posts";

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

export function InstagramFeed() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["instagram-posts"],
    queryFn: fetchInstagramPosts,
  });

  useEffect(() => {
    if (!containerRef.current) return;
    const existing = document.querySelector(
      'script[src="https://www.instagram.com/embed.js"]',
    );
    if (existing) {
      window.instgrm?.Embeds?.process();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.instgrm?.Embeds?.process();
    };
    containerRef.current.appendChild(script);
  }, [posts]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
      <div className="mb-10 text-center">
        <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Instagram className="h-3 w-3" /> Instagram
        </span>
        <h2 className="font-display text-3xl font-bold md:text-4xl">Siga a Gonza3DLab</h2>
        <p className="mt-2 text-muted-foreground">
          Acompanhe nossas últimas peças e bastidores da impressão 3D.
        </p>
      </div>

      {isLoading ? (
        <div className="grid place-items-center py-12 text-muted-foreground">Carregando posts...</div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-[var(--shadow-soft)]">
          <p className="text-muted-foreground">Nenhum post do Instagram cadastrado ainda.</p>
          <a
            href="https://www.instagram.com/gonza3dlab"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Instagram className="h-4 w-4" /> Ver perfil no Instagram
          </a>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const postId = extractInstagramPostId(post.post_url);
              if (!postId) return null;
              return (
                <blockquote
                  key={post.id}
                  className="instagram-media"
                  data-instgrm-permalink={post.post_url}
                  data-instgrm-version="14"
                  style={{
                    background: "#FFF",
                    border: 0,
                    borderRadius: 12,
                    boxShadow: "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
                    margin: 0,
                    minWidth: 280,
                    width: "100%",
                  }}
                >
                  <div style={{ padding: 16 }}>
                    <a
                      href={post.post_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-primary hover:underline"
                    >
                      Ver no Instagram
                    </a>
                    {post.caption && (
                      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                        {post.caption}
                      </p>
                    )}
                  </div>
                </blockquote>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
