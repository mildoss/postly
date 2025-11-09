export type PostWithAuthor = {
  id: number;
  content: string;
  created_at: string;
  users: {
    username: string | null;
  } | null;
}