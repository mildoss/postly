export type PostWithReactions = {
  id: number;
  content: string;
  created_at: string;
  user_id: string;
  username: string | null;
  like_count: number;
  dislike_count: number;
  user_reaction: 'like' | 'dislike' | null;
}