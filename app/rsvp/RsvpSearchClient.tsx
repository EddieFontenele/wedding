"use client";

import { useState } from "react";
import { supabase } from "@/src/lib/supabase";
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
  convidados: Convidado[];
  jaFinalizado: boolean;
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

    const { data, error } = await supabase
      .from("convidados")
      .select("nome_exibicao, convites(slug, nome_convite)")
      .ilike("nome_exibicao", `%${termo}%`)
      .limit(8);

    setBuscando(false);

    if (error) {
      setErro("Houve um erro na busca. Tente novamente.");
      return;
    }

    const normalizados = (data ?? [])
      .map((item: any) => {
        const convite = Array.isArray(item.convites)
          ? item.convites[0]
          : item.convites;

        return {
          nome: convite?.nome_convite ?? item.nome_exibicao,
          slug: convite?.slug,
        };
      })
      .filter((item) => item.slug);

    const unicos = Array.from(
      new Map(normalizados.map((item) => [item.slug, item])).values()
    );

    if (!unicos.length) {
      setErro("Nome não encontrado");
      return;
    }

    setResultados(unicos);
  }

  async function carregarConvite(slug: string) {
    setCarregandoConvite(true);
    setErro("");

    const { data: convite, error: conviteError } = await supabase
      .from("convites")
      .select("convite_id, qr_code_id, status_convite")
      .eq("slug", slug)
      .single();

    if (conviteError || !convite) {
      setCarregandoConvite(false);
      setErro("Houve um erro ao abrir o convite. Tente novamente.");
      return;
    }

    const { data: convidados, error: convidadosError } = await supabase
      .from("convidados")
      .select("convidado_id, nome_exibicao, status_rsvp, confirmado")
      .eq("convite_id", convite.convite_id)
      .order("nome_exibicao");

    setCarregandoConvite(false);

    if (convidadosError) {
      setErro("Houve um erro ao carregar os convidados. Tente novamente.");
      return;
    }

    setConviteSelecionado({
      qrCodeId: convite.qr_code_id,
      convidados: convidados ?? [],
      jaFinalizado: convite.status_convite === "rsvp_finalizado",
    });
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
          convidados={conviteSelecionado.convidados}
          qrCodeId={conviteSelecionado.qrCodeId}
          jaFinalizado={conviteSelecionado.jaFinalizado}
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