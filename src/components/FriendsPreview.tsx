import Image from "next/image";
import Link from "next/link";
import {Friend} from "@/lib/types";

export const FriendsPreview = ({friends}: { friends: Friend[] }) => {

  if (friends.length === 0) {
    return null;
  }

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-md mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Friends ({friends.length})</h3>
        <Link href="#" className="text-sm text-blue-400 hover:text-blue-500">
          Show All
        </Link>
      </div>
      <div className="grid grid-cols-3 place-items-center gap-2">
        {friends.map((friend) => (
          <Link key={friend.id} href={`/${friend.username}`}
                className="flex flex-col items-center justify-center gap-2 w-full h-28">
            <div
              className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden">
              {friend.avatar_url ? (
                <div className="w-full h-full relative">
                  <Image
                    src={friend.avatar_url}
                    alt={friend.username || 'Avatar'}
                    style={{objectFit: 'cover'}}
                    fill
                  />
                </div>
              ) : (
                friend.username?.charAt(0).toUpperCase()
              )}
            </div>
            <span className="text-blue-400 font-bold text-center text-xs w-full truncate">
              @{friend.username}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}