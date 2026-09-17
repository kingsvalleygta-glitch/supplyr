import type { Metadata } from "next";
import { CartProvider } from "@/components/CartProvider";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Supplyr · Construction supplies by Kings Valley Homes",
    template: "%s · Supplyr",
  },
  description:
    "B2B construction supplies for Toronto and the GTA. Lumber, fasteners, concrete, electrical, plumbing, tools, and more — from Kings Valley Homes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-CA">
      <body className="flex min-h-screen flex-col antialiased">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
