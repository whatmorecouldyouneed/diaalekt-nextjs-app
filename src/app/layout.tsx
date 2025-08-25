import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NewsletterForm from "@/components/NewsletterForm";
import { CartProvider } from "@/contexts/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Diaalekt Shop",
  description: "E-commerce site powered by Shopify and Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="p-4 bg-gray-800 text-white">
          <h1 className="text-2xl">Diaalekt Shop</h1>
          {/* Add nav links, cart icon, etc. */}
        </header>
        <CartProvider>{children}</CartProvider>
        <footer className="p-4 bg-gray-800 text-white">
          <NewsletterForm />
          <p>&copy; 2023 Diaalekt</p>
        </footer>
      </body>
    </html>
  );
}
