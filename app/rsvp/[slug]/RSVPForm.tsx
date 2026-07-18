"use client";

import { useState } from "react";
import { supabase } from "@/src/lib/supabase";

type Convidado = {
  convidado_id: string;
  nome_exibicao: string;
  status_rsvp: string | null;
  confirmado: boolean | null;
};

export function RSVPForm({
  convidados,
  qrCodeId,
  jaFinalizado = false,
}: {
  convidados: Convidado[];
  qrCodeId: string;
  jaFinalizado?: boolean;
}) {
  const [lista, setLista] = useState(convidados);
  const [utilizaTraslado, setUtilizaTraslado] = useState<boolean | null>(null);
  const [confirmacaoFinalizada, setConfirmacaoFinalizada] =
    useState(jaFinalizado);
  const [finalizando, setFinalizando] = useState(false);
  const [trocandoTela, setTrocandoTela] = useState(false);

  const todosResponderamLista = lista.every(
    (item) => item.confirmado !== null
  );

  const alguemVai = lista.some((item) => item.confirmado === true);

  const todosResponderam =
    todosResponderamLista && (!alguemVai || utilizaTraslado !== null);

  function atualizar(id: string, novoValor: boolean) {
    setLista((listaAtual) =>
      listaAtual.map((item) => {
        if (item.convidado_id !== id) return item;

        const limpar = item.confirmado === novoValor;
        const confirmado = limpar ? null : novoValor;

        return {
          ...item,
          confirmado,
          status_rsvp: limpar
            ? "pendente"
            : novoValor
              ? "confirmado"
              : "nao_vai",
        };
      })
    );
  }

  async function finalizarConfirmacao() {
    if (!todosResponderam) return;

    setFinalizando(true);

    const confirmaram = lista.filter((item) => item.confirmado === true);
    const naoVao = lista.filter((item) => item.confirmado === false);

    await Promise.all(
      lista.map((item) =>
        supabase
          .from("convidados")
          .update({
            confirmado: item.confirmado,
            status_rsvp: item.status_rsvp,
          })
          .eq("convidado_id", item.convidado_id)
      )
    );

    const { count: totalConfirmados } = await supabase
      .from("convidados")
      .select("convidado_id", { count: "exact", head: true })
      .eq("confirmado", true);

    const detalhes = [
      confirmaram.length
        ? `Confirmaram:\n${confirmaram
            .map((item) => `- ${item.nome_exibicao}`)
            .join("\n")}`
        : "",
      naoVao.length
        ? `Não vão:\n${naoVao
            .map((item) => `- ${item.nome_exibicao}`)
            .join("\n")}`
        : "",
      utilizaTraslado !== null
        ? `Hotel e traslado:\n- ${utilizaTraslado ? "Sim" : "Não"}`
        : "",
      `Total confirmado até agora:\n${totalConfirmados ?? 0} ${
        totalConfirmados === 1 ? "pessoa" : "pessoas"
      }`,
    ]
      .filter(Boolean)
      .join("\n\n");

    const { error } = await supabase
      .from("convites")
      .update({
        status_convite: "rsvp_finalizado",
        rsvp_finalizado_em: new Date().toISOString(),
        detalhes_rsvp: detalhes,
        utiliza_hotel_traslado: utilizaTraslado,
      })
      .eq("qr_code_id", qrCodeId);

    setFinalizando(false);

    if (error) {
      alert("Houve um erro ao confirmar sua presença. Tente novamente.");
      return;
    }

    setTrocandoTela(true);

    setTimeout(() => {
      setConfirmacaoFinalizada(true);
      setTrocandoTela(false);
    }, 450);
  }

  if (confirmacaoFinalizada) {

    const primeiroNome =
    lista[0]?.nome_exibicao.trim().split(/\s+/)[0] ?? "";

    const nomesConfirmados = lista.filter(
      (item) => item.confirmado === true
    );

    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center opacity-0 animate-[fadeIn_450ms_cubic-bezier(0.16,1,0.3,1)_forwards]">
        <p className="max-w-[560px] text-center text-[1.1rem] leading-[1.35] text-black md:type-h5">
          Obrigado{primeiroNome ? `, ${primeiroNome}` : ""}.
          <br />
          {nomesConfirmados.length > 0 ? (
            <>
              Sua resposta foi registrada.
              <br />
              O QR Code para entrada será enviado pelo WhatsApp nos próximos
              dias.
            </>
          ) : (
            <>Sua resposta foi registrada. Sentiremos sua falta!</>
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 flex min-h-[460px] w-full flex-col overflow-hidden rounded-xl bg-white text-black md:min-h-[580px]">
      <div className="relative z-0 flex flex-1 flex-col px-4 pt-10 md:px-[88px] md:pt-16">
        <h2 className="w-full text-center font-cheyra text-[4rem] leading-[0.9] text-black md:text-[6.333rem]">
          RSVP
        </h2>

        <div
          className={`mt-14 flex flex-1 flex-col justify-end transition-opacity duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            trocandoTela ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="w-full text-left">
            <div className="space-y-2">
              {lista.map((convidado) => {
                const vai = convidado.confirmado === true;
                const naoVai = convidado.confirmado === false;

                return (
                  <div
                    key={convidado.convidado_id}
                    className="relative isolate grid grid-cols-2 items-center gap-2 md:grid-cols-[1fr_120px_120px]"
                  >
                    <p className="col-span-2 mb-1 text-[1.1rem] text-black md:col-span-1 md:mb-0 md:type-h5">
                      {convidado.nome_exibicao}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        atualizar(convidado.convidado_id, true)
                      }
                      className={`relative z-10 h-[48px] w-full touch-manipulation cursor-pointer border text-[0.95rem] transition-colors focus:outline-none md:type-h6 ${
                        vai
                          ? "border-black bg-black text-white"
                          : "border-black/40 bg-transparent text-black hover:bg-black/5"
                      }`}
                    >
                      Sim, irá
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        atualizar(convidado.convidado_id, false)
                      }
                      className={`relative z-10 h-[48px] w-full touch-manipulation cursor-pointer border text-[0.95rem] transition-colors focus:outline-none md:type-h6 ${
                        naoVai
                          ? "border-black bg-black text-white"
                          : "border-black/40 bg-transparent text-black hover:bg-black/5"
                      }`}
                    >
                      Não irá
                    </button>
                  </div>
                );
              })}

              {alguemVai && (
                <div className="mt-4 grid grid-cols-2 items-center gap-2 border-t border-black pt-4 md:mt-3 md:grid-cols-[1fr_120px_120px] md:pt-2">
                  <p className="col-span-2 mb-1 text-[1.1rem] text-black md:col-span-1 md:mb-0 md:type-h5">
                    Utilizaremos{" "}
                    <span className="underline underline-offset-2">
                      hotel e traslado
                    </span>
                  </p>

                  <button
                    type="button"
                    aria-pressed={utilizaTraslado === true}
                    onClick={() => setUtilizaTraslado(true)}
                    className={`relative z-10 h-[48px] w-full touch-manipulation cursor-pointer border text-[0.95rem] transition-colors focus:outline-none md:type-h6 ${
                      utilizaTraslado === true
                        ? "border-black bg-black text-white"
                        : "border-black/40 bg-transparent text-black hover:bg-black/5"
                    }`}
                  >
                    Sim
                  </button>

                  <button
                    type="button"
                    aria-pressed={utilizaTraslado === false}
                    onClick={() => setUtilizaTraslado(false)}
                    className={`relative z-10 h-[48px] w-full touch-manipulation cursor-pointer border text-[0.95rem] transition-colors focus:outline-none md:type-h6 ${
                      utilizaTraslado === false
                        ? "border-black bg-black text-white"
                        : "border-black/40 bg-transparent text-black hover:bg-black/5"
                    }`}
                  >
                    Não
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        disabled={!todosResponderam || finalizando}
        onClick={finalizarConfirmacao}
        className={`relative z-20 mt-8 h-[56px] w-full shrink-0 touch-manipulation text-[1rem] transition-colors md:mt-12 md:h-[84px] md:type-h5 ${
          todosResponderam && !finalizando
            ? "cursor-pointer bg-black text-white hover:bg-black/80"
            : "cursor-not-allowed bg-[#E6E6E6] text-white"
        }`}
      >
        {finalizando ? "Confirmando..." : "Confirmar resposta"}
      </button>
    </div>
  );
}