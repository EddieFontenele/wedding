"use client";

import { useEffect, useState } from "react";


type Convidado = {
  convidado_id: string;
  nome_exibicao: string;
  confirmado: boolean | null;
  checkin_em: string | null;
};

type Convite = {
  convite_id: string;
  nome_convite: string;
  qr_code_id: string;
};

export function CheckinForm() {
  const [codigo, setCodigo] = useState("");
  const [convite, setConvite] = useState<Convite | null>(null);
  const [convidados, setConvidados] = useState<Convidado[]>([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function buscarConvite(codigoBusca: string) {
  setErro("");
  setConvite(null);
  setConvidados([]);
  setCarregando(true);

  const response = await fetch("/api/checkin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      acao: "buscar",
      codigo: codigoBusca.trim(),
    }),
  });

  setCarregando(false);

  if (!response.ok) {
    setErro("Convite não encontrado.");
    return;
  }

  const data = await response.json();

  setConvite(data.convite);
  setConvidados(data.convidados);
}

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codigoUrl = params.get("codigo");

    if (codigoUrl) {
      setCodigo(codigoUrl);
      buscarConvite(codigoUrl);
    }
  }, []);

  return (
    <div className="mt-8">
      {carregando && <p className="text-neutral-400">Buscando convite...</p>}

      {erro && <p className="text-red-400">{erro}</p>}

      {convite && (
        <div className="rounded-xl border border-green-500/40 bg-green-500/10 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-green-300">
  Convite encontrado
</p>
          <p className="mt-2 text-2xl font-semibold">{convite.nome_convite}</p>

          <div className="mt-6 space-y-3">
            {convidados.map((convidado) => {
              const liberado = convidado.confirmado === true;
              const jaEntrou = Boolean(convidado.checkin_em);

              async function confirmarEntrada(convidadoId: string) {
  const response = await fetch("/api/checkin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      acao: "confirmar",
      convidadoId,
    }),
  });

  if (!response.ok) {
    alert("Erro ao confirmar entrada.");
    return;
  }

  const data = await response.json();

  setConvidados((listaAtual) =>
    listaAtual.map((item) =>
      item.convidado_id === convidadoId
        ? { ...item, checkin_em: data.checkin_em }
        : item
    )
  );
}

              return (
                <div
                  key={convidado.convidado_id}
                  className="rounded-xl border border-white/10 bg-black/30 p-4"
                >
                  <p className="font-medium">{convidado.nome_exibicao}</p>

                  {!liberado && (
<div className="mt-3 rounded-lg border border-red-500/40 bg-red-500/10 p-3">
  <p className="text-sm font-semibold text-red-300">
    Entrada bloqueada
  </p>
  <p className="mt-1 text-xs text-red-100/70">
    Esta pessoa não confirmou presença.
  </p>
</div>
                  )}

                    {liberado && jaEntrou && (
                    <div className="mt-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3">
                        <p className="text-sm font-medium text-yellow-300">
                        Check-in já realizado
                        </p>
                        <p className="mt-1 text-xs text-yellow-100/80">
                        Entrada registrada em{" "}
                        {new Date(convidado.checkin_em!).toLocaleString("pt-BR")}
                        </p>
                    </div>
                    )}

                  {liberado && !jaEntrou && (
                    <button
                        type="button"
                        onClick={() => confirmarEntrada(convidado.convidado_id)}
                        className="mt-3 w-full cursor-pointer rounded-lg bg-white px-4 py-3 font-medium text-black"
                        >
                        Liberar entrada
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!convite && !carregando && (
        <>
          <input
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Código do QR"
            className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white outline-none"
          />

          <button
            type="button"
            onClick={() => buscarConvite(codigo)}
            className="mt-4 w-full cursor-pointer rounded-xl bg-white p-4 font-medium text-black"
          >
            Buscar convite
          </button>
        </>
      )}
    </div>
  );
}