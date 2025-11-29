import {createSupabaseServerClient} from '@/lib/supabaseServer'
import {CreatePostForm} from "@/components/posts/CreatePostForm";
import {PostsList} from "@/components/posts/PostsList";
import {PostWithReactions} from "@/lib/types";

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const {data: {user}} = await supabase.auth.getUser();

  const { data: posts } = await supabase
    .rpc('get_posts_with_reactions', {
      p_is_private: false,
      p_limit: 10
    });

  return (
    <div className="flex flex-col items-center min-h-screen p-2 gap-2">
      {user && (
        <div className="flex flex-col w-full gap-2">
          <CreatePostForm isPrivatePost={false}/>
        </div>
      )}
      <PostsList
        initialPosts={posts as PostWithReactions[] | null}
        currentUser={user}
        filterIsPrivate={false}
      />
    </div>
  )
}