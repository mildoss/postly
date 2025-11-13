export type PostWithReactions = {
  id: number;
  content: string;
  created_at: string;
  user_id: string;
  username: string | null;
  like_count: number;
  dislike_count: number;
  user_reaction: 'like' | 'dislike' | null;
  comment_count: number;
  media_url: string | null;
  is_private: boolean;
}

export type Comment = {
  id: number;
  content: string;
  created_at: string;
  user_id: string;
  username: string;
  like_count: number;
  dislike_count: number;
  user_reaction: 'like' | 'dislike' | null;
}