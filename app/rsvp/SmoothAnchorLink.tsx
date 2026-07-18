"use client";

import type { ReactNode } from "react";

type SmoothAnchorLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function SmoothAnchorLink({
  href,
  children,
  className = "",
}: SmoothAnchorLinkProps) {
  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    const target = document.querySelector<HTMLElement>(href);
    const lenis = window.__lenis;

    if (!target || !lenis) return;

    lenis.scrollTo(target, {
      duration: 1.1,
      force: true,
      lock: true,
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    });

    window.history.replaceState(null, "", href);
  }

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}