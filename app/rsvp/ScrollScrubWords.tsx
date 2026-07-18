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
const LINE_OFFSET = 0.22;
const LINE_ROTATION = 5;

const LETTER_STAGGER = 0.018;
const LETTER_DURATION = 0.42;
const LETTER_ALPHA_DELAY = 0.02;

const REVEAL_SCROLL_DISTANCE = 900;
const PARALLAX_SPEED = 0.6;

const DISSOLVE_START_PROGRESS = 0.9;
const DISSOLVE_END_PROGRESS = 1;

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

      setLines(nextLines);
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

    const context = gsap.context(() => {
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

      ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom -20%",
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const scrollDistance = self.end - self.start;
          const compensation = scrollDistance * (1 - PARALLAX_SPEED);

          const dissolveProgress = gsap.utils.clamp(
            0,
            1,
            (self.progress - DISSOLVE_START_PROGRESS) /
              (DISSOLVE_END_PROGRESS - DISSOLVE_START_PROGRESS)
          );

          gsap.set(parallaxElement, {
            y: self.progress * compensation,
            opacity: 1 - dissolveProgress,
          });
        },
      });

      const revealTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 90%",
          end: `+=${REVEAL_SCROLL_DISTANCE}`,
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
            const aLeft = letterA.getBoundingClientRect().left;
            const bLeft = letterB.getBoundingClientRect().left;

            return aLeft - bLeft;
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
    }, root);

    return () => {
      context.revert();
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