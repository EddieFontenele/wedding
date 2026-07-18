"use client";

import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MenuIcon } from "./MenuIcon";
import { motion } from "framer-motion";

const menuItems = [
  { label: "Início", href: "#inicio" },
  { label: "RSVP", href: "#rsvp" },
  { label: "Local", href: "#local" },
  { label: "Hospedagem", href: "#hospedagem" },
  { label: "Manual", href: "#manual" },
  { label: "Presentes", href: "#presentes" },
];

export function MenuOverlay() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const lenis = window.__lenis;

    if (open) {
      lenis?.stop();
    } else {
      lenis?.start();
    }

    return () => {
      lenis?.start();
    };
  }, [open]);

  function handleNavigate(
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) {
    event.preventDefault();

    const section = document.querySelector<HTMLElement>(href);
    const lenis = window.__lenis;

    if (!section || !lenis) return;

    setOpen(false);
    lenis.start();

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();

      const introRoot =
        section.querySelector<HTMLElement>("[data-intro-parallax]")
          ?.parentElement ?? null;

      let targetTop: number;

      if (introRoot) {
        const introTrigger = ScrollTrigger.getAll().find(
          (trigger) => trigger.trigger === introRoot
        );

        if (introTrigger) {
          const INTRO_TARGET_PROGRESS = 0.5;

          targetTop =
            introTrigger.start +
            (introTrigger.end - introTrigger.start) *
              INTRO_TARGET_PROGRESS;
        } else {
          targetTop =
            section.getBoundingClientRect().top + window.scrollY;
        }
      } else {
        const sectionTop =
          section.getBoundingClientRect().top + window.scrollY;

        targetTop =
          sectionTop +
          section.offsetHeight / 2 -
          window.innerHeight / 2;
      }

      lenis.scrollTo(Math.max(0, targetTop), {
        duration: 1.1,
        force: true,
        lock: true,
        onComplete: () => {
          ScrollTrigger.update(true);
        },
      });

      window.history.replaceState(null, "", href);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        className="fixed right-0 top-1/2 z-[80] flex h-[72px] w-[calc(((100vw-88px)/12)*2+8px)] -translate-y-1/2 cursor-pointer items-center justify-center md:h-[99px] md:w-[99px]"
      >
        <div className="flex h-[72px] w-[72px] items-center justify-center md:h-[99px] md:w-[99px]">
            <MenuIcon open={open} />
        </div>
      </button>

      {/* Fundo: entra de baixo para cima */}
<motion.div
  initial={false}
  animate={{
    clipPath: open
      ? "inset(0% 0% 0% 0%)"
      : "inset(100% 0% 0% 0%)",
  }}
  transition={{
    duration: 0.8,
    ease: [0.16, 1, 0.3, 1],
  }}
  className={`fixed inset-0 z-[70] bg-[#DCCB7A] ${
    open ? "pointer-events-auto" : "pointer-events-none"
  }`}
>
  <nav className="grid min-h-screen grid-cols-12 gap-2 px-0 md:px-6">
    <div className="col-start-3 col-span-8 flex min-h-screen flex-col items-center justify-center gap-3 text-center md:gap-4">
      {menuItems.map((item, index) => (
        <motion.a
  key={item.href}
  href={item.href}
  onClick={(event) => handleNavigate(event, item.href)}
  initial={false}
  animate={{
    opacity: open ? 1 : 0,
    y: open ? 0 : 48,
  }}
  whileHover={{
    letterSpacing: "0.04em",
  }}
  transition={{
    opacity: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      delay: open
        ? 0.18 + (menuItems.length - 1 - index) * 0.016
        : 0,
    },
    y: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      delay: open
        ? 0.18 + (menuItems.length - 1 - index) * 0.016
        : 0,
    },
    letterSpacing: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  }}
  className="w-full max-w-full cursor-pointer font-cheyra text-[clamp(2.75rem,12vw,7rem)] leading-[0.9] text-black md:leading-[0.85]"
>
  {item.label}
</motion.a>
      ))}
    </div>
  </nav>
</motion.div>
    </>
  );
}
