import { supabase } from "@/src/lib/supabase";

export default async function RSVPPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: convite } = await supabase
    .from("convites")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!convite) {
    return <main className="p-6">Convite não encontrado.</main>;
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <p className="text-sm uppercase tracking-[0.3em]">Eduardo & Juliana</p>
        <h1 className="mt-4 text-4xl font-semibold">{convite.nome_convite}</h1>
        <p className="mt-6 text-neutral-500">Confirme sua presença</p>
      </div>
    </main>
  );
}