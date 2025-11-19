'use client'

import {useRouter} from "next/navigation";
import {useState} from "react";
import {supabase} from "@/lib/supabaseClient";

export const StartChatButton = ({targetUserId}: {targetUserId: string}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartChat = async () => {
    setIsLoading(true);

    const {data: {user}} = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const { data: conversationId, error } = await supabase
      .rpc('get_or_create_conversation', { other_user_id: targetUserId });

    if (error) {
      console.error('Error starting chat:', error);
      setIsLoading(false);
      return;
    }

    router.push(`/chat/${conversationId}`);
  }
  return (
    <button
      onClick={handleStartChat}
      disabled={isLoading}
      className="py-2 px-4 rounded font-semibold transition-all cursor-pointer bg-green-600 text-white hover:bg-green-700"
    >
      {isLoading ? '...' : 'Message'}
    </button>
  )
}