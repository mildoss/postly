import {createSupabaseServerClient} from "@/lib/supabaseServer";
import {notFound} from "next/navigation";
import {CreatePostForm} from "@/components/CreatePostForm";
import {PostWithReactions} from "@/lib/types";
import {PostsList} from "@/components/PostsList";
import Link from "next/link";
import Image from "next/image";
import {FollowButton} from "@/components/ui/FollowButton";

type ProfilePageProps = {
  params: {
    username: string;
  }
}

export const dynamic = 'force-dynamic';

export default async function ProfilePage({params}: ProfilePageProps) {
  const supabase = await createSupabaseServerClient();
  const resolvedParams = await (params as unknown as Promise<{ username: string }>);
  const username = resolvedParams.username;

  const {data: {user: currentUser}} = await supabase.auth.getUser();
  const {data: userProfile} = await supabase
    .from('users')
    .select('id, username, bio, avatar_url')
    .ilike('username', username)
    .single();

  if (!userProfile) {
    notFound();
  }

  const {data: posts} = await supabase
    .rpc('get_posts_with_reactions')
    .eq('user_id', userProfile.id)
    .eq('is_private', true)
    .returns<PostWithReactions[]>();


  const isOwnProfile = currentUser && currentUser.id === userProfile.id;
  const avatarLetter = userProfile.username?.charAt(0).toUpperCase();

  let isFollowing = false;
  let isFollowedBy = false;

  if (currentUser && !isOwnProfile) {
    const {data: follow1} = await supabase
      .from('followers')
      .select('id')
      .eq('user_id', userProfile.id)
      .eq('follower_id', currentUser.id)
      .single();
    isFollowing = !!follow1;

    const { data: follow2 } = await supabase
      .from('followers')
      .select('id')
      .eq('user_id', currentUser.id)
      .eq('follower_id', userProfile.id)
      .single();
    isFollowedBy = !!follow2;
  }

  return (
    <div className="flex flex-col item lg:grid lg:grid-cols-[20%_1fr] gap-2 min-h-screen bg-gray-900/80 p-2 text-white">
      <div
        className="border-b-2 border-b-gray-700 lg:border-b-0 lg:border-r-2 lg:border-r-gray-700 pb-2 lg:p-2 flex flex-col gap-2">
        <div
          className="w-48 lg:w-full text-4xl aspect-square rounded-full bg-blue-600 flex items-center justify-center self-center text-white font-bold flex-shrink-0 overflow-hidden">
          {userProfile.avatar_url ? (
            <div className="w-full h-full relative">
              <Image
                src={userProfile.avatar_url}
                alt={username || 'Avatar'}
                style={{objectFit: 'cover'}}
                fill
              />
            </div>
          ) : (
            avatarLetter
          )}
        </div>
        <div className="p-4 bg-gray-800 rounded-lg shadow-md flex flex-col gap-1">
          <h2 className="text-lg sm:text-2xl font-bold text-blue-400">@{userProfile.username}</h2>
          <p className="text-sm sm:text-base text-gray-300 italic wrap-break-word"><span className="font-bold">About me:</span> {userProfile.bio || 'No bio yet'}</p>
        </div>
        {isOwnProfile ? (
          <Link href="/settings/profile"
                className="text-center py-2 px-4 rounded font-semibold transition-all cursor-pointer bg-blue-600 text-gray-300 hover:bg-blue-700">
            Edit Profile
          </Link>
        ) : (
          <FollowButton targetUserId={userProfile.id} initialIsFollowing={isFollowing} initialIsFollowedBy={isFollowedBy}/>
        )}
      </div>
      <div className="flex flex-col w-full gap-2">
        {isOwnProfile && (
          <CreatePostForm isPrivatePost={true}/>
        )}
        <PostsList posts={posts as PostWithReactions[] | null} currentUser={currentUser}/>
      </div>
    </div>
  )
}