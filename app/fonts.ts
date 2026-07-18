import { Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";

export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
});

export const cheyra = localFont({
  src: "../public/fonts/Cheyra.otf",
  variable: "--font-cheyra",
  display: "swap",
});