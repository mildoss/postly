'use client';

import Link from "next/link";
import {usePathname} from "next/navigation";
import {ChatIcon, HomeIcon, UserIcon, UsersIcon} from "@/components/ui/Icons";
import {ReactNode} from "react";

type NavbarProps = {
  username?: string | null;
}

export const Navbar = ({username}: NavbarProps) => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;
  const isChatOpen =  pathname.startsWith('/chat/');
  const profileLink = username ? `/${username}` : '/login';

  return (
    <>
      <header
        className="hidden lg:flex fixed top-0 left-0 w-full z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="w-full max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white tracking-wider hover:text-blue-400 transition-colors">
            POSTLY
          </Link>
          <nav className="flex gap-8">
            <NavLink href="/" active={isActive('/')} icon={<HomeIcon/>} text="Home"/>
            <NavLink href={username ? `/${username}/friends` : '/login'} active={isActive(`/${username}/friends`)}
                     icon={<UsersIcon/>} text="Friends"/>
            <NavLink href="/chat" active={pathname.startsWith('/chat')} icon={<ChatIcon/>} text="Chat"/>
          </nav>
          <Link href={profileLink} className="flex items-center gap-3 group">
            <div className="text-right hidden xl:block">
              <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{username || 'Guest'}</p>
            </div>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isActive(profileLink) ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 group-hover:bg-gray-700'}`}>
              <UserIcon className="w-5 h-5"/>
            </div>
          </Link>
        </div>
      </header>
      <nav
        className={`${isChatOpen ? 'hidden ' : ''}lg:hidden fixed bottom-0 left-0 w-full z-50 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 pb-safe`}>
        <div className="flex justify-around items-center h-16">
          <MobileNavLink href="/" active={isActive('/')} icon={<HomeIcon/>}/>
          <MobileNavLink href={username ? `/${username}/friends` : '/login'} active={isActive(`/${username}/friends`)}
                         icon={<UsersIcon/>}/>
          <MobileNavLink href="/chat" active={pathname.startsWith('/chat')} icon={<ChatIcon/>}/>
          <MobileNavLink href={profileLink} active={isActive(profileLink)} icon={<UserIcon className="w-6 h-6"/>}/>
        </div>
      </nav>
    </>
  )
}

const NavLink = ({href, active, icon, text}: { href: string, active: boolean, icon: ReactNode, text: string }) => {
  return (
    <Link href={href}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${active ? 'text-blue-500 bg-gray-800/50' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
      <div className={active ? 'text-blue-500' : 'text-gray-400 group-hover:text-white'}>
        {icon}
      </div>
      <span className="font-medium">{text}</span>
    </Link>
  )
}

const MobileNavLink = ({ href, active, icon }: { href: string, active: boolean, icon: ReactNode }) => (
  <Link href={href} className={`flex flex-col items-center justify-center w-full h-full transition-colors ${active ? 'text-blue-500' : 'text-gray-500 hover:text-gray-300'}`}>
    <div className="transform transition-transform active:scale-90">
      {icon}
    </div>
  </Link>
);