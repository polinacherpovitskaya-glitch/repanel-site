"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

/* Переход между страницами в духе Symbol Audio:
   при уходе экран снизу→вверх закрашивается ярким цветом,
   на новой странице цвет так же снизу→вверх исчезает.
   Цвет каждый раз случайный. */
const COLORS = [
  "#C72A00", // Grenadier
  "#990000", // Red Berry
  "#EFA807", // Buttercup
  "#447CF0", // Cornflower Blue
  "#24A3E3", // Curious Blue
  "#004A86", // Congress Blue
  "#414C2A", // Woodland
  "#001E41", // Midnight
  "#6E4E3F", // Tobacco Brown
];

const DUR = 540;
const EASE = "cubic-bezier(0.76, 0, 0.24, 1)";

export function PageTransition() {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const covering = useRef(false);
  const mounted = useRef(false);

  const pick = () => COLORS[Math.floor(Math.random() * COLORS.length)];
  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Цвет уходит снизу→вверх (origin top, scaleY 1→0)
  const reveal = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "none";
    el.style.transformOrigin = "top";
    el.style.transform = "scaleY(1)";
    void el.offsetHeight;
    el.style.transition = `transform ${DUR}ms ${EASE}`;
    el.style.transform = "scaleY(0)";
  };

  // Интро на первой загрузке + раскрытие после каждой «закрашенной» навигации
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      const el = ref.current;
      if (!el) return;
      if (reduce()) {
        el.style.transition = "none";
        el.style.transform = "scaleY(0)";
        return;
      }
      // интро использует SSR-цвет (COLORS[0]) — без перекраски, чтобы не мигало
      reveal();
      return;
    }
    if (covering.current) {
      covering.current = false;
      reveal();
    }
  }, [pathname]);

  // Перехват кликов по внутренним ссылкам → закрашивание, затем переход
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (reduce()) return;
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || a.getAttribute("target") === "_blank" || !href.startsWith("/") || href.startsWith("//")) return;
      let dest: URL;
      try { dest = new URL(href, location.origin); } catch { return; }
      if (dest.pathname === pathname) return;

      e.preventDefault();
      const el = ref.current;
      if (!el) { router.push(href); return; }

      covering.current = true;
      el.style.background = pick();
      el.style.transition = "none";
      el.style.transformOrigin = "bottom";
      el.style.transform = "scaleY(0)";
      void el.offsetHeight;
      el.style.transition = `transform ${DUR}ms ${EASE}`;
      el.style.transform = "scaleY(1)";
      window.setTimeout(() => router.push(href), DUR);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname, router]);

  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
        transform: "scaleY(1)",
        transformOrigin: "top",
        willChange: "transform",
        background: COLORS[0],
      }}
    />
  );
}
