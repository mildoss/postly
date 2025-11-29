'use client'

import {FormInput} from "@/components/ui/FormInput";
import {FormTextarea} from "@/components/ui/FormTextarea";
import {FormButton} from "@/components/ui/FormButton";
import {ChangeEvent, FormEvent, useState} from "react";
import {User} from "@supabase/auth-js";
import {useRouter} from "next/navigation";
import {supabase} from "@/lib/supabaseClient";
import {UserProfile} from "@/lib/types";
import Link from "next/link";
import {Avatar} from "@/components/ui/Avatar";

type SettingsFormProps = {
  user: User;
  profile: UserProfile;
}

export const SettingsForm = ({user, profile}: SettingsFormProps) => {
  const [bio, setBio] = useState(profile.bio || '');
  const [username, setUsername] = useState(profile.username || '');
  const [currentAvatarUrl] = useState(profile.avatar_url);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));

      if (file.size > 1024 * 1024) {
        setMessage('Error: Image must be less than 1MB');
        setAvatarFile(null);
        setAvatarPreview(null);
        e.target.value = '';
        return;
      }

      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setMessage('');
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user) return;

    const USERNAME_REGEX = /^[A-Za-z0-9]{3,20}$/;
    if (!USERNAME_REGEX.test(username)) {
      setMessage('Username must contain only English letters and numbers.');
      return;
    }

    setIsLoading(true);
    setMessage('');
    let newAvatarUrl = currentAvatarUrl;

    if (avatarFile) {
      const fileExt = avatarFile.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      const {error: uploadError} = await supabase
        .storage
        .from('avatars')
        .upload(filePath, avatarFile, {
          upsert: true
        })

      if (uploadError) {
        setMessage('Error uploading avatar: ' + uploadError.message);
        setIsLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase
        .storage
        .from('avatars')
        .getPublicUrl(filePath);

      newAvatarUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;
    }

    const {error: updateError} = await supabase
      .from('users')
      .update({
        username: username,
        bio: bio || null,
        avatar_url: newAvatarUrl
      })
      .eq('id', user.id);

    setIsLoading(false);

    if (updateError) {
      if (updateError.code === '23505') {
        setMessage('Error: This username is already taken.');
      } else {
        setMessage('Error updating profile: ' + updateError.message);
      }
    } else {
      setMessage('Profile updated successfully!');
      router.refresh();
    }
  }

  const avatarToShow = avatarPreview || currentAvatarUrl || null;

  return (
    <form
      onSubmit={handleSubmit}
      className="relative p-8 mx-4 bg-card rounded-lg shadow-xl w-full max-w-sm text-foreground"
    >
      <div className="absolute top-2 left-2 flex items-center gap-4">
        <Link href={`/${profile.username}`} className="text-primary hover:text-primary/80 transition-colors">
          ← Back to profile
        </Link>
      </div>
      <h2 className="text-2xl font-bold mt-2 mb-6 text-center">
        Edit Your Profile
      </h2>
      <div className="flex flex-col items-center mb-6">
        <label htmlFor="avatar-upload" className="cursor-pointer">
          <Avatar
            src={avatarToShow}
            fallback={username}
            className="w-32 h-32 text-4xl"
          />
        </label>
        <input
          type="file"
          id="avatar-upload"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        <span className="text-sm text-muted-foreground mt-2">Click image to change</span>
      </div>
      <FormInput
        id="username"
        label="Username"
        type="text"
        value={username}
        onChangeAction={(e) => setUsername(e.target.value.toLowerCase())}
        placeholder="your_username"
        required
        minLength={3}
        maxLength={32}
      />
      <div className="mb-4">
        <label className="block text-sm font-medium text-muted-foreground mb-2" htmlFor="bio">
          Bio
        </label>
        <FormTextarea
          id="bio"
          value={bio}
          onChangeAction={(e) => setBio(e.target.value)}
          rows={3}
          placeholder="Tell us about yourself..."
          maxLength={256}
        />
      </div>
      <FormButton
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? 'Saving...' : 'Save Changes'}
      </FormButton>

      {message && (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {message}
        </p>
      )}
    </form>
  )
}