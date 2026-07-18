"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function SmoothScroll() {
  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;

    window.history.scrollRestoration = "manual";

    const lenis = new Lenis({
      autoRaf: true,
      anchors: false,
      lerp: 0.12,
      wheelMultiplier: 0.4,
    });

    window.__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
}
