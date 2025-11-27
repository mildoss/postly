import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {ReactNode} from "react";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "Postly - Mini Social Network",
  description: "Share posts, like, comment and chat in real time",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {

  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-background text-foreground" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
