import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabaseAdmin";

export async function POST(request: Request) {
  const { slug } = await request.json();

  if (typeof slug !== "string" || !slug.trim()) {
    return NextResponse.json({ erro: "Convite inválido." }, { status: 400 });
  }

  const { data: convite, error: conviteError } = await supabaseAdmin
    .from("convites")
    .select(
      "convite_id, qr_code_id, nome_convite, status_convite, utiliza_hotel, utiliza_traslado"
    )
    .eq("slug", slug)
    .single();

  if (conviteError || !convite) {
    return NextResponse.json({ erro: "Convite não encontrado." }, { status: 404 });
  }

  const { data: convidados, error: convidadosError } = await supabaseAdmin
    .from("convidados")
    .select("convidado_id, nome_exibicao, status_rsvp, confirmado")
    .eq("convite_id", convite.convite_id)
    .order("nome_exibicao");

  if (convidadosError) {
    return NextResponse.json({ erro: "Erro ao carregar convidados." }, { status: 500 });
  }

  return NextResponse.json({
    convite: {
      qrCodeId: convite.qr_code_id,
      nomeConvite: convite.nome_convite,
      convidados: convidados ?? [],
      jaFinalizado: convite.status_convite === "rsvp_finalizado",
      utilizaHotel: convite.utiliza_hotel,
      utilizaTraslado: convite.utiliza_traslado,
    },
  });
}