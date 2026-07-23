import { useEffect, useRef } from "react";
import { Instagram } from "lucide-react";

export function InstagramFeed() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const existing = document.querySelector(
      'script[src="https://cdn.lightwidget.com/widgets/lightwidget.js"]'
    );
    if (existing) return;
    const script = document.createElement("script");
    script.src = "https://cdn.lightwidget.com/widgets/lightwidget.js";
    script.async = true;
    containerRef.current.appendChild(script);
  }, []);

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
      <div
        ref={containerRef}
        className="overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-[var(--shadow-soft)]"
      >
        <iframe
          src="//lightwidget.com/widgets/1aa587ede0bd5ccc88a7ce5e053eeab5.html"
          scrolling="no"
          allowTransparency={true}
          className="lightwidget-widget"
          style={{ width: "100%", border: 0, overflow: "hidden" }}
        />
      </div>
    </section>
  );
}
