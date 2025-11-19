'use client'

import {FormEvent, useState} from "react";
import {FormButton} from "@/components/ui/FormButton";
import {supabase} from "@/lib/supabaseClient";

export const ChatInput = ({conversationId, currentUserId}: { conversationId: number, currentUserId: string }) => {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsLoading(true);

    const { error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: currentUserId,
        content: text.trim()
      });

    if (error) {
      console.error('Error sending message:', error);
    } else {
      setText('');
    }
    setIsLoading(false);
  }

  return (
    <form onSubmit={handleSend} className="shrink-0 flex items-center flex gap-2 p-4 border-t border-gray-700 bg-gray-800">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
        disabled={isLoading}
      />
      <div className="w-24">
        <FormButton type="submit" disabled={isLoading || !text.trim()}>
          Send
        </FormButton>
      </div>
    </form>
  )
}