import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/smooth-scroll/SmoothScrollProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://digital-chronograph.vercel.app"),
  title: "The Digital Chronograph — Immersive Evolution Studio",
  description:
    "A chronological archive mapping the evolution of design through Porsche engineering, Brutalist architecture, and the shifting language of the digital interface. 2000–Present.",
  keywords: [
    "design evolution",
    "Porsche",
    "Brutalism",
    "web design",
    "studio",
    "chronograph",
  ],
  openGraph: {
    title: "The Digital Chronograph",
    description:
      "A chronological archive mapping the evolution of design through Porsche engineering, Brutalist architecture, and the shifting language of the digital interface.",
    images: ["/images/taycan-cockpit.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Digital Chronograph",
    description:
      "A chronological archive mapping the evolution of design through Porsche engineering, Brutalist architecture, and the shifting language of the digital interface.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${spaceMono.variable} antialiased bg-background text-foreground`}
      >
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
