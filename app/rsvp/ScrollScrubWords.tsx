"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type ScrollScrubWordsProps = {
  text: string;
  className?: string;
  as?: "p" | "div" | "span";
};

type MeasuredWord = {
  word: string;
  index: number;
};

gsap.registerPlugin(ScrollTrigger);

const LINE_DURATION = 0.85;
const LINE_OFFSET = 0.32;
const LINE_ROTATION = 5;

const LETTER_STAGGER = 0.018;
const LETTER_DURATION = 0.42;
const LETTER_ALPHA_DELAY = 0.02;

const MOBILE_TEXT_SCROLL_SPEED = 0.7;
const DESKTOP_TEXT_SCROLL_SPEED = 0.6;


export function ScrollScrubWords({
  text,
  className = "",
  as = "p",
}: ScrollScrubWordsProps) {
  const TagName = as;
  const rootRef = useRef<HTMLElement | null>(null);
  const measureRef = useRef<HTMLSpanElement | null>(null);

  const words = useMemo(() => {
    return text.trim().split(/\s+/);
  }, [text]);

  const [lines, setLines] = useState<MeasuredWord[][]>([]);

  useEffect(() => {
    const measureElement = measureRef.current;

    if (!measureElement) return;

    function measureLines(elementToMeasure: HTMLSpanElement) {
      const wordElements = Array.from(
        elementToMeasure.querySelectorAll("[data-measure-word]")
      ) as HTMLElement[];

      const nextLines = wordElements.reduce<MeasuredWord[][]>(
        (accumulator, wordElement) => {
          const rect = wordElement.getBoundingClientRect();
          const index = Number(wordElement.dataset.wordIndex);
          const word = wordElement.dataset.word ?? "";

          const existingLine = accumulator.find((line) => {
            const firstLineWord = line[0];

            if (!firstLineWord) return false;

            const firstWordElement = wordElements[firstLineWord.index];

            if (!firstWordElement) return false;

            const firstRect = firstWordElement.getBoundingClientRect();

            return Math.abs(firstRect.top - rect.top) < 8;
          });

          if (existingLine) {
            existingLine.push({ word, index });
          } else {
            accumulator.push([{ word, index }]);
          }

          return accumulator;
        },
        []
      );

      setLines((currentLines) => {
  const currentSignature = currentLines
    .map((line) => line.map((item) => item.index).join(","))
    .join("|");

  const nextSignature = nextLines
    .map((line) => line.map((item) => item.index).join(","))
    .join("|");

  return currentSignature === nextSignature
    ? currentLines
    : nextLines;
});
    }

    measureLines(measureElement);

    const resizeObserver = new ResizeObserver(() => {
      measureLines(measureElement);
      ScrollTrigger.refresh();
    });

    resizeObserver.observe(measureElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, [words]);

useEffect(() => {
  const root = rootRef.current;

  if (!root || !lines.length) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const parallaxElement = root.querySelector<HTMLElement>(
    "[data-parallax-text]"
  );

  const lineElements = gsap.utils.toArray<HTMLElement>(
    root.querySelectorAll("[data-scroll-line]")
  );

  const letterElements = gsap.utils.toArray<HTMLElement>(
    root.querySelectorAll("[data-scroll-letter]")
  );

  if (!parallaxElement) return;

  if (prefersReducedMotion) {
    gsap.set(parallaxElement, {
      y: 0,
      opacity: 1,
    });

    gsap.set(lineElements, {
      yPercent: 0,
      rotation: 0,
    });

    gsap.set(letterElements, {
      opacity: 1,
    });

    return;
  }

  let context: gsap.Context | null = null;
  let initialized = false;
  let cancelled = false;

  const initializeAnimations = async () => {
    if (initialized || cancelled) return;

    initialized = true;

    await document.fonts.ready;

    if (cancelled) return;

    context = gsap.context(() => {
      gsap.set(parallaxElement, {
        y: 0,
        opacity: 1,
      });

      gsap.set(lineElements, {
        yPercent: 120,
        rotation: LINE_ROTATION,
        transformOrigin: "left bottom",
      });

      gsap.set(letterElements, {
        opacity: 0,
      });

      const setParallaxY = gsap.quickSetter(
        parallaxElement,
        "y",
        "px"
      );

      const setParallaxOpacity = gsap.quickSetter(
        parallaxElement,
        "opacity"
      );

      const updateParallax = (trigger: ScrollTrigger) => {
      const rootTop =
        root.getBoundingClientRect().top + trigger.scroll();

      const parallaxStart = rootTop - window.innerHeight;

      const distanceAfterStart = Math.max(
        0,
        trigger.scroll() - parallaxStart
      );

      const activeScrollSpeed =
        window.innerWidth < 768
          ? MOBILE_TEXT_SCROLL_SPEED
          : DESKTOP_TEXT_SCROLL_SPEED;

      setParallaxY(
  distanceAfterStart * (1 - activeScrollSpeed)
);

      const currentTop = parallaxElement.getBoundingClientRect().top;

      const fadeStart = window.innerHeight * 0.07;
      const fadeEnd = 0;

      const opacity = gsap.utils.clamp(
        0,
        1,
        (currentTop - fadeEnd) / (fadeStart - fadeEnd)
      );

      setParallaxOpacity(opacity);
    };

      ScrollTrigger.create({
        start: 0,
        end: "max",
        invalidateOnRefresh: true,

        onUpdate: (self) => {
          updateParallax(self);
        },

        onRefresh: (self) => {
          updateParallax(self);
        },
      });

      const revealTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: () =>
            window.innerWidth < 768 ? "top 72%" : "top 85%",
          end: () =>
            window.innerWidth < 768 ? "top 28%" : "top 35%",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      lineElements.forEach((lineElement, lineIndex) => {
        const startTime = lineIndex * LINE_OFFSET;

        const lettersInThisLine = gsap.utils
          .toArray<HTMLElement>(
            lineElement.querySelectorAll("[data-scroll-letter]")
          )
          .sort((letterA, letterB) => {
            return (
              letterA.getBoundingClientRect().left -
              letterB.getBoundingClientRect().left
            );
          });

        revealTimeline.to(
          lineElement,
          {
            yPercent: 0,
            rotation: 0,
            duration: LINE_DURATION,
            ease: "power3.out",
          },
          startTime
        );

        revealTimeline.to(
          lettersInThisLine,
          {
            opacity: 1,
            duration: LETTER_DURATION,
            ease: "power3.out",
            stagger: LETTER_STAGGER,
          },
          startTime + LETTER_ALPHA_DELAY
        );
      });

      ScrollTrigger.refresh();
    }, root);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];

      if (!entry?.isIntersecting) return;

      observer.disconnect();
      initializeAnimations();
    },
    {
      root: null,
      rootMargin: "120% 0px 120% 0px",
      threshold: 0,
    }
  );

  observer.observe(root);

  return () => {
    cancelled = true;
    observer.disconnect();
    context?.revert();
  };
}, [lines]);

  return (
    <TagName
      ref={(node) => {
        rootRef.current = node;
      }}
      className={`relative block w-full ${className}`}
    >
      <span
        ref={measureRef}
        aria-hidden="true"
        className="pointer-events-none invisible absolute left-0 top-0 block w-full"
      >
        {words.map((word, index) => (
          <span
            key={`${word}-${index}`}
            data-measure-word
            data-word={word}
            data-word-index={index}
            className="inline-block"
          >
            {word}
            {index < words.length - 1 ? "\u00A0" : null}
          </span>
        ))}
      </span>

      <span data-parallax-text className="block will-change-transform">
        {lines.length === 0 ? (
          <span>{text}</span>
        ) : (
          lines.map((line, lineIndex) => (
            <span key={`line-${lineIndex}`} className="block overflow-hidden">
              <span data-scroll-line className="block will-change-transform">
                {line.map((item, wordIndex) => (
                  <span
                    key={`${item.word}-${item.index}`}
                    className="inline-block"
                  >
                    {Array.from(item.word).map((letter, letterIndex) => (
                      <span
                        key={`${item.word}-${item.index}-${letter}-${letterIndex}`}
                        data-scroll-letter
                        className="inline-block"
                      >
                        {letter}
                      </span>
                    ))}

                    {wordIndex < line.length - 1 ? "\u00A0" : null}
                  </span>
                ))}
              </span>
            </span>
          ))
        )}
      </span>
    </TagName>
  );
}