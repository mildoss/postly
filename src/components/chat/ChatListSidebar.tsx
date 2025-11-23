'use client'

import { Conversation } from "@/lib/types";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Avatar} from "@/components/ui/Avatar";

export const ChatListSidebar = ({ conversations }: { conversations: Conversation[] }) => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-2 w-full p-4">
      <h2 className="text-xl font-bold mb-3 text-center">Chats</h2>
      {conversations.length === 0 ? (
        <p className="text-muted-foreground text-sm">No chats yet.</p>
      ) : (
        conversations.map((chat) => {
          const isActive = pathname === `/chat/${chat.id}`;
          return (
            <Link
              key={chat.id}
              href={`/chat/${chat.id}`}
              className={`flex items-center gap-3 p-2 rounded-lg transition-colors 
               ${isActive
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-muted text-card-foreground' 
              }`}
            >
              <Avatar
                src={chat.other_avatar_url}
                alt={chat.other_username}
                fallback={chat.other_username}
                className="w-12 h-12"
              />
              <div className="flex-1 min-w-0">
                <h3 className={`font-bold text-sm truncate ${isActive ? 'text-primary-foreground' : 'text-primary'}`}>
                  @{chat.other_username}
                </h3>
                <p className={`text-xs truncate ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                  {chat.last_message || 'No messages yet'}
                </p>
              </div>
            </Link>
          )
        })
      )}
    </div>
  );
};