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
        <p className="text-gray-500 text-sm">No chats yet.</p>
      ) : (
        conversations.map((chat) => (
          <Link
            key={chat.id}
            href={`/chat/${chat.id}`}
            className={`flex items-center gap-3 p-2 rounded-lg transition-colors 
             ${pathname === `/chat/${chat.id}` ? 'bg-blue-600' : 'hover:bg-gray-700 bg-gray-900'}`}
          >
            <Avatar
              src={chat.other_avatar_url}
              alt={chat.other_username}
              fallback={chat.other_username}
              className="w-12 h-12"
            />
            <div className="flex-1 min-w-0">
              <h3 className={`font-bold text-sm truncate ${pathname === `/chat/${chat.id}` ? 'text-white' : 'text-blue-400'}`}>
                @{chat.other_username}
              </h3>
              <p className="text-xs truncate text-gray-300">
                {chat.last_message || 'No messages yet'}
              </p>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};