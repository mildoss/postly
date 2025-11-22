import {Friend} from "@/lib/types";
import Link from "next/link";
import {Avatar} from "@/components/ui/Avatar";

export const FriendCard = ({friend}: {friend: Friend}) => {

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700 flex items items-center justify-between">
      <Link href={`/${friend.username}`} className="flex items-center gap-3">
        <Avatar
          src={friend.avatar_url}
          alt={friend.username}
          fallback={friend.username}
          className="w-12 h-12"
        />
        <span className="text-blue-400 font-bold text-lg">
          @{friend.username}
        </span>
      </Link>
    </div>
  )
}