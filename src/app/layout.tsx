import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";

const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sora",
});

export const metadata: Metadata = {
  title: "CRC Faróis - Especialistas em Faróis Automotivos",
  description:
    "Há mais de 30 anos oferecendo produtos de alta qualidade em faróis automotivos para todo o Brasil. Faróis, lanternas, pisca-piscas e acessórios automotivos.",
  keywords:
    "faróis automotivos, lanternas, pisca-piscas, refletores, lâmpadas automotivas, peças automotivas, São Bernardo do Campo",
  authors: [{ name: "CRC Faróis" }],
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      {
        rel: "icon",
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    title: "CRC Faróis - Especialistas em Faróis Automotivos",
    description:
      "Há mais de 30 anos oferecendo produtos de alta qualidade em faróis automotivos para todo o Brasil.",
    url: "https://crcfarois.ind.br",
    siteName: "CRC Faróis",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CRC Faróis - Especialistas em Faróis Automotivos",
    description:
      "Há mais de 30 anos oferecendo produtos de alta qualidade em faróis automotivos para todo o Brasil.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={sora.variable} suppressHydrationWarning>
      <body className={sora.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
