import {createSupabaseServerClient} from '@/lib/supabaseServer'
import {CreatePostForm} from "@/components/posts/CreatePostForm";
import {PostsList} from "@/components/posts/PostsList";
import {PostWithReactions} from "@/lib/types";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const {data: {user}} = await supabase.auth.getUser();

  const { data: posts, error } = await supabase
    .rpc('get_posts_with_reactions')
    .eq('is_private', false)

  if (error) {
    console.error('Error fetching posts:', error.message);
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-2 gap-2">
      {user && (
        <div className="flex flex-col w-full gap-2">
          <CreatePostForm isPrivatePost={false}/>
        </div>
      )}
      <PostsList posts={posts as PostWithReactions[] | null} currentUser={user}/>
    </div>
  )
}