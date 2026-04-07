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
  title: "The Digital Chronograph — A Design Essay",
  description:
    "A visual argument tracing the shared lineage of Porsche cockpit design and digital interfaces, from textured skeuomorphism through flat minimalism to the brutalist present.",
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
      "From the 996's chrome gauge cluster to the Taycan's glass cockpit — how automotive interiors and screen design evolved in parallel, told through scroll-driven animation.",
    images: ["/images/taycan-cockpit.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Digital Chronograph",
    description:
      "A scroll-driven essay on Porsche engineering and digital interface design, spanning 2000 to the present.",
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
