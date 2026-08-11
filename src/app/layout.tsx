import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Anek_Kannada, DM_Mono, Karla } from "next/font/google";
import "./globals.css";

const anekKannada = Anek_Kannada({
  subsets: ["kannada", "latin"],
  weight: ["400", "600", "800"],
  variable: "--font-anek-kannada",
  display: "swap",
});

const karla = Karla({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-karla",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Namma — ನಮ್ಮ ಸಲೂನ್",
  description:
    "90s Kannada film songs, the ones that played in every Karnataka saloon.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${anekKannada.variable} ${karla.variable} ${dmMono.variable}`}
    >
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
