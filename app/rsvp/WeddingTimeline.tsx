"use client";

import { useEffect, useRef, useState } from "react";

const eventos = [
  {
    horario: "16:30",
    icone: "🥂",
    titulo: "Recepção",
  },
  {
    horario: "18:00",
    icone: "💍",
    titulo: "Cerimônia",
  },
  {
    horario: "19:00",
    icone: "🍽️",
    titulo: "Jantar",
  },
  {
    horario: "20:00",
    icone: "🎷",
    titulo: "Festa e pista",
  },
  {
    horario: "21:00",
    icone: "🍰",
    titulo: "Doces e bolo",
  },
  {
    horario: "23:00",
    icone: "🪩",
    titulo: "Primeiro traslado",
    legenda: "Traslados seguintes a cada 30 min.",
  },
];

const HEADER_OFFSET_FROM_CENTER = 260;
const HEADER_HEIGHT = 88;

const DESKTOP_EVENT_LINE_HEIGHT = 72;
const DESKTOP_EVENT_GAP = 80;
const DESKTOP_EVENT_STEP =
  DESKTOP_EVENT_LINE_HEIGHT + DESKTOP_EVENT_GAP;

const MOBILE_EVENT_LINE_HEIGHT = 72;
const MOBILE_EVENT_GAP = 32;
const MOBILE_EVENT_STEP =
  MOBILE_EVENT_LINE_HEIGHT + MOBILE_EVENT_GAP;

const EVENT_VISUAL_OFFSET = 0;

