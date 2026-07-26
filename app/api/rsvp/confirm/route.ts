import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabaseAdmin";

type RespostaConvidado = {
  convidado_id: string;
  confirmado: boolean;
  status_rsvp: "confirmado" | "nao_vai";
};

export async function POST(request: Request) {
  const {
    qrCodeId,
    respostas,
    utilizaHotel,
    utilizaTraslado,
  }: {
    qrCodeId: string;
    respostas: RespostaConvidado[];
    utilizaHotel: boolean | null;
    utilizaTraslado: boolean | null;
  } = await request.json();

  if (
    !qrCodeId ||
    !Array.isArray(respostas) ||
    respostas.some((item) => typeof item.confirmado !== "boolean")
  ) {
    return NextResponse.json({ erro: "Resposta inválida." }, { status: 400 });
  }

  const { data: convite, error: conviteError } = await supabaseAdmin
    .from("convites")
    .select("convite_id")
    .eq("qr_code_id", qrCodeId)
    .single();

  if (conviteError || !convite) {
    return NextResponse.json({ erro: "Convite não encontrado." }, { status: 404 });
  }

  const { data: convidados, error: convidadosError } = await supabaseAdmin
    .from("convidados")
    .select("convidado_id, nome_exibicao")
    .eq("convite_id", convite.convite_id);

  if (convidadosError || !convidados) {
    return NextResponse.json({ erro: "Erro ao carregar convidados." }, { status: 500 });
  }

  const idsPermitidos = new Set(
    convidados.map((convidado) => convidado.convidado_id)
  );

  if (
    respostas.length !== convidados.length ||
    respostas.some((resposta) => !idsPermitidos.has(resposta.convidado_id))
  ) {
    return NextResponse.json({ erro: "Convidados inválidos." }, { status: 400 });
  }

  const resultados = await Promise.all(
    respostas.map((resposta) =>
      supabaseAdmin
        .from("convidados")
        .update({
          confirmado: resposta.confirmado,
          status_rsvp: resposta.status_rsvp,
        })
        .eq("convidado_id", resposta.convidado_id)
        .eq("convite_id", convite.convite_id)
    )
  );

  if (resultados.some((resultado) => resultado.error)) {
    return NextResponse.json({ erro: "Erro ao salvar convidados." }, { status: 500 });
  }

  const confirmaram = respostas.filter((item) => item.confirmado);
  const naoVao = respostas.filter((item) => !item.confirmado);

  const nomePorId = new Map(
    convidados.map((convidado) => [
      convidado.convidado_id,
      convidado.nome_exibicao,
    ])
  );

  const { count: totalConfirmados } = await supabaseAdmin
    .from("convidados")
    .select("convidado_id", { count: "exact", head: true })
    .eq("confirmado", true);

  const detalhes = [
    confirmaram.length
      ? `Confirmaram:\n${confirmaram
          .map((item) => `- ${nomePorId.get(item.convidado_id)}`)
          .join("\n")}`
      : "",
    naoVao.length
      ? `Não vão:\n${naoVao
          .map((item) => `- ${nomePorId.get(item.convidado_id)}`)
          .join("\n")}`
      : "",
    confirmaram.length && utilizaHotel !== null
      ? `Hotel:\n- ${utilizaHotel ? "Sim" : "Não"}`
      : "",
    confirmaram.length && utilizaTraslado !== null
      ? `Traslado:\n- ${utilizaTraslado ? "Sim" : "Não"}`
      : "",
    `Total confirmado até agora:\n${totalConfirmados ?? 0} ${
      totalConfirmados === 1 ? "pessoa" : "pessoas"
    }`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const { error: updateError } = await supabaseAdmin
    .from("convites")
    .update({
      status_convite: "rsvp_finalizado",
      rsvp_finalizado_em: new Date().toISOString(),
      detalhes_rsvp: detalhes,
      utiliza_hotel: confirmaram.length ? utilizaHotel : null,
      utiliza_traslado: confirmaram.length ? utilizaTraslado : null,
    })
    .eq("convite_id", convite.convite_id);

  if (updateError) {
    return NextResponse.json({ erro: "Erro ao finalizar convite." }, { status: 500 });
  }

  return NextResponse.json({ sucesso: true });
}