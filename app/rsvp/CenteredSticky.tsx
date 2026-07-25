"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

type CenteredStickyProps = {
  children: ReactNode;
};

export function CenteredSticky({
  children,
}: CenteredStickyProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState<number | null>(null);

  useEffect(() => {
    const content = contentRef.current;

    if (!content) return;

    const updateTop = () => {
      const contentHeight = content.getBoundingClientRect().height;

      setTop(window.innerHeight / 2 - contentHeight / 2);
    };

    updateTop();

    const resizeObserver = new ResizeObserver(updateTop);

    resizeObserver.observe(content);
    window.addEventListener("resize", updateTop);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateTop);
    };
  }, []);

  return (
    <div
      className="md:sticky"
      style={{
        top: top === null ? undefined : `${top}px`,
      }}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
}