"use client";

import { useState } from "react";
import { RSVPForm } from "./[slug]/RSVPForm";

type Resultado = {
  nome: string;
  slug: string;
};

type Convidado = {
  convidado_id: string;
  nome_exibicao: string;
  status_rsvp: string | null;
  confirmado: boolean | null;
};

type ConviteSelecionado = {
  qrCodeId: string;
  nomeConvite: string;
  convidados: Convidado[];
  jaFinalizado: boolean;
  utilizaHotel: boolean | null;
  utilizaTraslado: boolean | null;
};

export function RsvpSearchClient() {
  const [busca, setBusca] = useState("");
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [carregandoConvite, setCarregandoConvite] = useState(false);
  const [erro, setErro] = useState("");
  const [conviteSelecionado, setConviteSelecionado] =
    useState<ConviteSelecionado | null>(null);

  const temBusca = busca.trim().length > 0;
  const temResultados = resultados.length > 0;

  const tituloBusca = temResultados
    ? `${resultados.length} convite${resultados.length === 1 ? "" : "s"} encontrado${
        resultados.length === 1 ? "" : "s"
      }`
    : "Confirme sua presença";

  async function pesquisar() {
    const termo = busca.trim();

    if (!termo) return;

    setBuscando(true);
    setErro("");
    setResultados([]);
    setConviteSelecionado(null);

    const response = await fetch("/api/rsvp/search", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ termo }),
});

setBuscando(false);

if (!response.ok) {
  setErro("Houve um erro na busca. Tente novamente.");
  return;
}

const { resultados } = await response.json();

if (!resultados.length) {
  setErro("Nome não encontrado");
  return;
}

setResultados(resultados);
  }

  async function carregarConvite(slug: string) {
  setCarregandoConvite(true);
  setErro("");

  const response = await fetch("/api/rsvp/invite", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ slug }),
  });

  setCarregandoConvite(false);

  if (!response.ok) {
    setErro("Houve um erro ao abrir o convite. Tente novamente.");
    return;
  }

  const { convite } = await response.json();

  setConviteSelecionado(convite);
}

  function novaConsulta() {
    setBusca("");
    setResultados([]);
    setErro("");
    setConviteSelecionado(null);
  }

  if (conviteSelecionado) {
    return (
      <div className="w-full">
        <RSVPForm
          nomeConvite={conviteSelecionado.nomeConvite}
          convidados={conviteSelecionado.convidados}
          qrCodeId={conviteSelecionado.qrCodeId}
          jaFinalizado={conviteSelecionado.jaFinalizado}
utilizaHotelInicial={conviteSelecionado.utilizaHotel}
utilizaTrasladoInicial={conviteSelecionado.utilizaTraslado}
        />
      </div>
    );
  }

  return (
    <div className="text-center">
      <p className="text-[1.25rem] leading-[1.2] text-black md:type-h5">
        {tituloBusca}
      </p>

      <div className="mx-auto mt-20 w-full max-w-full md:mt-36 md:w-[636px]">
        <div className="min-h-[64px]">
          {!temResultados ? (
            <input
              suppressHydrationWarning
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") pesquisar();
              }}
              placeholder="Seu nome"
              className="w-full border-b border-black bg-transparent pb-0 text-center type-h2 leading-[0.95] text-black outline-none placeholder:text-black/15 md:pb-2 md:leading-normal"
            />
          ) : (
            <div className="flex w-full flex-col gap-4">
              {resultados.map((resultado) => (
                <button
                  key={resultado.slug}
                  type="button"
                  onClick={() => carregarConvite(resultado.slug)}
                  disabled={carregandoConvite}
                  className="flex min-h-[48px] w-full cursor-pointer items-center justify-center gap-2 pb-2 text-black transition-opacity hover:opacity-60 disabled:cursor-wait disabled:opacity-40 md:min-h-[64px]"
                >
                  <span className="text-[1.4rem] leading-[1.1] md:text-[63px] md:leading-none">
                    {resultado.nome}
                  </span>

                  <img
                    src="/seta-lg.svg"
                    alt=""
                    width={60}
                    height={60}
                    className="h-[36px] w-[36px] shrink-0 md:h-[60px] md:w-[60px]"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-9 min-h-[64px]">
          {!temResultados ? (
            <button
              type="button"
              onClick={pesquisar}
              disabled={!temBusca || buscando}
              className={`h-[48px] w-[112px] cursor-pointer bg-black text-[0.95rem] text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-30 md:h-[64px] md:w-[128px] md:type-h5 ${
                temBusca ? "" : "invisible pointer-events-none"
              }`}
            >
              {buscando ? "Buscando..." : "Pesquisar"}
            </button>
          ) : (
            <button
              type="button"
              onClick={novaConsulta}
              className="h-[48px] cursor-pointer bg-transparent text-[0.95rem] text-black underline underline-offset-4 transition-opacity hover:no-underline md:h-[64px] md:type-h5"
            >
              Nova consulta
            </button>
          )}
        </div>

        {erro && <p className="mt-32 type-body-2 text-red-600">{erro}</p>}
      </div>
    </div>
  );
}