import { useEffect } from "react";

export function useJsonLd(schema: object) {
  useEffect(() => {
    const id = "jsonld-schema";
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement("script");
      el.id = id;
      el.type = "application/ld+json";
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(schema);

    return () => {
      const existing = document.getElementById(id);
      if (existing) existing.remove();
    };
  }, [JSON.stringify(schema)]);
}
