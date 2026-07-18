"use client";

import { useEffect, useState } from "react";

const TRACK_HEIGHT = 220;
const INITIAL_FILL_HEIGHT = 24;

export function ScrollIndicator() {
  const [progress, setProgress] = useState(0);
  const [isTimelineSection, setIsTimelineSection] = useState(false);

  useEffect(() => {
    let animationFrame: number | null = null;

    function updateScrollIndicator() {
      const scrollTop = window.scrollY;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const nextProgress =
        scrollHeight > 0
          ? Math.min(Math.max(scrollTop / scrollHeight, 0), 1)
          : 0;

      setProgress(nextProgress);

      const timeline = document.querySelector("[data-scroll-section='timeline']");

      if (timeline) {
        const rect = timeline.getBoundingClientRect();

        const timelineIsVisible =
          rect.top <= window.innerHeight * 0.5 &&
          rect.bottom >= window.innerHeight * 0.5;

        setIsTimelineSection(timelineIsVisible);
      }
    }

    function onScroll() {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(updateScrollIndicator);
    }

    updateScrollIndicator();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateScrollIndicator);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateScrollIndicator);

      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, []);

  const fillHeight =
    INITIAL_FILL_HEIGHT + progress * (TRACK_HEIGHT - INITIAL_FILL_HEIGHT);

return (
  <div className="fixed left-0 top-1/2 z-50 flex h-[220px] w-[calc(((100vw-88px)/12)*2+8px)] -translate-y-1/2 items-center justify-center md:w-[99px]">
    <div className="flex h-[220px] w-[48px] items-center justify-center">
      <div
        className={`relative h-full w-px transition-colors duration-500 ${
          isTimelineSection ? "bg-[#EFEFEF]" : "bg-[#DEC76B]/50"
        }`}
      >
        <div
          className="absolute left-0 top-0 w-px bg-black/60"
          style={{
            height: `${fillHeight}px`,
          }}
        />
      </div>
    </div>
  </div>
);
}