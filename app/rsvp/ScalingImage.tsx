"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type ScalingImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  startScale?: number;
  endScale?: number;
  innerMove?: number;
  className?: string;
};

export function ScalingImage({
  src,
  alt,
  width,
  height,
  startScale = 1,
  endScale = 0.6,
  innerMove = 80,
  className = "",
}: ScalingImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    function update() {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const raw = -rect.top / total;
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

  const currentScale = startScale + (endScale - startScale) * progress;
  const innerY = progress * -innerMove;

  return (
    <div ref={ref} className={`h-[150vh] ${className}`}>
      <div className="sticky top-0 flex h-screen items-center justify-center">
        <div
          className="w-full overflow-hidden will-change-transform"
          style={{
            transform: `scale(${currentScale})`,
          }}
        >
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="h-auto w-full object-cover will-change-transform"
            style={{
              transform: `translateY(${innerY}px) scale(1.12)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}