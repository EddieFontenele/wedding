import Link from "next/link";

export function WeddingMenu({ slug }: { slug: string }) {
  const links = [
    { href: `/rsvp/${slug}`, label: "Início" },
    { href: `/rsvp/${slug}/local`, label: "Local" },
    { href: `/rsvp/${slug}/cronograma`, label: "Cronograma" },
    { href: `/rsvp/${slug}/manual`, label: "Manual" },
    { href: `/rsvp/${slug}/hospedagem`, label: "Hospedagem" },
  ];

  return (
    <nav className="mb-10 flex flex-wrap justify-center gap-3 text-sm text-neutral-400">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="rounded-full border border-white/10 px-4 py-2 transition-colors hover:border-white/40 hover:text-white"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}