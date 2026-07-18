import type { Metadata } from "next";
import "./globals.css";
import "lenis/dist/lenis.css";
import { SmoothScroll } from "./SmoothScroll";
import { cheyra, instrumentSerif } from "./fonts";

export const metadata: Metadata = {
  title: "Eduardo & Juliana",
  description: "Casamento Eduardo e Juliana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${instrumentSerif.variable} ${cheyra.variable}`}>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}