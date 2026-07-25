"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type MotionSectionIntroProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  className?: string;
  children?: ReactNode;
  fitMobileViewport?: boolean;
};

gsap.registerPlugin(ScrollTrigger);

const INTRO_PARALLAX_Y = 120;

const PARALLAX_START_PROGRESS = 0.15;
const PARALLAX_END_PROGRESS = 0.95;

const ENTRY_EYEBROW_START = 0.2;
const ENTRY_EYEBROW_END = 0.4;

const ENTRY_TITLE_START = 0.3;
const ENTRY_TITLE_END = 0.4;

const ENTRY_SUBTITLE_START = 0.4;
const ENTRY_SUBTITLE_END = 0.45;

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
  children,
    fitMobileViewport = false,
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

    const childrenElement = root.querySelector<HTMLElement>(
      "[data-intro-children]"
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

      if (childrenElement) {
        gsap.set(childrenElement, {
          y: SUBTITLE_Y,
          opacity: 0,
          visibility: "visible",
        });
      }

      ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: fitMobileViewport ? "bottom bottom" : "bottom top",
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

          const childrenEntryProgress = subtitleEntryProgress;

          const parallaxProgress = getProgress(
            PARALLAX_START_PROGRESS,
            PARALLAX_END_PROGRESS
          );

          const parallaxY = gsap.utils.interpolate(
            -INTRO_PARALLAX_Y,
            0,
            parallaxProgress
          );

          gsap.set(parallaxElement, {
            y: parallaxY,
            opacity: 1,
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

          if (childrenElement) {
            gsap.set(childrenElement, {
              y: gsap.utils.interpolate(SUBTITLE_Y, 0, childrenEntryProgress),
              opacity: childrenEntryProgress,
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
  }, [fitMobileViewport]);

  return (
    <div
      ref={rootRef}
      className={`relative grid grid-cols-12 gap-2 ${
        className ||
        fitMobileViewport
          ? "min-h-[100svh] md:min-h-screen"
          : "min-h-[140vh]"
      }`}
    >
      <span
        data-page-anchor
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-1/2 h-px w-px"
      />

      <div
        data-intro-parallax
        className={`col-start-3 col-span-8 mx-auto flex w-full max-w-[640px] flex-col items-center justify-center text-center will-change-transform ${
          fitMobileViewport ? "min-h-[100svh] md:min-h-screen" : "min-h-screen"
        }`}
      >
        <div data-intro-content>
          <h4
            data-intro-eyebrow
            className="text-[1.25rem] leading-none text-black md:text-[clamp(1.25rem,1.6vw,2rem)]"
          >
            {eyebrow}
          </h4>

          <h2
            data-intro-title
            className="mt-8 font-cheyra text-[3.75rem] leading-[0.88] text-black md:mt-10 md:text-[clamp(8rem,12vw,14rem)]"
          >
            {title}
          </h2>

          {subtitle ? (
            <div className="mx-auto mt-8 w-full md:w-2/3">
              <h3
                data-intro-subtitle
                className="text-[1.25rem] leading-[1.35] text-black md:text-[1.8rem]"
              >
                {subtitle}
              </h3>
            </div>
          ) : null}

              {children ? (
                <div
                  data-intro-children
                  className="mt-[40px] flex justify-center"
                >
              {children}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
