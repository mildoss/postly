import {PostWithReactions} from "@/lib/types";
import {ReactionButtons} from "@/components/ui/ReactionButtons";
import {CommentSection} from "@/components/CommentSection";
import Image from "next/image";
import Link from "next/link";

export const PostCard = ({post}: { post: PostWithReactions }) => {
  const username = post.username;
  const postDate = new Date(post.created_at).toLocaleString();
  const avatarLetter = username?.charAt(0).toUpperCase();

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700">
      <Link href={`/${username}`} className="inline-flex items-center mb-2 gap-2">
        <div
          className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden">
          {post.avatar_url ? (
            <div className="w-full h-full relative">
              <Image
                src={post.avatar_url}
                alt={username || 'Avatar'}
                style={{objectFit: 'cover'}}
                fill
              />
            </div>
          ) : (
            avatarLetter
          )}
        </div>
        <span className="text-blue-400 font-bold">
          @{username}
        </span>
      </Link>
      <p className="text-white mb-3 wrap-break-word">{post.content}</p>
      {post.media_url && (
        <div className="my-3 rounded-lg overflow-hidden border border-gray-700 w-64 h-64">
          <Image
            src={post.media_url}
            alt="Post media"
            width={256}
            height={256}
          />
        </div>
      )}
      <div className="flex justify-between items-center">
        <span className="text-gray-500 text-sm">
          {postDate}
        </span>
        <div>
          <ReactionButtons
            targetId={post.id}
            targetType="post"
            initialLikes={post.like_count}
            initialDislikes={post.dislike_count}
            initialUserReaction={post.user_reaction}
          />
        </div>
      </div>
      <CommentSection postId={post.id} initialCommentCount={post.comment_count}/>
    </div>
  )
}