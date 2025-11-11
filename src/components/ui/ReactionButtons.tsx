'use client';

import {useState} from "react";
import {supabase} from "@/lib/supabaseClient";
import {useRouter} from "next/navigation";

type ReactionType = 'like' | 'dislike' | null;

type ReactionButtonsProps = {
  targetId: number;
  targetType: 'post' | 'comment';
  initialLikes: number;
  initialDislikes: number;
  initialUserReaction: ReactionType;
}

export const ReactionButtons = ({
  targetId,
  targetType,
  initialLikes,
  initialDislikes,
  initialUserReaction
}: ReactionButtonsProps) => {
  const router = useRouter();
  const [currentReaction, setCurrentReaction] = useState(initialUserReaction);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [dislikeCount, setDislikeCount] = useState(initialDislikes);
  const [isLoading, setIsLoading] = useState(false);


  const handleReaction = async (newReaction: 'like' | 'dislike') => {
    setIsLoading(true);

    const {data: {user}} = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    const currentReactionSnapshot = currentReaction;
    const newReactionSnapshot = newReaction === currentReactionSnapshot ? null : newReaction;

    if (newReaction === 'like') {
      if (currentReactionSnapshot === 'like') {
        setLikeCount(c => c - 1);
      } else if (currentReactionSnapshot === 'dislike') {
        setLikeCount(c => c + 1);
        setDislikeCount(c => c - 1);
      } else {
        setLikeCount(c => c + 1);
      }
    } else if (newReaction === 'dislike') {
      if (currentReactionSnapshot === 'dislike') {
        setDislikeCount(c => c - 1);
      } else if (currentReactionSnapshot === 'like') {
        setDislikeCount(c => c + 1);
        setLikeCount(c => c - 1);
      } else {
        setDislikeCount(c => c + 1);
      }
    }

    setCurrentReaction(newReactionSnapshot);

    const tableName = targetType === 'post' ? 'reactions' : 'comment_reactions';
    const idColumnName = targetType === 'post' ? 'post_id' : 'comment_id';

    if (newReactionSnapshot === null) {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .match({ [idColumnName]: targetId, user_id: user.id })

      if (error) {
        setCurrentReaction(currentReactionSnapshot);
        setLikeCount(initialLikes);
        setDislikeCount(initialDislikes);
        console.error('Error removing reaction:', error);
      }
    } else {
      const { error } = await supabase
        .from(tableName)
        .upsert({
          [idColumnName]: targetId,
          user_id: user.id,
          type: newReactionSnapshot
        }, {
          onConflict: `${idColumnName}, user_id`
        })

      if (error) {
        setCurrentReaction(currentReactionSnapshot);
        setLikeCount(initialLikes);
        setDislikeCount(initialDislikes);
        console.error('Error adding reaction:', error)
      }
    }
    setIsLoading(false);
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleReaction('like')}
        disabled={isLoading}
        className={`py-1 px-3 rounded font-semibold transition-all cursor-pointer flex items-center gap-2 ${
          currentReaction === 'like'
            ? 'bg-green-500 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <span>Like</span>
        <span className="text-sm min-w-[12px]">{likeCount}</span>
      </button>
      <button
        onClick={() => handleReaction('dislike')}
        disabled={isLoading}
        className={`py-1 px-3 rounded font-semibold transition-all cursor-pointer flex items-center gap-2 ${
          currentReaction === 'dislike'
            ? 'bg-red-500 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <span>Dislike</span>
        <span className="text-sm min-w-[12px]">{dislikeCount}</span>
      </button>
    </div>
  )
}