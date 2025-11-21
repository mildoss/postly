import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import {Navbar} from "@/components/Navbar";
import {createSupabaseServerClient} from "@/lib/supabaseServer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Postly - Mini Social Network",
  description: "Share posts, like, comment and chat in real time",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  let username: null = null;
  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('username')
      .eq('id', user.id)
      .single();
    username = profile?.username || null;
  }

  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen flex flex-col bg-gray-900 text-white" suppressHydrationWarning>
      <Navbar username={username} />
          <main className="flex-1 pt-0 pb-16 lg:pt-16 lg:pb-0 container mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
