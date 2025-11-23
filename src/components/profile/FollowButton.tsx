'use client'

import {useRouter} from "next/navigation";
import {useCallback, useEffect, useState} from "react";
import {supabase} from "@/lib/supabaseClient";

type FollowButtonProps = {
  targetUserId: string;
  initialIsFollowing: boolean;
  initialIsFollowedBy: boolean;
}

type FollowState = 'Follow' | 'Following' | 'Friend' | 'Follow Back';

export const FollowButton = ({
  targetUserId,
  initialIsFollowing,
  initialIsFollowedBy
}: FollowButtonProps) => {
  const router = useRouter();

  const getInitialState = useCallback((): FollowState => {
    if (initialIsFollowing && initialIsFollowedBy) return 'Friend';
    if (initialIsFollowing) return 'Following';
    if (initialIsFollowedBy) return 'Follow Back';
    return 'Follow';
  }, [initialIsFollowing, initialIsFollowedBy]);

  const [followState, setFollowState] = useState<FollowState>(getInitialState());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFollowState(getInitialState());
  }, [getInitialState]);

  const handleFollow = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const {data: {user}} = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    setFollowState(initialIsFollowedBy ? 'Friend' : 'Following');

    const {error} = await supabase
      .from('followers')
      .insert({
        user_id: targetUserId,
        follower_id: user.id
      });

    if (error) {
      setFollowState(getInitialState());
      console.error(error);
    }
    setIsLoading(false);
  }

  const handleUnfollow = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    setFollowState(initialIsFollowedBy ? 'Follow Back' : 'Follow');

    const { error } = await supabase
      .from('followers')
      .delete()
      .match({
        user_id: targetUserId,
        follower_id: user.id
      });

    if (error) {
      setFollowState(getInitialState());
      console.error(error);
    }
    setIsLoading(false);
  }

  const buttonConfig = {
    'Follow': { action: handleFollow, className: 'bg-primary hover:bg-primary/90 text-primary-foreground', text: 'Follow' },
    'Follow Back': { action: handleFollow, className: 'bg-primary hover:bg-primary/90 text-primary-foreground', text: 'Follow Back' },
    'Following': { action: handleUnfollow, className: 'bg-muted-foreground text-muted-foreground hover:bg-destructive hover:text-destructive-foreground', text: 'Following' },
    'Friend': { action: handleUnfollow, className: 'bg-muted-foreground text-muted-foreground hover:bg-destructive hover:text-destructive-foreground', text: 'Friend' }
  };

  const config = buttonConfig[followState];

  return (
    <button
      onClick={config.action}
      disabled={isLoading}
      className={`py-2 px-4 rounded font-semibold transition-all ${config.className} text-white cursor-pointer`}
    >
      {isLoading ? '...' : config.text}
    </button>
  );
}
