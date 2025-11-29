'use client'

import {PostCard} from "@/components/posts/PostCard";
import {PostWithReactions} from "@/lib/types";
import {User} from "@supabase/auth-js";
import {useEffect, useState, useRef, useCallback} from "react";
import {supabase} from "@/lib/supabaseClient";

type PostsListProps = {
  initialPosts: PostWithReactions[] | null;
  currentUser: User | null;
  filterUserId?: string;
  filterIsPrivate?: boolean;
}

export const PostsList = ({
  initialPosts,
  currentUser,
  filterUserId,
  filterIsPrivate
}: PostsListProps) => {
  const [posts, setPosts] = useState<PostWithReactions[]>(initialPosts || []);
  const [incomingPosts, setIncomingPosts] = useState<PostWithReactions[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState((initialPosts?.length || 0) >= 10);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const channel = supabase.channel('realtime-posts')
      .on(
        'postgres_changes',
        {event: 'INSERT', schema: 'public', table: 'posts'},
        async (payload) => {
          const newPostRaw = payload.new;

          if (filterIsPrivate !== undefined && newPostRaw.is_private !== filterIsPrivate) return;
          if (filterUserId && newPostRaw.user_id !== filterUserId) return;

          const {data, error} = await supabase.rpc('get_posts_with_reactions', {
            p_post_id: newPostRaw.id,
            p_limit: 1
          });

          if (!error && data && data.length > 0) {
            const newPostFull = data[0] as PostWithReactions;
            const isMyPost = currentUser && newPostFull.user_id === currentUser.id;

            if (isMyPost) {
              setPosts(prev => [newPostFull, ...prev]);
              window.scrollTo({top: 0, behavior: 'smooth'});
            } else {
              setIncomingPosts(prev => [newPostFull, ...prev]);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    }
  }, [filterUserId, filterIsPrivate, currentUser]);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    const lastPost = posts[posts.length - 1];
    if (!lastPost) {
      setIsLoading(false);
      return;
    }

    const {data, error} = await supabase.rpc('get_posts_with_reactions', {
      p_last_created_at: lastPost.created_at,
      p_limit: 10,
      p_is_private: filterIsPrivate ?? null,
      p_user_id: filterUserId || null
    });

    if (!error && data) {
      const newPosts = data as PostWithReactions[];
      if (newPosts.length < 10) setHasMore(false);

      setPosts(prev => {
        const uniqueNewPosts = newPosts.filter(np => !prev.some(p => p.id === np.id));
        return [...prev, ...uniqueNewPosts];
      });
    }
    setIsLoading(false);
  }, [posts, hasMore, isLoading, filterUserId, filterIsPrivate]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },

      {threshold: 1.0}
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [loadMore]);

  const handleShowNewPosts = () => {
    setPosts(prev => [...incomingPosts, ...prev]);
    setIncomingPosts([]);
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  if (!posts || posts.length === 0) {
    return <p className="text-muted-foreground text-center mt-10">No posts yet.</p>;
  }

  return (
    <div className="w-full flex flex-col gap-2 pb-10 relative">
      {incomingPosts.length > 0 && (
        <div className="sticky top-4 z-10 flex justify-center animate-in fade-in slide-in-from-top-2">
          <button
            onClick={handleShowNewPosts}
            className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg font-bold text-sm hover:bg-blue-700 transition-all cursor-pointer"
          >
            Show {incomingPosts.length} new posts ↑
          </button>
        </div>
      )}
      {posts.map((p) => (
        <PostCard key={p.id} post={p} currentUser={currentUser}/>
      ))}
      {hasMore && (
        <div ref={observerTarget} className="flex justify-center p-4 h-10">
          {isLoading && <span className="text-gray-400 text-sm animate-pulse">Loading more...</span>}
        </div>
      )}
      {!hasMore && posts.length > 0 && (
        <p className="text-center text-sm text-gray-500 mt-4">You&#39;ve reached the end.</p>
      )}
    </div>
  )
}