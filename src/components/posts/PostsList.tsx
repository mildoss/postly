import {PostCard} from "@/components/posts/PostCard";
import {PostWithReactions} from "@/lib/types";
import {User} from "@supabase/auth-js";


export const PostsList = ({posts, currentUser}: { posts: PostWithReactions[] | null , currentUser: User | null}) => {

  if (!posts || posts.length === 0) {
    return <p className="text-gray-400 text-center">No posts available.</p>;
  }

  return (
    <ul className="w-full flex flex-col gap-2">
      {posts?.map((p) => (
        <li key={p.id}>
          <PostCard post={p} currentUser={currentUser}/>
        </li>
      ))}
    </ul>
  )
}