import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import { CartProvider } from "@/components/cart-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PC Builder — Gaming PCs & Components",
    template: "%s | PC Builder",
  },
  description: "Shop processors, graphics cards, motherboards and everything you need to build your dream PC.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
