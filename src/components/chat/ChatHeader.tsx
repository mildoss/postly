import Link from "next/link";
import {Avatar} from "@/components/ui/Avatar";

export const ChatHeader = ({username, avatar_url}: { username: string, avatar_url: string | null }) => {
  return (
    <div className="shrink-0 flex gap-2 items-center justify-between p-4 border-b border-gray-700 bg-gray-800 relative">
      <Link href="/chat" className="text-xs sm:text-sm text-gray-400 hover:text-white z-10">← Back to chats</Link>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center min-w-0">
        <Link href={`/${username}`} className="text-sm sm:text-lg text-gray-400 truncate hover:text-blue-400 transition-colors">@{username}</Link>
      </div>
      <Link href={`/${username}`}>
        <Avatar
          src={avatar_url}
          alt={username}
          fallback={username}
          className="w-12 h-12"
        />
      </Link>
    </div>
  )
}