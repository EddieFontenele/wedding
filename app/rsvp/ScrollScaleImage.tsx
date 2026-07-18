"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type ScrollScaleImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  startScale?: number;
  endScale?: number;
  mobileStartScale?: number;
  mobileEndScale?: number;
  moveY?: number;
  innerMoveY?: number;
  className?: string;
  mobileTall?: boolean;
};

export function ScrollScaleImage({
  src,
  alt,
  width,
  height,
  startScale = 1,
  endScale = 0.6,
  mobileStartScale,
  mobileEndScale,
  moveY = 80,
  innerMoveY = 80,
  className = "",
  mobileTall = false,
}: ScrollScaleImageProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    let frame = 0;

    function update() {
      if (!ref.current) return;

      setIsMobile(window.innerWidth < 768);

      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const raw = (windowHeight - rect.top) / (windowHeight + rect.height);
      const next = Math.min(Math.max(raw * 1.8, 0), 1);

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

  const easedProgress =
    progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

  const activeStartScale =
    isMobile && mobileStartScale !== undefined
      ? mobileStartScale
      : startScale;

  const activeEndScale =
    isMobile && mobileEndScale !== undefined
      ? mobileEndScale
      : endScale;

  const scale =
    activeStartScale +
    (activeEndScale - activeStartScale) * easedProgress;

  const outerY = (0.5 - progress) * moveY;
  const innerY = (easedProgress - 0.5) * innerMoveY;

  return (
    <div ref={ref} className={className}>
      <div
        className={`relative origin-center overflow-hidden will-change-transform ${
          mobileTall ? "aspect-[10/11] md:aspect-auto" : ""
        }`}
        style={{
          transform: `translateY(${outerY}px) scale(${scale})`,
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={
            mobileTall
              ? "absolute inset-0 h-full w-full object-cover will-change-transform md:relative md:h-auto"
              : "h-auto w-full object-cover will-change-transform"
          }
          style={{
            transform: `translateY(${innerY}px) scale(1.12)`,
          }}
        />
      </div>
    </div>
  );
}