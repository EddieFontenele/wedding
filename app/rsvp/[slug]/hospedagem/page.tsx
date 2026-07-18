import { WeddingMenu } from "../WeddingMenu";

export default async function HospedagemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const itens = [
    {
      titulo: "Hospedagem",
      texto: "Estamos usando Bauru como referência principal para hospedagem. Por enquanto, a sugestão inicial é o Blue Tree Bauru; em breve informaremos o hotel definitivo e um código promocional.",
    },
    {
      titulo: "Transporte",
      texto: "Para quem se hospedar no hotel indicado, a ideia é oferecermos transporte entre o hotel e o evento por nossa conta. Mais detalhes serão confirmados perto da data.",
    },
    {
      titulo: "Estacionamento",
      texto: "Em breve, informaremos se o local possui estacionamento próprio ou serviço de valet.",
    },
    {
      titulo: "Chegada",
      texto: "Planeje chegar com antecedência para evitar atrasos e aproveitar o evento com tranquilidade.",
    },
  ];

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto w-full max-w-2xl py-10">
        <WeddingMenu slug={slug} />

        <p className="text-sm uppercase tracking-[0.3em] text-neutral-400">
          Eduardo & Juliana
        </p>

        <h1 className="mt-4 text-5xl font-semibold">
          Hospedagem & transporte
        </h1>

        <div className="mt-8 space-y-3">
          {itens.map((item) => (
            <div key={item.titulo} className="rounded-2xl border border-white/10 p-5">
              <h2 className="text-xl font-medium">{item.titulo}</h2>
              <p className="mt-3 text-neutral-400">{item.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}