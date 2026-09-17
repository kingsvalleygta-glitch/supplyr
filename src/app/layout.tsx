import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import { CartProvider } from "@/components/CartProvider";
import { ProProvider } from "@/components/ProProvider";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Supplyr · Construction supplies by Kings Valley Homes",
    template: "%s · Supplyr",
  },
  description:
    "Trade construction supplies for Toronto and the GTA. Lumber, fasteners, concrete, electrical, plumbing, tools, and more — from Kings Valley Homes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-CA">
      <body
        className={`${inter.variable} ${archivo.variable} flex min-h-screen flex-col bg-background font-sans text-foreground antialiased`}
      >
        <CartProvider>
          <ProProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </ProProvider>
        </CartProvider>
      </body>
    </html>
  );
}
