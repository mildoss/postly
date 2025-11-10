'use client';

import {FormTextarea} from "@/components/ui/FormTextarea";
import {useRouter} from "next/navigation";
import {FormEvent, useState} from "react";
import {FormButton} from "@/components/ui/FormButton";
import {supabase} from "@/lib/supabaseClient";

type Comment = {
  id: number;
  content: string;
  created_at: string;
  users: {
    username: string | null;
  } | null;
}

export const CommentSection = ({postId, initialCommentCount}: { postId: number, initialCommentCount: number }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentCount, setCommentCount] = useState(initialCommentCount);

  const fetchComments = async () => {
    setIsLoading(true);

    const {data} = await supabase
      .from('comments')
      .select(`
      id,
      content,
      created_at,
      users:user_id (username)
      `)
      .eq('post_id', postId)
      .order('created_at', {ascending: false})
      .returns<Comment[]>();

    if (data) {
      setComments(data as Comment[]);
    }
    setIsLoading(false);
  }

  const handleCommentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const {data: {user}} = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const {error} = await supabase
      .from('comments')
      .insert({
        content: newComment,
        post_id: postId,
        user_id: user.id
      });

    if (!error) {
      setNewComment('');
      setCommentCount(c => c + 1);
      await fetchComments();
    } else {
      console.error('Error adding comment:', error.message);
    }
  }

  const toggleComments = () => {
    setIsOpen(!isOpen);
    if (!isOpen && comments.length === 0) {
      fetchComments();
    }
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-700">
      <button
        onClick={toggleComments}
        className="text-blue-400 hover:text-blue-500 text-sm font-semibold cursor-pointer">
        {isOpen
          ? 'Hide Comments'
          : commentCount > 0
            ? `Show ${commentCount} Comments`
            : `Show Comments`
        }
      </button>
      {isOpen && (
        <div className="mt-4">
          <form onSubmit={handleCommentSubmit} className="grid grid-cols-[1fr_auto] gap-2 mb-2">
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
          <div className="space-y-3">
            {isLoading && <p>Loading comments</p>}
            {!isLoading && comments.length === 0 && <p className="text-sm text-gray-500">No comments yet.</p>}

            {comments.map(comment => (
              <div key={comment.id} className="bg-gray-700 p-3 rounded-lg">
                <span className="font-bold text-blue-300 text-sm">
                  @{comment.users?.username}
                </span>
                <p className="text-white text-sm mt-1">{comment.content}</p>
                <span className="text-gray-500 text-xs mt-2 block">
                  {new Date(comment.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
