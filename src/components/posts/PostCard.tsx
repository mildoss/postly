import {PostWithReactions} from "@/lib/types";
import {ReactionButtons} from "@/components/ui/ReactionButtons";
import {CommentSection} from "@/components/posts/comments/CommentSection";
import Image from "next/image";
import Link from "next/link";
import {User} from "@supabase/auth-js";
import {Avatar} from "@/components/ui/Avatar";
import {formatDate} from "@/lib/utils";
import {DeleteButton} from "@/components/ui/DeleteButton";

export const PostCard = ({post, currentUser, onDelete }: {
  post: PostWithReactions,
  currentUser: User | null,
  onDelete: (id: number, mediaUrl: string | null) => void
}) => {
  const username = post.username;

  return (
    <div className="bg-card p-4 rounded-lg shadow border border-border text-card-foreground">
      <div className="flex justify-between">
      <Link href={`/${username}`} className="inline-flex items-center mb-2 gap-2">
        <Avatar
          src={post.avatar_url}
          alt={username}
          fallback={username ?? undefined}
        />
        <span className="text-primary font-bold">
          @{username}
        </span>
      </Link>
        {currentUser && currentUser.id === post.user_id &&
          <DeleteButton onDelete={() => onDelete(post.id, post.media_url) }/>
        }
      </div>
      <p className="mb-3 wrap-break-word">{post.content}</p>
      {post.media_url && (
        <div className="my-3 rounded-lg overflow-hidden border border-border w-64 h-64">
          <Image
            src={post.media_url}
            alt="Post media"
            width={256}
            height={256}
          />
        </div>
      )}
      <div className="flex justify-between items-center">
        <span className="text-muted-foreground text-sm">
          {formatDate(post.created_at)}
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
      <CommentSection postId={post.id} initialCommentCount={post.comment_count} currentUser={currentUser}/>
    </div>
  )
}