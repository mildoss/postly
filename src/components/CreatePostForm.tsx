'use client'

import {useState} from "react";
import {FormTextarea} from "@/components/ui/FormTextarea";
import {FormButton} from "@/components/ui/FormButton";
import {useRouter} from "next/navigation";
import {supabase} from "@/lib/supabaseClient";

export const CreatePostForm = () => {
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    const {data: {user}} = await supabase.auth.getUser();

    if (!user) {
      setMessage('You must be logged in to post.');
      setIsLoading(false);
      return;
    }

    const {error} = await supabase
      .from('posts')
      .insert({
        content: text,
        user_id: user.id
      });

    setIsLoading(false);

    if (error) {
      setMessage('Error creating post: ' + error.message);
    } else {
      setText('');
      router.refresh();
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="grid grid-cols-[1fr_auto] gap-2 w-full">
        <FormTextarea
          id="post"
          value={text}
          onChangeAction={(e) => setText(e.target.value)}
          rows={1}
          placeholder="Write your post here..."
          maxLength={256}
        />
        <FormButton type="submit" disabled={isLoading}>CREATE</FormButton>
      </form>
      {message && <p className="text-sm text-red-400 mt-2">{message}</p>}
    </div>
  )
}