import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabaseAdmin";

export async function POST(request: Request) {
  const body = await request.json();

  if (body.acao === "buscar") {
    const codigo = String(body.codigo ?? "").trim();

    const { data: convite } = await supabaseAdmin
      .from("convites")
      .select("convite_id, nome_convite, qr_code_id")
      .eq("qr_code_id", codigo)
      .single();

    if (!convite) {
      return NextResponse.json(
        { erro: "Convite não encontrado." },
        { status: 404 }
      );
    }

    const { data: convidados, error } = await supabaseAdmin
      .from("convidados")
      .select("convidado_id, nome_exibicao, confirmado, checkin_em")
      .eq("convite_id", convite.convite_id)
      .order("nome_exibicao");

    if (error) {
      return NextResponse.json(
        { erro: "Erro ao carregar convidados." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      convite,
      convidados: convidados ?? [],
    });
  }

  if (body.acao === "confirmar") {
    const convidadoId = String(body.convidadoId ?? "");

    const { data: convidado } = await supabaseAdmin
      .from("convidados")
      .select("confirmado, checkin_em")
      .eq("convidado_id", convidadoId)
      .single();

    if (!convidado || convidado.confirmado !== true) {
      return NextResponse.json(
        { erro: "Entrada não autorizada." },
        { status: 403 }
      );
    }

    if (convidado.checkin_em) {
      return NextResponse.json({
        checkin_em: convidado.checkin_em,
      });
    }

    const agora = new Date().toISOString();

    const { error } = await supabaseAdmin
      .from("convidados")
      .update({ checkin_em: agora })
      .eq("convidado_id", convidadoId);

    if (error) {
      return NextResponse.json(
        { erro: "Erro ao confirmar entrada." },
        { status: 500 }
      );
    }

    return NextResponse.json({ checkin_em: agora });
  }

  return NextResponse.json({ erro: "Ação inválida." }, { status: 400 });
}