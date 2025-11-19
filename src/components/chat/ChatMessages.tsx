import {MessageBubble} from "@/components/chat/MessageBubble";
import {forwardRef} from "react";
import {User} from "@supabase/auth-js";
import {Message} from "@/lib/types";

type ChatMessagesProps = {
  messages: Message[];
  currentUser: User;
}

export const ChatMessages = forwardRef<HTMLDivElement, ChatMessagesProps>(
  ({messages, currentUser}, ref) => {

    return (
      <div
        ref={ref}
        className="flex-1 overflow-y-auto p-4 space-y-2 overscroll-contain"
      >
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">No messages yet. Say hi!</p>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.sender_id === currentUser.id}
            />
          ))
        )}
      </div>
    )
  }
);

ChatMessages.displayName = 'ChatMessages';