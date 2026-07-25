"use client";

import { ScrollScrubWords } from "./ScrollScrubWords";

type MotionTextBlockProps = {
  text: string;
};

export function MotionTextBlock({ text }: MotionTextBlockProps) {
  return (
    <div className="grid min-h-[120vh] grid-cols-12 gap-2 px-0 py-40 md:px-6">
      <div className="col-start-3 col-span-8 flex items-start pt-[8vh] md:col-start-5 md:col-span-3">
        <ScrollScrubWords
          as="p"
          className="type-h5 text-black"
          text={text}
        />
      </div>
    </div>
  );
}