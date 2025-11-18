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
  avatar_url: string | null;
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
  avatar_url: string | null;
}

export type UserProfile = {
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
}

export type Friend = {
  id: string;
  username: string;
  avatar_url: string | null;
}

export type Conversation = {
  id: number;
  other_user_id: string;
  other_username: string;
  other_avatar_url: string | null;
  last_message: string | null;
  last_message_at: string | null;
}