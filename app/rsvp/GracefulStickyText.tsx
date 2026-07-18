"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

type GracefulStickyTextProps = {
  children: ReactNode;
  className?: string;
};

export function GracefulStickyText({
  children,
  className = "",
}: GracefulStickyTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    function update() {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;

      // começa quando o bloco entra na tela
      // termina só quando ele chega mais perto do centro
      const raw = (vh - rect.top) / (vh * 2.4);
      const next = Math.min(Math.max(raw, 0), 1);

      setProgress(next);
    }

    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);

  const eased =
    progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

  const y = (1 - eased) * 320;
  const opacity = 0.25 + eased * 0.75;

  return (
    <div ref={ref} className={className}>
      <div className="sticky top-0 flex h-screen items-center">
        <div
          className="will-change-transform"
          style={{
            transform: `translateY(${y}px)`,
            opacity,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}