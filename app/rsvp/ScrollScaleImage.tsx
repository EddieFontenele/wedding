"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

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
  lockMobileViewport?: boolean;
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
  innerMoveY = 80,
  className = "",
  mobileTall = false,
  lockMobileViewport = false,
}: ScrollScaleImageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    let currentWidth = window.innerWidth;
    let isMobile = currentWidth < 768;
    let stableMobileHeight = window.innerHeight;

    function update() {
      const root = rootRef.current;
      const scaleElement = scaleRef.current;
      const imageElement = imageRef.current;

      if (!root || !scaleElement || !imageElement) return;

      const rect = root.getBoundingClientRect();

      const viewportHeight =
        lockMobileViewport && isMobile
          ? stableMobileHeight
          : window.innerHeight;

      const raw =
        (viewportHeight - rect.top) / (viewportHeight + rect.height);

      const progress = Math.min(Math.max(raw * 1.8, 0), 1);

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

      const innerY = (easedProgress - 0.5) * innerMoveY;

      scaleElement.style.transform = `scale(${scale})`;
      imageElement.style.transform =
        `translate3d(0, ${innerY}px, 0) scale(1.12)`;
    }

    function requestUpdate() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    }

    function onResize() {
      const nextWidth = window.innerWidth;
      const widthChanged = Math.abs(nextWidth - currentWidth) > 1;

      currentWidth = nextWidth;
      isMobile = nextWidth < 768;

      if (!lockMobileViewport || !isMobile || widthChanged) {
        stableMobileHeight = window.innerHeight;
      }

      requestUpdate();
    }

    update();

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", onResize);
    };
  }, [
    startScale,
    endScale,
    mobileStartScale,
    mobileEndScale,
    innerMoveY,
    lockMobileViewport,
  ]);

  return (
    <div ref={rootRef} className={className}>
      <div
        ref={scaleRef}
        className={`relative origin-center overflow-hidden will-change-transform ${
          mobileTall ? "aspect-[10/11] md:aspect-auto" : ""
        }`}
      >
        <div
  ref={imageRef}
  className={
    mobileTall
      ? "absolute inset-0 will-change-transform md:relative"
      : "will-change-transform"
  }
>
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={
              mobileTall
                ? "h-full w-full object-cover md:h-auto"
                : "h-auto w-full object-cover"
            }
          />
        </div>
      </div>
    </div>
  );
}