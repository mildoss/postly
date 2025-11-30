import {SettingsForm} from "@/components/profile/SettingsForm";
import {createSupabaseServerClient} from "@/lib/supabaseServer";
import {redirect} from "next/navigation";
import {LogoutButton} from "@/components/auth/LogoutButton";

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
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-4rem)] gap-6">
      <SettingsForm user={user} profile={profile}/>
      <div className="w-full max-w-sm px-4">
        <LogoutButton/>
      </div>
    </div>
  )
}