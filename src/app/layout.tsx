import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Postly - Mini Social Network",
  description: "Share posts, like, comment and chat in real time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <main className="flex-1 container mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
