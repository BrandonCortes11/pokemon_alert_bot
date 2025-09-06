import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Pokemon Alert Bot - Stock & Restock Notifications",
  description: "Never miss another Pokemon card restock! Get instant alerts for Pokemon Center, Best Buy, Walmart, Target, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}