export function WeddingTimeline() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [progresso, setProgresso] = useState(0);
  const [ativo, setAtivo] = useState(0);
  const ativoRef = useRef(0);

  useEffect(() => {
    let animationFrame: number | null = null;

    function atualizarTimeline() {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const alturaScrollavel = rect.height - window.innerHeight;

      if (alturaScrollavel <= 0) return;

      const novoProgresso = Math.min(
        Math.max(-rect.top / alturaScrollavel, 0),
        1
      );

      const posicaoVirtual = novoProgresso * (eventos.length - 1);

      const ACTIVATION_DELAY = 0.72;
      const atual = ativoRef.current;

      let novoAtivo = atual;

      if (
        atual < eventos.length - 1 &&
        posicaoVirtual >= atual + ACTIVATION_DELAY
      ) {
        novoAtivo = atual + 1;
      }

      if (
        atual > 0 &&
        posicaoVirtual <= atual - ACTIVATION_DELAY
      ) {
        novoAtivo = atual - 1;
      }

      ativoRef.current = novoAtivo;

      setProgresso(novoProgresso);
      setAtivo(novoAtivo);
    }

    function onScroll() {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(atualizarTimeline);
    }

    atualizarTimeline();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", atualizarTimeline);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", atualizarTimeline);

      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, []);

  const posicaoVirtual = progresso * (eventos.length - 1);

  const desktopEventListY =
    HEADER_OFFSET_FROM_CENTER -
    HEADER_HEIGHT -
    DESKTOP_EVENT_LINE_HEIGHT / 2 -
    posicaoVirtual * DESKTOP_EVENT_STEP +
    EVENT_VISUAL_OFFSET;

  const mobileEventListY =
    HEADER_OFFSET_FROM_CENTER -
    HEADER_HEIGHT -
    MOBILE_EVENT_LINE_HEIGHT / 2 -
    posicaoVirtual * MOBILE_EVENT_STEP +
    EVENT_VISUAL_OFFSET;

  function mobileOpacity(index: number, minimum = 0) {
    return Math.max(
      minimum,
      1 - Math.abs(index - posicaoVirtual) * 2
    );
  }

  return (
    <div
      ref={sectionRef}
      data-scroll-section="timeline"
      className="relative h-[215vh] bg-[#DCCB7A] md:h-[260vh]"
    >
      {/* MOBILE — estrutura independente */}
      <div className="sticky top-0 h-screen overflow-hidden bg-[#DCCB7A] md:hidden">
        <div className="relative h-full">
          <div className="absolute inset-0 grid grid-cols-12 gap-2">
            <div className="relative col-start-3 col-span-2 h-full">
              {eventos.map((evento, index) => (
                <p
                  key={evento.horario}
                  className="absolute left-0 top-1/2 -translate-y-1/2 whitespace-nowrap text-[1.8rem] leading-[0.9] text-black"
                  style={{
                    opacity: mobileOpacity(index),
                  }}
                >
                  {evento.horario}
                </p>
              ))}
            </div>

            <div className="relative col-start-5 col-span-1 h-full">
              {eventos.map((evento, index) => (
                <span
                  key={evento.horario}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[24px] leading-none"
                  style={{
                    opacity: mobileOpacity(index),
                  }}
                >
                  {evento.icone}
                </span>
              ))}
            </div>

            <div
              className="absolute bottom-0 left-0 right-0 grid grid-cols-12 gap-2 overflow-hidden"
              style={{
                top: `calc(50% - ${HEADER_OFFSET_FROM_CENTER}px + ${HEADER_HEIGHT}px)`,
              }}
            >
              <div className="relative col-start-6 col-span-5 h-full">
                <div
                  className="absolute left-0 top-0 w-full will-change-transform"
                  style={{
                    transform: `translateY(${mobileEventListY}px)`,
                  }}
                >
                  {eventos.map((evento, index) => (
                    <p
                      key={evento.horario}
                      className="absolute left-0 flex h-[72px] max-w-full items-center overflow-hidden break-words text-[1.8rem] leading-[0.9] text-black"
                      style={{
                        top: `${index * MOBILE_EVENT_STEP}px`,
                        opacity: mobileOpacity(index, 0.2),
                      }}
                    >
                      <span className="flex flex-col">
                        <span>{evento.titulo}</span>

                        {"legenda" in evento && evento.legenda ? (
                          <span className="mt-2 text-[0.75rem] leading-[1.25]">
                            {evento.legenda}
                          </span>
                        ) : null}
                      </span>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div
            className="pointer-events-none absolute left-0 right-0 z-20 grid grid-cols-12 gap-2"
            style={{
              top: `calc(50% - ${HEADER_OFFSET_FROM_CENTER}px)`,
            }}
          >
            <div
              className="col-start-3 col-span-8 flex items-center border-b border-black bg-[#DCCB7A]"
              style={{
                height: `${HEADER_HEIGHT}px`,
              }}
            >
              <p className="text-[1.1rem] text-black">Agenda do dia</p>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP — estrutura original restaurada */}
      <div className="sticky top-0 hidden h-screen overflow-hidden bg-[#DCCB7A] px-6 md:block">
        <div className="relative h-full">
          <div className="absolute inset-0 grid grid-cols-12 gap-2">
            <div className="relative col-start-3 col-span-2 h-full">
              {eventos.map((evento, index) => (
                <p
                  key={evento.horario}
                  className={`absolute right-0 top-1/2 -translate-y-1/2 type-h1 leading-[0.95] text-black transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    index === ativo ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {evento.horario}
                </p>
              ))}
            </div>

            <div className="relative col-start-5 col-span-1 h-full">
              {eventos.map((evento, index) => (
                <span
                  key={evento.horario}
                  className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[32px] leading-none transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    index === ativo ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {evento.icone}
                </span>
              ))}
            </div>

            <div
              className="absolute bottom-0 left-0 right-0 grid grid-cols-12 gap-2 overflow-hidden"
              style={{
                top: `calc(50% - ${HEADER_OFFSET_FROM_CENTER}px + ${HEADER_HEIGHT}px)`,
              }}
            >
              <div className="relative col-start-6 col-span-6 h-full">
                <div
                  className="absolute left-0 top-0 w-full will-change-transform"
                  style={{
                    transform: `translateY(${desktopEventListY}px)`,
                  }}
                >
                  {eventos.map((evento, index) => (
                    <p
                      key={evento.horario}
                      className={`absolute left-0 flex h-[72px] items-center type-h1 leading-[0.95] text-black transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        index === ativo ? "opacity-100" : "opacity-20"
                      }`}
                      style={{
                        top: `${index * DESKTOP_EVENT_STEP}px`,
                      }}
                    >
                      <span className="flex flex-col">
                        <span>{evento.titulo}</span>

                        {"legenda" in evento && evento.legenda ? (
                          <span className="mt-2 text-[0.9rem] leading-[1.25]">
                            {evento.legenda}
                          </span>
                        ) : null}
                      </span>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div
            className="pointer-events-none absolute left-0 right-0 z-20 grid grid-cols-12 gap-2"
            style={{
              top: `calc(50% - ${HEADER_OFFSET_FROM_CENTER}px)`,
            }}
          >
            <div
              className="col-start-6 col-span-6 flex items-center border-b border-black bg-[#DCCB7A]"
              style={{
                height: `${HEADER_HEIGHT}px`,
              }}
            >
              <p className="type-h5 text-black">Agenda do dia</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
