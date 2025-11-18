import { ChatListSidebar } from "@/components/chat/ChatListSidebar";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export const dynamic = 'force-dynamic';

export default async function ChatPage() {
  const supabase = await createSupabaseServerClient();

  const { data: conversations } = await supabase.rpc('get_my_conversations');
  const chatList = conversations || [];

  return (
    <div className="w-full lg:hidden min-h-screen bg-gray-800">
      <ChatListSidebar conversations={chatList} />
    </div>
  );
}