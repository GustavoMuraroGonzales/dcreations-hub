import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

// The base Google tag is injected directly in the document head (src/routes/__root.tsx).
export function GoogleTag() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (typeof window === "undefined" || !window.gtag) return;
    window.gtag("event", "page_view", {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname]);

  return null;
}
