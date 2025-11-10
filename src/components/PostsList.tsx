import {PostCard} from "@/components/ui/PostCard";
import {PostWithReactions} from "@/lib/types";


export const PostsList = ({posts}: { posts: PostWithReactions[] | null }) => {

  if (!posts || posts.length === 0) {
    return <p className="text-gray-400 text-center">No posts available.</p>;
  }

  return (
    <ul className="w-full flex flex-col gap-2">
      {posts?.map((p) => (
        <li key={p.id}>
          <PostCard post={p}/>
        </li>
      ))}
    </ul>
  )
}