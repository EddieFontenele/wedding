"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type ParallaxImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  caption?: string;
  speed?: number;
  innerSpeed?: number;
};

export function ParallaxImage({
  src,
  alt,
  width,
  height,
  className = "",
  caption,
  speed = 28,
  innerSpeed = 44,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrame = 0;
    let targetProgress = 0;
    let currentProgress = 0;

    function calculateTarget() {
      const container = containerRef.current;

      if (!container) return;

      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      targetProgress =
        (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight;
    }

    function animate() {
      const outer = outerRef.current;
      const inner = innerRef.current;

      if (!outer || !inner) return;

      currentProgress += (targetProgress - currentProgress) * 0.1;

      outer.style.transform = "translate3d(0, 0, 0)";

      inner.style.transform = `translate3d(0, ${
        currentProgress * innerSpeed
      }px, 0) scale(1.14)`;

      animationFrame = requestAnimationFrame(animate);
    }

    calculateTarget();
    currentProgress = targetProgress;
    animate();

    window.addEventListener("scroll", calculateTarget, { passive: true });
    window.addEventListener("resize", calculateTarget);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", calculateTarget);
      window.removeEventListener("resize", calculateTarget);
    };
  }, [speed, innerSpeed]);

  return (
    <div ref={containerRef} className={className}>
      <div ref={outerRef} className="will-change-transform">
        <div className="overflow-hidden">
          <div ref={innerRef} className="will-change-transform">
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              className="h-auto w-full object-cover"
            />
          </div>
        </div>

        {caption ? (
          <p className="mt-2 type-body-2 text-black/50">{caption}</p>
        ) : null}
      </div>
    </div>
  );
}