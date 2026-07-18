"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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
  const ref = useRef<HTMLDivElement>(null);
  const [y, setY] = useState(0);

  useEffect(() => {
    let frame = 0;

    function update() {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const progress =
        (rect.top + rect.height / 2 - windowHeight / 2) / windowHeight;

      setY(progress);
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

  return (
    <div
      ref={ref}
      style={{ transform: `translateY(${y * speed}px)` }}
      className={className}
    >
      <div className="overflow-hidden">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          style={{
            transform: `translateY(${y * innerSpeed}px) scale(1.14)`,
          }}
          className="h-auto w-full object-cover will-change-transform"
        />
      </div>

      {caption ? (
        <p className="mt-2 type-body-2 text-black/50">{caption}</p>
      ) : null}
    </div>
  );
}