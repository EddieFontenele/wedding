import { WeddingMenu } from "../WeddingMenu";

export default async function ManualPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const itens = [
    {
      titulo: "Dress code",
      texto: "O traje será black tie optional. Em caso de dúvida, prefira um visual social/elegante. Evite branco, off-white e tons muito claros reservados à noiva.",
    },
    {
      titulo: "Entrada com QR Code",
      texto: "Após confirmar presença, salve ou compartilhe seu QR Code. Ele será solicitado na entrada.",
    },
    {
      titulo: "Acompanhantes",
      texto: "Confirme apenas as pessoas listadas no seu convite. Caso tenha dúvida, fale com a Débora.",
    },
    {
      titulo: "Restrições alimentares",
      texto: "No RSVP, marque se alguma pessoa confirmada possui restrição alimentar ou alergia.",
    },
    {
      titulo: "Cerimônia sem celulares",
      texto: "Durante a cerimônia, pedimos que os celulares sejam guardados e mantidos no silencioso. Queremos que todos vivam esse momento com a gente, sem fotos ou vídeos.",
    },
    {
      titulo: "Mesa de doces",
      texto: "Pedimos que aguardem a liberação da mesa de doces antes de se servirem.",
    },
    {
      titulo: "Decoração",
      texto: "A decoração faz parte do evento e não deve ser levada para casa.",
    },
    {
      titulo: "Horário de chegada",
      texto: "Chegue com antecedência para evitar atrasos na cerimônia.",
    },
    {
      titulo: "Contato",
      texto: "Em caso de dúvidas, fale com a Débora.",
    },
  ];

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto w-full max-w-2xl py-10">
        <WeddingMenu slug={slug} />

        <p className="text-sm uppercase tracking-[0.3em] text-neutral-400">
          Eduardo & Juliana
        </p>

        <h1 className="mt-4 text-5xl font-semibold">Manual do convidado</h1>

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