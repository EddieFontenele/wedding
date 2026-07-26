import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabaseAdmin";

export async function POST(request: Request) {
  const { termo } = await request.json();

  if (typeof termo !== "string" || termo.trim().length < 2) {
    return NextResponse.json({ resultados: [] });
  }

  const { data, error } = await supabaseAdmin
    .from("convidados")
    .select("nome_exibicao, convites(slug, nome_convite)")
    .ilike("nome_exibicao", `%${termo.trim()}%`)
    .limit(8);

  if (error) {
    console.error("Erro ao pesquisar convidados:", error);
    return NextResponse.json(
      { erro: "Erro ao pesquisar convidados." },
      { status: 500 }
    );
  }

  const resultados = (data ?? [])
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
    new Map(resultados.map((item) => [item.slug, item])).values()
  );

  return NextResponse.json({ resultados: unicos });
}