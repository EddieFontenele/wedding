"use client";

import { useState } from "react";

type Convidado = {
  convidado_id: string;
  nome_exibicao: string;
  status_rsvp: string | null;
  confirmado: boolean | null;
};

export function RSVPForm({
  nomeConvite,
  convidados,
  qrCodeId,
  jaFinalizado = false,
  utilizaHotelInicial = null,
  utilizaTrasladoInicial = null,
}: {
  nomeConvite: string;
  convidados: Convidado[];
  qrCodeId: string;
  jaFinalizado?: boolean;
  utilizaHotelInicial?: boolean | null;
  utilizaTrasladoInicial?: boolean | null;
}) {
  const [lista, setLista] = useState(convidados);

const [utilizaHotel, setUtilizaHotel] = useState<boolean | null>(
  utilizaHotelInicial
);

const [utilizaTraslado, setUtilizaTraslado] = useState<boolean | null>(
  utilizaTrasladoInicial
);

  const [confirmacaoFinalizada, setConfirmacaoFinalizada] =
    useState(jaFinalizado);
  const [finalizando, setFinalizando] = useState(false);
  const [trocandoTela, setTrocandoTela] = useState(false);

  const todosResponderamLista = lista.every(
    (item) => item.confirmado !== null
  );

  const alguemVai = lista.some((item) => item.confirmado === true);

  const todosResponderam =
  todosResponderamLista &&
  (!alguemVai ||
    (utilizaHotel !== null && utilizaTraslado !== null));

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

  const response = await fetch("/api/rsvp/confirm", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      qrCodeId,
      respostas: lista.map((item) => ({
        convidado_id: item.convidado_id,
        confirmado: item.confirmado,
        status_rsvp: item.confirmado ? "confirmado" : "nao_vai",
      })),
      utilizaHotel,
      utilizaTraslado,
    }),
  });

  setFinalizando(false);

  if (!response.ok) {
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
    nomeConvite.trim().split(/\s+/)[0] ?? "";

    const nomesConfirmados = lista.filter(
      (item) => item.confirmado === true
    );

    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center opacity-0 animate-[fadeIn_450ms_cubic-bezier(0.16,1,0.3,1)_forwards]">
        {nomesConfirmados.length > 0 ? (
  <div className="mx-auto flex w-full max-w-[480px] flex-col gap-6 px-4 text-center md:px-0">
    <p className="text-[1.1rem] leading-[1.35] text-black md:type-h5">
      Obrigado{primeiroNome ? `, ${primeiroNome}` : ""}. Sua resposta foi
      registrada.
      <br />
      O QR Code para entrada será enviado pelo WhatsApp nos próximos dias.
    </p>

    {utilizaHotel === true && (
      <p className="text-[1.1rem] leading-[1.35] text-black md:type-h5">
        Você também receberá um cupom de desconto para utilizar em estadias no
        hotel Blue Tree Garden entre os dias 30.10 e 01.11.
      </p>
    )}
  </div>
) : (
  <p className="max-w-[560px] text-center text-[1.1rem] leading-[1.35] text-black md:type-h5">
    Obrigado{primeiroNome ? `, ${primeiroNome}` : ""}. Sua resposta foi
    registrada. Sentiremos sua falta!
  </p>
)}
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
  <>
    <div className="mt-4 grid grid-cols-2 items-center gap-2 border-t border-black pt-4 md:mt-3 md:grid-cols-[1fr_120px_120px] md:pt-2">
      <p className="col-span-2 mb-1 text-[1.1rem] text-black md:col-span-1 md:mb-0 md:type-h5">
        Precisaremos de{" "}
        <a
          href="/#hospedagem"
          className="underline underline-offset-2 hover:no-underline"
        >
          hotel
        </a>
        ?
      </p>

      <button
        type="button"
        aria-pressed={utilizaHotel === true}
        onClick={() => setUtilizaHotel(true)}
        className={`relative z-10 h-[48px] w-full touch-manipulation cursor-pointer border text-[0.95rem] transition-colors focus:outline-none md:type-h6 ${
          utilizaHotel === true
            ? "border-black bg-black text-white"
            : "border-black/40 bg-transparent text-black hover:bg-black/5"
        }`}
      >
        Sim
      </button>

      <button
        type="button"
        aria-pressed={utilizaHotel === false}
        onClick={() => setUtilizaHotel(false)}
        className={`relative z-10 h-[48px] w-full touch-manipulation cursor-pointer border text-[0.95rem] transition-colors focus:outline-none md:type-h6 ${
          utilizaHotel === false
            ? "border-black bg-black text-white"
            : "border-black/40 bg-transparent text-black hover:bg-black/5"
        }`}
      >
        Não
      </button>
    </div>

    <div className="grid grid-cols-2 items-center gap-2 md:grid-cols-[1fr_120px_120px]">
      <p className="col-span-2 mb-1 text-[1.1rem] text-black md:col-span-1 md:mb-0 md:type-h5">
        Utilizaremos o traslado?
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
  </>
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