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
  title: "The Digital Chronograph — How We Learned to See",
  description:
    "Three decades. Three Porsches. Three design revolutions. A design essay mapping the parallel evolution of automotive and digital interface design.",
  keywords: [
    "design essay",
    "Porsche",
    "skeuomorphism",
    "minimalism",
    "digital design",
    "chronograph",
  ],
  openGraph: {
    title: "The Digital Chronograph",
    description:
      "Three decades. Three Porsches. Three design revolutions. The way Stuttgart sculpted metal is the same way we learned to sculpt pixels.",
    images: ["/images/taycan-cockpit.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Digital Chronograph",
    description:
      "A design essay mapping the parallel evolution of Porsche engineering and digital interface design.",
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
