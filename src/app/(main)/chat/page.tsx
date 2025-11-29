import { ChatListSidebar } from "@/components/chat/ChatListSidebar";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export default async function ChatPage() {
  const supabase = await createSupabaseServerClient();

  const { data: conversations } = await supabase.rpc('get_my_conversations');
  const chatList = conversations || [];

  return (
    <>
      <div className="w-full lg:hidden min-h-screen">
        <ChatListSidebar conversations={chatList} />
      </div>
      <div className="hidden lg:flex flex-col items-center justify-center h-full w-full bg-card border-r border-border text-muted-foreground">
        <h2 className="text-2xl font-bold text-foreground mb-2">Your Messages</h2>
        <p className="text-sm max-w-xs text-center">
          Select a chat from the sidebar to start messaging or look for new friends.
        </p>
      </div>
    </>
  );
}