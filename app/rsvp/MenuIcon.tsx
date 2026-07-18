"use client";

import { motion } from "framer-motion";

type MenuIconProps = {
  open: boolean;
};

const transition = {
  duration: 0.8,
  ease: [0.16, 1, 0.3, 1] as const,
};

export function MenuIcon({ open }: MenuIconProps) {
  return (
    <svg
      viewBox="0 0 99 99"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-[99px] w-[99px]"
      aria-hidden="true"
    >
      <motion.line
        animate={{
          x1: open ? 35.3536 : 69.5,
          y1: open ? 35.6464 : 46,
          x2: open ? 64.3449 : 29.5,
          y2: open ? 64.6378 : 46,
        }}
        transition={transition}
        stroke="black"
      />

      <motion.line
        animate={{
          x1: open ? 34.6464 : 69.5,
          y1: open ? 64.6464 : 54,
          x2: open ? 63.6378 : 29.5,
          y2: open ? 35.6551 : 54,
        }}
        transition={transition}
        stroke="black"
      />
    </svg>
  );
}