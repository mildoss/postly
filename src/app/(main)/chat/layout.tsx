import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import { ChatListSidebar } from "@/components/chat/ChatListSidebar";
import { ReactNode } from "react";
import { Conversation } from "@/lib/types";

export const dynamic = 'force-dynamic';

export default async function ChatLayout({ children }: { children: ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data, error } = await supabase
    .rpc('get_my_conversations')
    .returns<Conversation[]>();

  if (error) {
    console.error(error);
  }

  const chatList: Conversation[] = Array.isArray(data) ? data : [];

  return (
    <div className="flex lg:grid lg:grid-cols-[20%_1fr] h-[calc(100vh-4rem)] bg-background text-foreground">
      <aside className="hidden lg:block border-x border-border overflow-y-auto bg-card">
        <ChatListSidebar conversations={chatList} />
      </aside>
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  );
}