import { WeddingMenu } from "../WeddingMenu";

export default async function CronogramaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

    const eventos = [
    { hora: "17:00", titulo: "Recepção dos convidados" },
    { hora: "18:00", titulo: "Cerimônia" },
    { hora: "19:00", titulo: "Início da festa" },
    ];

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto w-full max-w-2xl py-10">
        <WeddingMenu slug={slug} />

        <p className="text-sm uppercase tracking-[0.3em] text-neutral-400">
          Eduardo & Juliana
        </p>

        <h1 className="mt-4 text-5xl font-semibold">Cronograma</h1>

        <div className="mt-8 space-y-3">
          {eventos.map((evento) => (
            <div
              key={evento.hora}
              className="flex items-center justify-between rounded-2xl border border-white/10 p-5"
            >
              <p className="text-neutral-400">{evento.hora}</p>
              <p className="font-medium">{evento.titulo}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}