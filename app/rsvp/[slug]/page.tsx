import Image from "next/image";
import { supabase } from "@/src/lib/supabase";
import { instrumentSerif } from "@/app/fonts";
import { RSVPForm } from "./RSVPForm";

export default async function RSVPPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: convite } = await supabase
    .from("convites")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!convite) {
    return <main className="p-6">Convite não encontrado.</main>;
  }

  const { data: convidados } = await supabase
    .from("convidados")
    .select("*")
    .eq("convite_id", convite.convite_id)
    .order("nome_exibicao");

  return (
    <main className={`min-h-screen bg-[#FAF5EE] text-black ${instrumentSerif.className}`}>
      <p className="fixed left-6 top-10 z-50 type-body-2 text-black/40">
        Bauru, SP
      </p>

      <div className="fixed left-1/2 top-10 z-50 -translate-x-1/2">
        <Image
          src="/logo-symbol.png"
          alt="Eduardo e Juliana"
          width={32}
          height={16}
          priority
        />
      </div>

      <p className="fixed right-6 top-10 z-50 type-body-2 text-black/40">
        31.10.26
      </p>

      <div className="fixed left-12 top-1/2 z-50 h-[220px] -translate-y-1/2">
        <div className="h-full w-px bg-[#DEC76B]/50">
          <div className="h-[28%] w-px bg-black/60" />
        </div>
      </div>

      <button
        type="button"
        aria-label="Abrir menu"
        className="fixed right-6 top-1/2 z-50 flex h-10 w-14 -translate-y-1/2 cursor-pointer flex-col items-center justify-center gap-2"
      >
        <span className="h-px w-10 bg-black/60" />
        <span className="h-px w-10 bg-black/60" />
      </button>

      <section className="relative grid min-h-screen grid-cols-12 gap-2 px-6">
        <div className="col-start-2 col-span-10 flex min-h-screen flex-col items-center justify-center text-center">
          <Image
            src="/logo_evento_2.png"
            alt="Juliana e Eduardo"
            width={430}
            height={230}
            priority
            className="w-[430px] max-w-[42vw]"
          />

          <p className="mt-10 max-w-md type-body-1 text-black">
            No dia 31.10 iremos nos casar na Chácara Veneza, em Bauru. Se você
            recebeu um convite,{" "}
            <a href="#rsvp" className="underline underline-offset-2">
              confirme sua presença
            </a>{" "}
            até o dia 20.08
          </p>
        </div>
      </section>

<section id="rsvp" className="grid min-h-screen grid-cols-12 gap-2 px-6">
  <div className="col-start-2 col-span-10 mx-auto flex w-full max-w-[1066px] items-center justify-center">
    <RSVPForm
      convidados={convidados ?? []}
      qrCodeId={convite.qr_code_id}
      jaFinalizado={convite.status_convite === "rsvp_finalizado"}
    />
  </div>
</section>
    </main>
  );
}