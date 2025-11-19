import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { notFound } from "next/navigation";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { Message } from "@/lib/types";

export const dynamic = 'force-dynamic';

type ChatPageProps = {
  params: {
    id: string;
  }
}

type ChatPartner = {
  username: string;
  avatar_url: string | null;
}

export default async function ChatRoomPage({ params }: ChatPageProps) {
  const supabase = await createSupabaseServerClient();
  const resolvedParams = await (params as unknown as Promise<{ id: string }>);
  const id = resolvedParams.id;

  const { data: { user } } = await supabase.auth.getUser();

  const conversationId = parseInt(id);

  if (isNaN(conversationId)) {
    notFound();
  }

  const { data: membership } = await supabase
    .from('conversation_participants')
    .select('id')
    .eq('conversation_id', conversationId)
    .eq('user_id', user!.id)
    .single();

  if (!membership) {
    notFound();
  }

  const {data: partnerData} = await supabase
    .from('conversation_participants')
    .select(`
      users (
        username,
        avatar_url
      )
    `)
    .eq('conversation_id', conversationId)
    .neq('user_id', user!.id)
    .single();

  const chatPartner: ChatPartner = partnerData?.users
    ? (partnerData.users as unknown as ChatPartner)
    : { username: 'Unknown', avatar_url: null };

  const { data: messagesData } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })
    .limit(50);

  const messages = messagesData ? (messagesData as Message[]).reverse() : [];

  return (
    <ChatWindow
      key={conversationId}
      conversationId={conversationId}
      currentUser={user!}
      initialMessages={messages}
      chatPartner={chatPartner}
    />
  )
}