import { ReactNode } from "react";
import {Navbar} from "@/components/Navbar";
import {createSupabaseServerClient} from "@/lib/supabaseServer";

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  let username: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('username')
      .eq('id', user.id)
      .single();
    username = profile?.username || null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar username={username} />
      <main className="flex-1 pt-0 pb-16 lg:pt-16 lg:pb-0 container mx-auto">
        {children}
      </main>
    </div>
  );
}