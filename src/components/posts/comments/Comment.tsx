import {Comment as CommentType} from "@/lib/types";
import {User} from "@supabase/auth-js";
import {ReactionButtons} from "@/components/ui/ReactionButtons";
import Link from "next/link";
import {Avatar} from "@/components/ui/Avatar";
import {formatDate} from "@/lib/utils";

export const Comment = ({comment, currentUser, onDelete}: {
  comment: CommentType,
  currentUser: User | null,
  onDelete: (id: number) => void
}) => {
  const username = comment.username;

  return (
    <div key={comment.id} className="bg-gray-700 p-3 rounded-lg">
      <div className="flex justify-between mb-2">
        <Link href={`/${username}`} className="flex items-center gap-2">
          <Avatar
            src={comment.avatar_url}
            alt={comment.username}
            fallback={comment.username}
            className="w-8 h-8"
          />
          <span className="font-bold text-blue-300 text-sm">
          @{comment.username}
        </span>
        </Link>
        {currentUser && currentUser.id === comment.user_id && (
          <button
            onClick={() => onDelete(comment.id)}
            className="relative w-5 h-5 flex items-center justify-center group cursor-pointer"
          >
            <span
              className="absolute top-1/2 left-1/2 w-4 h-1 bg-gray-400 rotate-45 group-hover:bg-red-500 transition-colors -translate-x-1/2 -translate-y-1/2"></span>
            <span
              className="absolute top-1/2 left-1/2 w-4 h-1 bg-gray-400 -rotate-45 group-hover:bg-red-500 transition-colors -translate-x-1/2 -translate-y-1/2"></span>
          </button>
        )}
      </div>
      <p className="text-white text-sm mb-2 wrap-break-word">{comment.content}</p>
      <div className="flex justify-between items-center ">
      <span className="text-gray-500 text-xs mt-2 block">
        {formatDate(comment.created_at)}
      </span>
        <div>
          <ReactionButtons
            targetId={comment.id}
            targetType="comment"
            initialLikes={comment.like_count}
            initialDislikes={comment.dislike_count}
            initialUserReaction={comment.user_reaction}
          />
        </div>
      </div>
    </div>
  )
}