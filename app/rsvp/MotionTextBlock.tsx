"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollScrubWords } from "./ScrollScrubWords";

type MotionTextBlockProps = {
  text: string;
};

export function MotionTextBlock({ text }: MotionTextBlockProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [shouldMountMotion, setShouldMountMotion] = useState(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;

    if (!wrapper) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        setShouldMountMotion(true);
        observer.disconnect();
      },
      {
        root: null,
        rootMargin: "120% 0px 120% 0px",
        threshold: 0,
      }
    );

    observer.observe(wrapper);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!shouldMountMotion) return;

    const firstFrame = requestAnimationFrame(() => {
      ScrollTrigger.refresh();

      const timeout = window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);

      return () => {
        window.clearTimeout(timeout);
      };
    });

    return () => {
      cancelAnimationFrame(firstFrame);
    };
  }, [shouldMountMotion]);

  return (
    <div
      ref={wrapperRef}
      className="grid min-h-[120vh] grid-cols-12 gap-2 px-0 py-40 md:px-6"
    >
      <div className="col-start-3 col-span-8 flex items-start pt-[8vh] md:col-start-5 md:col-span-3">
        {shouldMountMotion ? (
          <ScrollScrubWords
            as="p"
            className="type-h5 text-black"
            text={text}
          />
        ) : (
          <p className="type-h5 text-black opacity-0">{text}</p>
        )}
      </div>
    </div>
  );
}