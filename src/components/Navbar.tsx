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

  const isProfileActive = username
    ? pathname === profileLink
    : (pathname === '/login' || pathname === '/signup');

  return (
    <>
      <header
        className="hidden lg:flex fixed top-0 left-0 w-full z-50 bg-background backdrop-blur-md border-b border-border">
        <div className="w-full max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-foreground tracking-wider hover:text-primary transition-colors">
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
              <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{username || 'Guest'}</p>
            </div>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isProfileActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground group-hover:bg-muted/80'}`}>
              <UserIcon className="w-5 h-5"/>
            </div>
          </Link>
        </div>
      </header>
      <nav
        className={`${isChatOpen ? 'hidden ' : ''}lg:hidden fixed bottom-0 left-0 w-full z-50 bg-background/95 backdrop-blur-md border-t border-border pb-safe`}>
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
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${active ? 'text-primary bg-muted' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
      <div className={active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}>
        {icon}
      </div>
      <span className="font-medium">{text}</span>
    </Link>
  )
}

const MobileNavLink = ({ href, active, icon }: { href: string, active: boolean, icon: ReactNode }) => (
  <Link href={href} className={`flex flex-col items-center justify-center w-full h-full transition-colors ${active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
    <div className="transform transition-transform active:scale-90">
      {icon}
    </div>
  </Link>
);