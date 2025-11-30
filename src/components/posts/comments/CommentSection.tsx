'use client';

import {FormTextarea} from "@/components/ui/FormTextarea";
import {useRouter} from "next/navigation";
import {FormEvent, useState} from "react";
import {FormButton} from "@/components/ui/FormButton";
import {Comment} from "@/components/posts/comments/Comment";
import {supabase} from "@/lib/supabaseClient";
import {User} from "@supabase/auth-js";
import {Comment as CommentType} from "@/lib/types";

export const CommentSection = ({postId, initialCommentCount, currentUser}: { postId: number, initialCommentCount: number, currentUser: User | null }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentCount, setCommentCount] = useState(initialCommentCount);
  const [hasMore, setHasMore] = useState(initialCommentCount > 0);

  const loadComments = async (isInitialLoad: boolean = false) => {
    if (isLoading || (!hasMore && !isInitialLoad)) return;

    setIsLoading(true);
    const lastComment = !isInitialLoad && comments.length > 0 ? comments[comments.length - 1] : null;
    const lastCreatedAt = lastComment ? lastComment.created_at : null;

    const {data, error} = await supabase
      .rpc('get_comments_with_reactions', {
        p_post_id: postId,
        p_last_created_at: lastCreatedAt,
        p_limit: 5
      })
      .returns<CommentType[]>();

    if (error) {
      console.error('Error fetching comments:', error.message);
    }

    if (data && Array.isArray(data)) {

      if (data.length < 5) {
        setHasMore(false);
      }

      if (isInitialLoad) {
        setComments(data);
      } else {
        setComments(prev => {
          const newUnique = data.filter(n => !prev.some(p => p.id === n.id));
          return [...prev, ...newUnique];
        });
      }
    }
    setIsLoading(false);
  }

  const handleCommentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      router.push('/login');
      return;
    }

    const {error} = await supabase
      .from('comments')
      .insert({
        content: newComment,
        post_id: postId,
        user_id: currentUser.id
      });

    if (!error) {
      setNewComment('');
      setCommentCount(c => c + 1);
      setHasMore(true);
      await loadComments(true);
    } else {
      console.error('Error adding comment:', error.message);
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    const confirmed = window.confirm('Delete comment?');
    if (!confirmed) return;

    setComments(currentComments => currentComments.filter(c => c.id !== commentId));
    setCommentCount(count => count - 1);

    const {error} = await supabase
      .from('comments')
      .delete()
      .match({id: commentId})

    if (error) {
      console.error('Error deleting comment:', error.message);
      await loadComments();
    }
  }

  const toggleComments = () => {
    setIsOpen(!isOpen);
    if (!isOpen && comments.length === 0) {
      setHasMore(true);
      loadComments(true);
    }
  }

  return (
    <div className="mt-4 pt-4 border-t border-border">
      <button
        onClick={toggleComments}
        className="text-primary hover:text-primary/80 text-sm font-semibold cursor-pointer">
        {isOpen ? 'Hide Comments' : commentCount > 0 ? `Show ${commentCount} Comments` : 'Show Comments'}
      </button>
      {isOpen && (
        <div className="mt-4">
          {currentUser && (
            <form onSubmit={handleCommentSubmit} className="grid grid-cols-[1fr_auto] gap-2 mb-3">
              <FormTextarea
                id={`comment-form-${postId}`}
                value={newComment}
                onChangeAction={(e) => setNewComment(e.target.value)}
                rows={1}
                placeholder="Write a comment..."
                maxLength={256}
              />
              <FormButton type="submit" disabled={isLoading}>
                Send
              </FormButton>
            </form>
          )}
          <div className="space-y-3">
            {isLoading && <p className="text-sm text-muted-foreground">Loading comments</p>}
            {!isLoading && comments.length === 0 && <p className="text-sm text-muted-foreground">No comments yet.</p>}

            {comments.map(comment => (
              <Comment key={comment.id} comment={comment} currentUser={currentUser} onDelete={handleDeleteComment}/>
            ))}

            {!isLoading && hasMore && comments.length > 0 && (
              <button
                onClick={() => loadComments(false)}
                className="text-xs text-blue-400 hover:text-blue-500 w-full text-left mt-2 pl-1"
              >
                Load more comments...
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
