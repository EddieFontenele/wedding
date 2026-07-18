import { WeddingMenu } from "../WeddingMenu";

export default async function LocalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto w-full max-w-2xl py-10">
        <WeddingMenu slug={slug} />

        <p className="text-sm uppercase tracking-[0.3em] text-neutral-400">
          Eduardo & Juliana
        </p>

        <h1 className="mt-4 text-5xl font-semibold">O local</h1>

        <div className="mt-8 rounded-2xl border border-white/10 p-6">
        <h2 className="text-2xl font-medium">Chácara Veneza</h2>

        <p className="mt-4 text-neutral-400">
            O casamento acontece na Chácara Veneza, em Agudos/SP, com Bauru como principal referência para hospedagem, deslocamento e estrutura para convidados de fora.
        </p>

        <p className="mt-6 text-neutral-300">
            Endereço: R. Gonçalo Ribas Filho — Agudos, SP, 17120-000
        </p>

        <a
            href="https://maps.app.goo.gl/ynvqkA7dWBTNKD2N8"
            target="_blank"
            className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 font-medium text-black transition-all hover:bg-neutral-200 active:scale-[0.98]"
        >
            Abrir no mapa
        </a>
        </div>
      </div>
    </main>
  );
}