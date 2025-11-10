import {createSupabaseServerClient} from '@/lib/supabaseServer'
import {CreatePostForm} from "@/components/CreatePostForm";
import {PostsList} from "@/components/PostsList";
import {PostWithReactions} from "@/lib/types";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const {data: {user}} = await supabase.auth.getUser();

  const { data: posts, error } = await supabase
    .rpc('get_posts_with_reactions')

  if (error) {
    console.error('Error fetching posts:', error.message);
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900/80 text-white p-2 gap-2">
      {user && (
        <div className="flex flex-col w-full gap-2">
          <h1 className="text-center text-2xl font-bold">Type something</h1>
          <CreatePostForm/>
        </div>
      )}
      <PostsList posts={posts as PostWithReactions[] | null}/>
    </div>
  )
}