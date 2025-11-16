import {Friend} from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

export const FriendCard = ({friend}: {friend: Friend}) => {
  const avatarLetter = friend.username?.charAt(0).toUpperCase();

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700 flex items items-center justify-between">
      <Link href={`/${friend.username}`} className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden relative">
          {friend.avatar_url ? (
            <Image
              src={friend.avatar_url}
              alt={friend.username || 'Avatar'}
              style={{objectFit: 'cover'}}
              fill
            />
          ) : (
            avatarLetter
          )}
        </div>
        <span className="text-blue-400 font-bold text-lg">
          @{friend.username}
        </span>
      </Link>
    </div>
  )
}