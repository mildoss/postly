import {createSupabaseServerClient} from "@/lib/supabaseServer";
import {notFound} from "next/navigation";
import {Friend} from "@/lib/types";
import Link from "next/link";
import {FriendCard} from "@/components/ui/FriendCard";

type FriendsPageProps = {
  params: {
    username: string;
  }
}

export const dynamic = 'force-dynamic';

export default async function FriendsPage({params}: FriendsPageProps) {
  const supabase = await createSupabaseServerClient();
  const resolvedParams = await (params as unknown as Promise<{ username: string }>);
  const username = resolvedParams.username;

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
    <div className="w-full p-4 text-white space-y-8 bg-gray-900/80 min-h-screen">
      <div className="flex items-center gap-4">
        <Link href={`/${username}`} className="text-blue-400 hover:text-blue-500">
          Back to @{username}
        </Link>
      </div>
      <h1 className="text-3xl font-bold">Friends: ({friends.length})</h1>
      <div className="flex flex-col gap-4">
        {friends.length === 0 ? (
            <p className="text-gray-400">@{username} has no friends yet.</p>
        ) :
          (friends.map(friend => (
            <FriendCard key={friend.id} friend={friend}/>
          ))
        )}
      </div>
    </div>
  );
}