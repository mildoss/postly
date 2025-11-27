import {createSupabaseServerClient} from "@/lib/supabaseServer";
import {notFound} from "next/navigation";
import {Friend} from "@/lib/types";
import Link from "next/link";
import {FriendCard} from "@/components/profile/FriendCard";

type FriendsPageProps = {
  params: Promise<{
    username: string;
  }>
}

export const dynamic = 'force-dynamic';

export default async function FriendsPage({params}: FriendsPageProps) {
  const supabase = await createSupabaseServerClient();
  const { username } = await params;

  const {data: userProfile} = await supabase
    .from('users')
    .select('id, username')
    .ilike('username', username)
    .single();

  if (!userProfile) {
    notFound();
  }

  const {data: friendsData} = await supabase
    .rpc('get_all_friends', {p_user_id: userProfile.id})
    .returns<Friend[]>();

  const friends = Array.isArray(friendsData) ? friendsData : [];

  return (
    <div className="w-full p-4 space-y-8 min-h-[calc(100vh-4rem)]">
      <div className="flex items-center gap-4">
        <Link href={`/${username}`} className="text-primary hover:text-primary/80 transition-colors">
          Back to @{username}
        </Link>
      </div>
      <h1 className="text-3xl font-bold">Friends: ({friends.length})</h1>
      <div className="flex flex-col gap-4">
        {friends.length === 0 ? (
            <p className="text-muted-foreground">@{username} has no friends yet.</p>
        ) :
          (friends.map(friend => (
            <FriendCard key={friend.id} friend={friend}/>
          ))
        )}
      </div>
    </div>
  );
}