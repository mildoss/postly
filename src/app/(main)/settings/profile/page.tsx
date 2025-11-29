import {SettingsForm} from "@/components/profile/SettingsForm";
import {createSupabaseServerClient} from "@/lib/supabaseServer";
import {redirect} from "next/navigation";

export default async function SettingPage() {
  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const {data: profile} = await supabase
    .from('users')
    .select('username, bio, avatar_url')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/setup');
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
      <SettingsForm user={user} profile={profile}/>
    </div>
  )
}