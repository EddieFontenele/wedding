import { CheckinForm } from "./CheckinForm";

export default function CheckinPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black p-6 text-white">
      <div className="w-full max-w-md">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-400">
          Eduardo & Juliana
        </p>
        <h1 className="mt-4 text-4xl font-semibold">Check-in</h1>
        <CheckinForm />
      </div>
    </main>
  );
}