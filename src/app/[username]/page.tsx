import {createSupabaseServerClient} from "@/lib/supabaseServer";
import {notFound} from "next/navigation";
import {CreatePostForm} from "@/components/posts/CreatePostForm";
import {Friend, PostWithReactions} from "@/lib/types";
import {PostsList} from "@/components/posts/PostsList";
import Link from "next/link";
import {FollowButton} from "@/components/profile/FollowButton";
import {FriendsPreview} from "@/components/profile/FriendsPreview";
import {StartChatButton} from "@/components/profile/StartChatButton";
import {Avatar} from "@/components/ui/Avatar";

type ProfilePageProps = {
  params: Promise<{
    username: string;
  }>
}

export const dynamic = 'force-dynamic';

export default async function ProfilePage({params}: ProfilePageProps) {
  const supabase = await createSupabaseServerClient();
  const { username } = await params;

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

  const {data: friendsData} = await supabase
    .rpc('get_friends_preview', {p_user_id: userProfile.id})
    .returns<Array<{id: string, username: string, avatar_url: string | null}>>();

  const friends: Friend[] = Array.isArray(friendsData) ? friendsData : [];

  return (
    <div className="flex flex-col item lg:grid lg:grid-cols-[20%_1fr] gap-2 min-h-[calc(100vh-4rem)] bg-background p-2 text-foreground">
      <div
        className="border-b-2 border-border lg:border-b-0 lg:border-x-2 lg:border-border pb-2 lg:p-2 flex flex-col gap-2">
        <Avatar
          src={userProfile.avatar_url}
          alt={username}
          fallback={userProfile.username}
          className="w-48 lg:w-full aspect-square text-4xl self-center"
        />
        <div className="p-4 bg-card rounded-lg shadow-md flex flex-col gap-1">
          <h2 className="text-lg sm:text-2xl font-bold text-primary">@{userProfile.username}</h2>
          <p className="text-sm sm:text-base text-muted-foreground italic wrap-break-word"><span className="font-bold">About me:</span> {userProfile.bio || 'No bio yet'}</p>
        </div>
        {isOwnProfile ? (
          <Link href="/settings/profile"
                className="text-center py-2 px-4 rounded font-semibold transition-all cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90">
            Edit Profile
          </Link>
        ) : (
          <div className="flex flex-col gap-2">
            <FollowButton targetUserId={userProfile.id} initialIsFollowing={isFollowing} initialIsFollowedBy={isFollowedBy}/>
            <StartChatButton targetUserId={userProfile.id} />
          </div>
        )}
        <FriendsPreview username={userProfile.username} friends={friends}/>
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