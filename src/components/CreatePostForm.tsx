'use client'

import {ChangeEvent, FormEvent, useState} from "react";
import {FormTextarea} from "@/components/ui/FormTextarea";
import {FormButton} from "@/components/ui/FormButton";
import {useRouter} from "next/navigation";
import {supabase} from "@/lib/supabaseClient";
import {getUniqueFileName} from "@/lib/utils";

type CreatePostFormProps = {
  isPrivatePost: boolean;
}

export const CreatePostForm = ({isPrivatePost}: CreatePostFormProps) => {
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setFile(null);
      setPreviewUrl(null);
    }
  }

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewUrl(null);
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!text && !file) {
      setMessage('Post must contain text or an image.');
      return;
    }

    setIsLoading(true);
    setMessage('');

    const {data: {user}} = await supabase.auth.getUser();

    if (!user) {
      setMessage('You must be logged in to post.');
      setIsLoading(false);
      return;
    }

    const {data: postData, error: postError} = await supabase
      .from('posts')
      .insert({
        content: text,
        user_id: user.id,
        is_private: isPrivatePost
      })
      .select()
      .single();

    if (postError) {
      setMessage('Error creating post: ' + postError.message);
      setIsLoading(false);
      return;
    }

    if (file) {
      const newPostId = postData.id;
      const uniqueFileName = getUniqueFileName(file);
      const filePath = `${user.id}/${newPostId}/${uniqueFileName}`;

      const {data: uploadData, error: uploadError} = await supabase
        .storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) {
        setMessage('Error uploading file: ' + uploadError.message);
      } else {
        const {data: urlData} = supabase
          .storage
          .from('media')
          .getPublicUrl(uploadData.path);

        const publicUrl = urlData.publicUrl;

        const {error: mediaError} = await supabase
          .from('media')
          .insert({
            post_id: newPostId,
            user_id: user.id,
            url: publicUrl,
            mime_type: file.type
          });

        if (mediaError) {
          setMessage('Error saving media link: ' + mediaError.message);
        }
      }
    }
    setIsLoading(false);
    setText('');
    setFile(null);
    setPreviewUrl(null);
    router.refresh();
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
          previewUrl={previewUrl}
          onFileChange={handleFileChange}
          onFileRemove={handleRemoveFile}
        />
        <FormButton type="submit" disabled={isLoading}>CREATE</FormButton>
      </form>
      {message && <p className="text-sm text-red-400 mt-2">{message}</p>}
    </div>
  )
}