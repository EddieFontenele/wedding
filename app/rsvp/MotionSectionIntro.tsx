"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type MotionSectionIntroProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  className?: string;
};

gsap.registerPlugin(ScrollTrigger);

const INTRO_PARALLAX_Y = 220;

const PARALLAX_START_PROGRESS = 0.15;
const PARALLAX_END_PROGRESS = 0.95;

const ENTRY_EYEBROW_START = 0.1;
const ENTRY_EYEBROW_END = 0.28;

const ENTRY_TITLE_START = 0.18;
const ENTRY_TITLE_END = 0.42;

const ENTRY_SUBTITLE_START = 0.34;
const ENTRY_SUBTITLE_END = 0.58;

const EXIT_START_PROGRESS = 0.82;
const EXIT_END_PROGRESS = 1;

const EYEBROW_Y = 8;
const TITLE_Y = 8;
const SUBTITLE_Y = 8;

export function MotionSectionIntro({
  eyebrow,
  title,
  subtitle,
  className = "",
}: MotionSectionIntroProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) return;

    const parallaxElement = root.querySelector<HTMLElement>(
      "[data-intro-parallax]"
    );

    const eyebrowElement = root.querySelector<HTMLElement>(
      "[data-intro-eyebrow]"
    );

    const titleElement = root.querySelector<HTMLElement>("[data-intro-title]");

    const subtitleElement = root.querySelector<HTMLElement>(
      "[data-intro-subtitle]"
    );

    if (!parallaxElement || !eyebrowElement || !titleElement) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      gsap.set([parallaxElement, eyebrowElement, titleElement, subtitleElement], {
        y: 0,
        opacity: 1,
        visibility: "visible",
      });

      return;
    }

    const context = gsap.context(() => {
      gsap.set(parallaxElement, {
        y: 0,
        opacity: 1,
        visibility: "visible",
      });

      gsap.set(eyebrowElement, {
        y: EYEBROW_Y,
        opacity: 0,
        visibility: "visible",
      });

      gsap.set(titleElement, {
        y: TITLE_Y,
        opacity: 0,
        visibility: "visible",
      });

      if (subtitleElement) {
        gsap.set(subtitleElement, {
          y: SUBTITLE_Y,
          opacity: 0,
          visibility: "visible",
        });
      }

      ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;

          const getProgress = (start: number, end: number) => {
            return gsap.utils.clamp(0, 1, (progress - start) / (end - start));
          };

          const eyebrowEntryProgress = getProgress(
            ENTRY_EYEBROW_START,
            ENTRY_EYEBROW_END
          );

          const titleEntryProgress = getProgress(
            ENTRY_TITLE_START,
            ENTRY_TITLE_END
          );

          const subtitleEntryProgress = getProgress(
            ENTRY_SUBTITLE_START,
            ENTRY_SUBTITLE_END
          );

          const exitProgress = getProgress(
            EXIT_START_PROGRESS,
            EXIT_END_PROGRESS
          );

          const parallaxProgress = getProgress(
            PARALLAX_START_PROGRESS,
            PARALLAX_END_PROGRESS
          );

          const parallaxY = gsap.utils.interpolate(
            -INTRO_PARALLAX_Y,
            INTRO_PARALLAX_Y,
            parallaxProgress
          );

          gsap.set(parallaxElement, {
            y: parallaxY,
            opacity: 1 - exitProgress,
          });

          gsap.set(eyebrowElement, {
            y: gsap.utils.interpolate(EYEBROW_Y, 0, eyebrowEntryProgress),
            opacity: eyebrowEntryProgress,
          });

          gsap.set(titleElement, {
            y: gsap.utils.interpolate(TITLE_Y, 0, titleEntryProgress),
            opacity: titleEntryProgress,
          });

          if (subtitleElement) {
            gsap.set(subtitleElement, {
              y: gsap.utils.interpolate(SUBTITLE_Y, 0, subtitleEntryProgress),
              opacity: subtitleEntryProgress,
            });
          }
        },
      });
    }, root);

        const refreshFrame = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    const refreshTimeout = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    function refreshAfterLoad() {
      ScrollTrigger.refresh();
    }

    window.addEventListener("load", refreshAfterLoad);

    return () => {
      cancelAnimationFrame(refreshFrame);
      window.clearTimeout(refreshTimeout);
      window.removeEventListener("load", refreshAfterLoad);
      context.revert();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={`relative grid min-h-[140vh] grid-cols-12 gap-2 ${className}`}
    >
      <span
        data-page-anchor
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-1/2 h-px w-px"
      />

      <div
        data-intro-parallax
        className="col-start-4 col-span-6 flex min-h-screen flex-col items-center justify-center text-center will-change-transform"
      >
        <div data-intro-content>
          <h4 data-intro-eyebrow className="type-h6 text-black">
            {eyebrow}
          </h4>

          <h2
            data-intro-title
            className="mt-8 font-cheyra text-[3.75rem] leading-[0.9] text-black md:mt-12 md:text-[9rem]"
          >
            {title}
          </h2>

          {subtitle ? (
            <div className="mx-auto mt-8 w-full md:w-2/3">
              <h3
                data-intro-subtitle
                className="text-[1.25rem] leading-[1.35] text-black md:type-h3"
              >
                {subtitle}
              </h3>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
