'use client'

import {User} from "@supabase/auth-js";
import {ChatInput} from "@/components/chat/ChatInput";
import {useEffect, useLayoutEffect, useRef, useState, UIEvent} from "react";
import {supabase} from "@/lib/supabaseClient";
import {ChatHeader} from "@/components/chat/ChatHeader";
import {ChatMessages} from "@/components/chat/ChatMessages";
import {Message} from "@/lib/types";

type ChatWindowProps = {
  conversationId: number;
  currentUser: User;
  initialMessages: Message[];
  chatPartner: { username: string; avatar_url: string | null };
}

export const ChatWindow = ({conversationId, initialMessages, currentUser, chatPartner}: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialMessages.length >= 50);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number>(0);
  const isLoadingHistoryRef = useRef(false);
  const isUserAtBottomRef = useRef(true);

  useLayoutEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    if (isLoadingHistoryRef.current) {
      const newScrollHeight = container.scrollHeight;
      const diff = newScrollHeight - prevScrollHeightRef.current;

      if (diff > 0) {
        container.scrollTop = diff;
      }

      isLoadingHistoryRef.current = false;
    } else {
      const lastMessage = messages[messages.length - 1];
      const isOwnMessage = lastMessage?.sender_id === currentUser.id;

      if (isUserAtBottomRef || isOwnMessage || messages.length === initialMessages.length) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [messages, initialMessages.length, currentUser.id]);


  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel(`chat:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMessage = payload.new as Message;
            setMessages((prev) => {
              if (prev.some(msg => msg.id === newMessage.id)) {
                return prev;
              }
              return [...prev, newMessage];
            });
          }

          if (payload.eventType === 'DELETE') {
            const deletedMessageId = payload.old.id;
            setMessages((prev) => prev.filter((msg) => msg.id !== deletedMessageId));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    }
  },[conversationId])

  const loadMoreMessages = async () => {
    if (isLoadingMore || !hasMore || messages.length === 0) return;

    setIsLoadingMore(true);
    isLoadingHistoryRef.current = true;

    if (messagesContainerRef.current) {
      prevScrollHeightRef.current = messagesContainerRef.current.scrollHeight;
    }

    const oldestMessage = messages[0];

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .lt('created_at', oldestMessage.created_at)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error loading more messages:', error);
      setIsLoadingMore(false);
      return;
    }

    if (!data || data.length === 0) {
      setHasMore(false);
      setIsLoadingMore(false);
      return;
    }

    if (data.length < 50) {
      setHasMore(false);
    }

    setMessages(prev => {
      const newUniqueMessages = data.filter(newMsg =>
        !prev.some(existingMsg => existingMsg.id === newMsg.id)
      );

      if (newUniqueMessages.length === 0) return prev;

      return [...newUniqueMessages.reverse(), ...prev];
    });

    setIsLoadingMore(false);
  }

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;
    isUserAtBottomRef.current = distanceToBottom < 200;

    if (scrollTop < 10 && hasMore && !isLoadingMore) {
      loadMoreMessages();
    }
  }

  const handleDeleteMessage = async (messageId: number) => {
    const confirmed = window.confirm('Delete this message?');
    if (!confirmed) return;

    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));

    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);

    if (error) {
      console.error('Error deleting message:', error);
    }
  }

  return (
   <div className="fixed inset-0 flex flex-col lg:h-[calc(100vh-4rem)] h-[calc(100vh-5rem)] bg-background border border-border lg:static">
     <ChatHeader username={chatPartner.username} avatar_url={chatPartner.avatar_url}/>
     <ChatMessages
       ref={messagesContainerRef}
       messages={messages}
       currentUser={currentUser}
       onScroll={handleScroll}
       isLoadingMore={isLoadingMore}
       onDeleteMessage={handleDeleteMessage}
     />
     <ChatInput conversationId={conversationId} currentUserId={currentUser.id} />
   </div>
  )
}

