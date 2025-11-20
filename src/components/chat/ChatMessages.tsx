import {MessageBubble} from "@/components/chat/MessageBubble";
import {forwardRef, UIEvent} from "react";
import {User} from "@supabase/auth-js";
import {Message} from "@/lib/types";

type ChatMessagesProps = {
  messages: Message[];
  currentUser: User;
  onScroll?: (e: UIEvent<HTMLDivElement>) => void;
  isLoadingMore?: boolean;
  onDeleteMessage: (id: number) => void;
}

export const ChatMessages = forwardRef<HTMLDivElement, ChatMessagesProps>(
  ({messages, currentUser, onScroll, isLoadingMore, onDeleteMessage}, ref) => {

    return (
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto p-4 space-y-2 overscroll-contain"
      >
        {isLoadingMore && (
          <div className="text-center py-2 text-xs text-gray-400">
            Loading...
          </div>
        )}
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">No messages yet. Say hi!</p>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.sender_id === currentUser.id}
              onDelete={() => onDeleteMessage(msg.id)}
            />
          ))
        )}
      </div>
    )
  }
);

ChatMessages.displayName = 'ChatMessages';