'use client'

import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import {LogoutIcon} from "@/components/ui/Icons";

export const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center justify-center gap-2 bg-destructive/10 hover:bg-destructive/20 text-destructive font-bold py-3 px-4 rounded-lg transition-all border border-destructive/20 cursor-pointer"
    >
      <LogoutIcon />
      <span>Log Out</span>
    </button>
  )
}
