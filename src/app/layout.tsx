import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Anek_Kannada, DM_Mono, Karla } from "next/font/google";
import { JsonLd } from "@/components/JsonLd";
import {
  CREATOR,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/seo";
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: SITE_KEYWORDS,
  authors: [{ name: CREATOR.name, url: CREATOR.url }],
  creator: `${CREATOR.name} — ${CREATOR.url}`,
  publisher: CREATOR.name,
  category: "music",
  classification: "Entertainment",
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Karnataka, India",
    author: `${CREATOR.name}, ${CREATOR.url}`,
    "article:author": CREATOR.url,
  },
  referrer: "strict-origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-IN": SITE_URL,
      "kn-IN": SITE_URL,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_IN",
    alternateLocale: ["kn_IN"],
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 1200,
        alt: "ನಮ್ಮ ಸಲೂನ್ — Namma Saloon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og.png"],
    creator: CREATOR.name,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1a1410" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1410" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${anekKannada.variable} ${karla.variable} ${dmMono.variable}`}
    >
      <body>
        <JsonLd />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
