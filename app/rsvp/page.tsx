import Image from "next/image";
import { instrumentSerif } from "@/app/fonts";
import { RsvpSearchClient } from "./RsvpSearchClient";
import { WeddingTimeline } from "./WeddingTimeline";
import { ScrollIndicator } from "./rsvp/ScrollIndicator";
import { ParallaxImage } from "./ParallaxImage";
import { ScrollScaleImage } from "./ScrollScaleImage";
import { MenuOverlay } from "./MenuOverlay";
import { MotionTextBlock } from "./MotionTextBlock";
import { MotionSectionIntro } from "./MotionSectionIntro";
import { SmoothAnchorLink } from "./SmoothAnchorLink";


export default function RSVPBuscaPage() {
  return (
    <main
      className={`min-h-screen overflow-x-clip bg-[#FAF5EE] text-black ${instrumentSerif.className}`}
    >
      <p className="fixed left-0 top-6 z-50 w-[calc((100vw-88px)/6+8px)] text-center text-[0.65rem] text-black/40 md:left-6 md:top-10 md:w-auto md:type-body-2">
        Bauru, SP
      </p>

      <a
        href="#inicio"
        className="fixed left-1/2 top-6 z-50 -translate-x-1/2 md:top-10"
      >
        <Image
          src="/logo-symbol.png"
          alt="Eduardo e Juliana"
          width={32}
          height={16}
          priority
        />
      </a>

      <p className="fixed right-0 top-6 z-50 w-[calc((100vw-88px)/6+8px)] text-center text-[0.65rem] text-black/40 md:right-6 md:top-10 md:w-auto md:type-body-2">
        31.10.26
      </p>

      <ScrollIndicator />

      <MenuOverlay />


      <section
        id="inicio"
        className="relative grid min-h-screen grid-cols-12 gap-2 px-0 md:px-6"
      >
        <span
          data-page-anchor
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-1/2 h-px w-px"
        />

        <div className="col-start-3 col-span-8 flex min-h-screen flex-col items-center justify-center text-center md:col-start-2 md:col-span-10">
          <Image
            src="/logo_evento_2.png"
            alt="Juliana e Eduardo"
            width={430}
            height={230}
            priority
            className="w-full max-w-none md:w-[430px] md:max-w-[42vw]"
          />

          <p className="mt-10 max-w-md text-[1.2rem] leading-[1.4] text-black md:type-body-1">
            No dia 31.10 iremos nos casar na Chácara Veneza, em Bauru. Se você
            recebeu um convite,{" "}
            <SmoothAnchorLink
  href="#rsvp"
  className="underline underline-offset-4"
>
  Confirme sua presença
</SmoothAnchorLink>{" "}
            até o dia 20.08
          </p>
        </div>
      </section>

      <section
        id="rsvp"
        className="relative grid min-h-screen grid-cols-12 gap-2 px-0 py-20 md:px-6 md:py-24"
      >
        <span
          data-page-anchor
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-1/2 h-px w-px"
        />

        <div className="col-start-3 col-span-8 flex w-full items-center justify-center md:col-start-2 md:col-span-10">
          <RsvpSearchClient />
        </div>
      </section>

<section id="local" className="bg-[#FAF5EE]">
<MotionSectionIntro
  eyebrow="Local"
  title="CHÁCARA VENEZA"
  subtitle="No dia 31.10 iremos nos casar na Chácara Veneza, em Bauru. Se você recebeu um convite, confirme sua presença até o dia 20.08."
/>

<div className="px-0 pb-32 md:px-6">
  <div className="mb-[-160px] grid grid-cols-12 gap-2 md:mb-[-420px]">
    <ScrollScaleImage
      src="/local-01.jpg"
      alt="Chácara Veneza"
      width={1600}
      height={1000}
      startScale={1}
      endScale={0.6}
      mobileStartScale={1.2}
      mobileEndScale={0.8}
      moveY={220}
      innerMoveY={160}
      className="col-start-2 col-span-10"
    />
  </div>

  <div className="mt-[172px] grid grid-cols-12 gap-2">
    <div className="col-start-9 col-span-3 md:col-start-8 md:col-span-2">
      <ParallaxImage
        src="/local-02.jpg"
        alt="Área externa da Chácara Veneza"
        width={360}
        height={300}
        speed={140}
        innerSpeed={54}
        caption="Área externa para recepção dos convidados."
      />
    </div>
  </div>

  <div className="mt-2 grid grid-cols-12 gap-2 md:mt-[40px]">
    <div className="col-start-1 col-span-6 md:col-start-3 md:col-span-4">
      <ParallaxImage
        src="/local-03.jpg"
        alt="Decoração da Chácara Veneza"
        width={620}
        height={420}
        speed={34}
        innerSpeed={54}
        caption="Espaço da cerimônia e festa no mesmo lugar."
      />
    </div>
  </div>

  <div className="mt-3 grid grid-cols-12 gap-2 md:mt-[64px]">
    <div className="col-start-8 col-span-5 md:col-start-8 md:col-span-3">
      <ParallaxImage
        src="/local-04.jpg"
        alt="Vista aérea da cerimônia"
        width={520}
        height={620}
        speed={160}
        innerSpeed={54}
        caption="Cerimônia ao ar livre, cercada por verde."
      />
    </div>
  </div>

  <div className="mt-3 grid grid-cols-12 gap-2 md:-mt-[24px]">
    <div className="col-start-3 col-span-4 md:col-start-3 md:col-span-2">
      <ParallaxImage
        src="/local-05.jpg"
        alt="Mesa posta na Chácara Veneza"
        width={360}
        height={420}
        speed={34}
        innerSpeed={54}
        caption="Jantar, música e festa até o fim da noite."
      />
    </div>
  </div>
</div>

<MotionTextBlock text="No dia 31.10 iremos nos casar na Chácara Veneza, em Bauru. Se você recebeu um convite, confirme sua presença até o dia 20.08." />

<div className="grid grid-cols-12 gap-2 px-0 md:px-6">
  <ScrollScaleImage
    src="/local-06.jpg"
    alt="Vista ampla da Chácara Veneza"
    width={1920}
    height={1080}
    startScale={1}
    endScale={0.833}
    moveY={280}
    innerMoveY={180}
    mobileTall
    className="col-start-2 col-span-10 md:col-start-1 md:col-span-12"
  />
</div>

<div className="grid grid-cols-12 gap-2 px-0 py-24 md:min-h-[220vh] md:px-6 md:py-32">
  <div className="col-start-3 col-span-8 md:col-start-3 md:col-span-2">
    <div className="md:sticky md:top-0 md:flex md:h-screen md:items-center">
      <div>
        <p className="text-[1.7rem] leading-[1.15] text-black md:type-h5">
          Se você vier de São Paulo, sugerimos que pegue a BR-116 em direção a
          Campinas Paulista. A viagem dura por volta de 3h40.
        </p>

        <a
          href="https://maps.app.goo.gl/7EauPmeb7UtEgQQk9"
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-block underline underline-offset-4 type-body-2 text-black"
        >
          Ver no Google Maps
        </a>
      </div>
    </div>
  </div>

  <div className="col-start-1 col-span-12 mt-20 flex flex-col gap-20 md:col-start-6 md:col-span-6 md:mt-[220px] md:gap-40">
    <Image
      src="/local-map.png"
      alt="Mapa até a Chácara Veneza"
      width={900}
      height={520}
      className="h-auto w-full object-cover"
    />

    <div className="hidden md:block">
      <ParallaxImage
        src="/local-07.jpg"
        alt="Entrada da cerimônia na Chácara Veneza"
        width={900}
        height={520}
        speed={22}
        innerSpeed={48}
      />
    </div>
  </div>
</div>

</section>


<section id="hospedagem" className="bg-[#FAF5EE]">
  <MotionSectionIntro
    eyebrow="Hospedagem"
    title="HOTEL E TRASLADO"
    subtitle="Para quem vem de fora, teremos uma opção de hospedagem e traslado em Bauru."
  />

  <div className="px-0 pb-32 md:px-6">
    <div className="mb-[-160px] grid grid-cols-12 gap-2 md:mb-[-420px]">
      <ScrollScaleImage
        src="/hotel-01.jpg"
        alt="Hotel indicado para os convidados"
        width={1600}
        height={1000}
        startScale={1}
        endScale={0.6}
        mobileStartScale={1.2}
        mobileEndScale={0.8}
        moveY={220}
        innerMoveY={160}
        className="col-start-2 col-span-10"
      />
    </div>

    <div className="mt-[120px] grid grid-cols-12 gap-2">
      <div className="col-start-9 col-span-3 md:col-start-8 md:col-span-2">
        <ParallaxImage
          src="/hotel-02.jpg"
          alt="Área comum do hotel"
          width={520}
          height={680}
          speed={80}
          innerSpeed={54}
          caption="Uma base confortável para quem vem de fora."
        />
      </div>
    </div>

    <div className="mt-2 grid grid-cols-12 gap-2 md:mt-[40px]">
      <div className="col-start-1 col-span-6 md:col-start-3 md:col-span-4">
        <ParallaxImage
          src="/hotel-03.jpg"
          alt="Quarto do hotel"
          width={520}
          height={420}
          speed={34}
          innerSpeed={54}
          caption="Mais detalhes sobre reservas serão enviados perto da data."
        />
      </div>
    </div>

    <div className="mt-3 grid grid-cols-12 gap-2 md:mt-[64px]">
      <div className="col-start-8 col-span-5 md:col-start-8 md:col-span-3">
        <ParallaxImage
          src="/hotel-04.jpg"
          alt="Fachada ou recepção do hotel"
          width={720}
          height={460}
          speed={100}
          innerSpeed={54}
          caption="O traslado sairá do hotel em horário combinado."
        />
      </div>
    </div>

    <div className="mt-3 grid grid-cols-12 gap-2 md:-mt-[24px]">
      <div className="col-start-3 col-span-4 md:col-start-3 md:col-span-2">
        <ParallaxImage
          src="/hotel-05.jpg"
          alt="Detalhe do hotel"
          width={360}
          height={520}
          speed={44}
          innerSpeed={54}
          caption="A ideia é facilitar a chegada e a volta de todos."
        />
      </div>
    </div>
  </div>

<MotionTextBlock text="Vamos concentrar as informações de hospedagem e traslado por aqui, para que todo mundo consiga se organizar com calma antes do casamento." />

  <div className="grid grid-cols-12 gap-2 px-0 md:px-6">
    <ScrollScaleImage
      src="/hotel-06.jpg"
      alt="Vista ampla do hotel"
      width={1920}
      height={1080}
      startScale={1}
      endScale={0.833}
      moveY={280}
      innerMoveY={180}
      mobileTall
      className="col-start-2 col-span-10 md:col-start-1 md:col-span-12"
    />
  </div>

<div className="grid grid-cols-12 gap-x-2 gap-y-20 px-0 py-24 md:gap-y-2 md:px-6 md:py-32">
  <div className="col-start-3 col-span-8 md:col-start-3 md:col-span-2 md:flex md:items-center">
    <p className="text-[1.7rem] leading-[1.15] text-black md:type-h5">
      O hotel ficará em Bauru. Mais perto da data, enviaremos endereço,
      horários de saída e retorno do traslado.
    </p>
  </div>

  <div className="col-start-1 col-span-12 md:col-start-6 md:col-span-6">
    <Image
      src="/hotel-map.png"
      alt="Mapa do hotel indicado"
      width={900}
      height={520}
      className="h-auto w-full object-cover"
    />
  </div>
</div>
</section>

    <section id="manual" className="bg-[#FAF5EE]">
        <MotionSectionIntro
          eyebrow="Manual"
          title="COMBINADOS DO DIA"
          subtitle="Alguns combinados para que todo mundo aproveite a noite com calma, carinho e presença."
        />

        <WeddingTimeline />

        {/* DRESS CODE — MOBILE */}
        <div className="grid min-h-screen grid-cols-12 gap-2 py-24 md:hidden">
          <div className="col-start-3 col-span-8 text-center">
            <p className="text-[1.1rem] text-black">
              Dress Code:
            </p>

            <h2 className="mt-2 whitespace-nowrap text-[2.8rem] leading-[0.95] text-black">
              Social escuro
            </h2>
          </div>

          <div className="col-start-4 col-span-6 mt-4 text-center">
            <p className="text-[1.1rem] leading-[1.35] text-black">
              Black tie opcional, mas na prática pense em traje social escuro.
            </p>
          </div>

          <div className="col-start-1 col-span-12 mt-10 flex justify-center">
            <Image
              src="/dresscode.png"
              alt="Referência de dress code social escuro"
              width={760}
              height={512}
              className="h-auto w-full object-contain"
            />
          </div>

          <div className="col-start-2 col-span-10 mt-8 grid grid-cols-10 gap-2">
            <div className="col-span-5 -translate-x-2 text-right">
              <h3 className="text-[1.25rem] text-black">
                Terno escuro
              </h3>

              <p className="mt-2 text-[0.95rem] leading-[1.35] text-black">
                Camisa social e gravata, em tons fechados.
              </p>
            </div>

            <div className="col-span-5 translate-x-2 text-left">
              <h3 className="text-[1.25rem] text-black">
                Vestido escuro
              </h3>

              <p className="mt-2 text-[0.95rem] leading-[1.35] text-black">
                Longo ou midi, elegante e sem branco.
              </p>
            </div>
          </div>
        </div>

        {/* DRESS CODE — DESKTOP RESTAURADO */}
        <div className="hidden min-h-screen grid-cols-12 gap-2 px-6 py-24 md:grid">
          <div className="col-start-1 col-span-12 flex min-h-screen items-center">
            <div className="grid w-full grid-cols-12 gap-2">
              <div className="col-start-5 col-span-4 text-center">
                <p className="type-h5 text-black">
                  Dress Code:
                </p>

                <h2 className="type-h1 text-black">
                  Social escuro
                </h2>

                <p className="mx-auto max-w-[420px] type-body-2 text-black">
                  Black tie opcional, mas na prática pense em traje social escuro.
                </p>
              </div>

              <div className="col-start-1 col-span-12 grid grid-cols-12 gap-2">
                <div className="col-start-2 col-span-2 flex items-center justify-end translate-x-[calc(25%+4px)] text-right">
                  <div>
                    <h3 className="type-h5 text-black">
                      Terno escuro
                    </h3>

                    <p className="mt-2 type-body-2 text-black">
                      Camisa social e gravata, em tons fechados.
                    </p>
                  </div>
                </div>

                <div className="col-start-4 col-span-6 flex justify-center">
                  <Image
                    src="/dresscode.png"
                    alt="Referência de dress code social escuro"
                    width={760}
                    height={512}
                    className="h-[512px] w-auto object-contain"
                  />
                </div>

                <div className="col-start-10 col-span-2 flex items-center justify-start -translate-x-[calc(25%+4px)] text-left">
                  <div>
                    <h3 className="type-h5 text-black">
                      Vestido escuro
                    </h3>

                    <p className="mt-2 type-body-2 text-black">
                      Longo ou midi, elegante e sem branco.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

<div className="min-h-screen">
  {/* MOBILE */}
  <div className="grid min-h-screen grid-cols-12 gap-2 py-24 md:hidden">
    <div className="col-start-3 col-span-8 text-center">
  <h2 className="text-[2.8rem] leading-[0.95] text-black">
    O que pedimos
    <br />
    encarecidamente
  </h2>
</div>

    <div className="col-start-1 col-span-12 mt-3">
      <Image
        src="/pedimos.png"
        alt="Noivos dançando"
        width={520}
        height={558}
        className="h-auto w-full object-contain"
      />
    </div>

    <div className="col-start-3 col-span-8 mt-10 flex flex-col gap-10 text-left">
      <div>
        <h3 className="text-[1.25rem] text-black">
          Cerimônia sem celulares
        </h3>

        <p className="mt-2 text-[0.95rem] leading-[1.35] text-black">
          Durante a cerimônia, pedimos que os celulares fiquem no silencioso
          e guardados. Sem fotos ou vídeos nesse momento.
        </p>
      </div>

      <div>
        <h3 className="text-[1.25rem] text-black">
          Cerimônia sem celulares
        </h3>

        <p className="mt-2 text-[0.95rem] leading-[1.35] text-black">
          Durante a cerimônia, pedimos que os celulares fiquem no silencioso
          e guardados. Sem fotos ou vídeos nesse momento.
        </p>
      </div>

      <div>
        <h3 className="text-[1.25rem] text-black">
          Cerimônia sem celulares
        </h3>

        <p className="mt-2 text-[0.95rem] leading-[1.35] text-black">
          Durante a cerimônia, pedimos que os celulares fiquem no silencioso
          e guardados. Sem fotos ou vídeos nesse momento.
        </p>
      </div>

      <div>
        <h3 className="text-[1.25rem] text-black">
          Cerimônia sem celulares
        </h3>

        <p className="mt-2 text-[0.95rem] leading-[1.35] text-black">
          Durante a cerimônia, pedimos que os celulares fiquem no silencioso
          e guardados. Sem fotos ou vídeos nesse momento.
        </p>
      </div>

      <div>
        <h3 className="text-[1.25rem] text-black">
          Cerimônia sem celulares
        </h3>

        <p className="mt-2 text-[0.95rem] leading-[1.35] text-black">
          Durante a cerimônia, pedimos que os celulares fiquem no silencioso
          e guardados. Sem fotos ou vídeos nesse momento.
        </p>
      </div>

      <div>
        <h3 className="text-[1.25rem] text-black">
          Cerimônia sem celulares
        </h3>

        <p className="mt-2 text-[0.95rem] leading-[1.35] text-black">
          Durante a cerimônia, pedimos que os celulares fiquem no silencioso
          e guardados. Sem fotos ou vídeos nesse momento.
        </p>
      </div>
    </div>
  </div>

  {/* DESKTOP — mantido como estava */}
  <div className="hidden min-h-screen grid-cols-12 gap-2 px-6 py-24 md:grid">
    <div className="col-start-1 col-span-12 flex min-h-screen items-center justify-center">
      <div className="grid w-full grid-cols-12 gap-2">
        <div className="col-start-4 col-span-6 text-center">
          <h2 className="relative z-10 type-h1 !leading-[0.98] text-black">
            O que nós pedimos
            <br />
            encarecidamente
          </h2>
        </div>

        <div className="relative col-start-1 col-span-12 -mt-12 grid grid-cols-12 gap-2">
          <div className="col-start-5 col-span-4 flex justify-center">
            <Image
              src="/pedimos.png"
              alt="Noivos dançando"
              width={520}
              height={558}
              className="relative z-20 h-[558px] w-auto object-contain"
            />
          </div>

          <div className="col-start-2 col-span-3 row-start-1 flex flex-col justify-center gap-20 pr-8 text-right">
            <div>
              <h3 className="type-h5 text-black">
                Cerimônia sem celulares
              </h3>

              <p className="mt-2 type-body-2 text-black">
                Durante a cerimônia, pedimos que os celulares fiquem no
                silencioso e guardados. Sem fotos ou vídeos nesse momento.
              </p>
            </div>

            <div>
              <h3 className="type-h5 text-black">
                Cerimônia sem celulares
              </h3>

              <p className="mt-2 type-body-2 text-black">
                Durante a cerimônia, pedimos que os celulares fiquem no
                silencioso e guardados. Sem fotos ou vídeos nesse momento.
              </p>
            </div>

            <div>
              <h3 className="type-h5 text-black">
                Cerimônia sem celulares
              </h3>

              <p className="mt-2 type-body-2 text-black">
                Durante a cerimônia, pedimos que os celulares fiquem no
                silencioso e guardados. Sem fotos ou vídeos nesse momento.
              </p>
            </div>
          </div>

          <div className="col-start-9 col-span-3 row-start-1 flex flex-col justify-center gap-20 pl-8 text-left">
            <div>
              <h3 className="type-h5 text-black">
                Cerimônia sem celulares
              </h3>

              <p className="mt-2 type-body-2 text-black">
                Durante a cerimônia, pedimos que os celulares fiquem no
                silencioso e guardados. Sem fotos ou vídeos nesse momento.
              </p>
            </div>

            <div>
              <h3 className="type-h5 text-black">
                Cerimônia sem celulares
              </h3>

              <p className="mt-2 type-body-2 text-black">
                Durante a cerimônia, pedimos que os celulares fiquem no
                silencioso e guardados. Sem fotos ou vídeos nesse momento.
              </p>
            </div>

            <div>
              <h3 className="type-h5 text-black">
                Cerimônia sem celulares
              </h3>

              <p className="mt-2 type-body-2 text-black">
                Durante a cerimônia, pedimos que os celulares fiquem no
                silencioso e guardados. Sem fotos ou vídeos nesse momento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
    </section>

    <section id="presentes" className="bg-[#FAF5EE]">
<MotionSectionIntro
  eyebrow="Presentes"
  title="PARA CELEBRAR"
  subtitle="A presença de vocês é suficiente. Esta lista é apenas para quem quiser nos presentear de alguma forma."
  className="mb-[-160px] md:mb-[-280px]"
/>

<div className="grid grid-cols-12 gap-2 px-0 pb-32 md:px-6">
    <div className="col-start-3 col-span-8 flex justify-center md:col-start-5 md:col-span-4">
      <a
        href="https://noivos.casar.com/juliana-e-eduardo-2026-10-31?preview_as_guest=1&_ref_=/presentes#/presentes"
        target="_blank"
        rel="noreferrer"
        className="flex h-[56px] w-full items-center justify-center bg-black px-4 text-[1rem] text-white transition-opacity hover:opacity-80 md:h-[64px] md:w-auto md:px-10 md:type-h5"
      >
        Acessar lista de presentes
      </a>
    </div>
  </div>
</section>

  </main>
  );
}
