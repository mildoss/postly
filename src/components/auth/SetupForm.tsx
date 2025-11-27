'use client'

import {FormEvent, useState} from "react";
import {useRouter} from "next/navigation";
import {FormInput} from "@/components/ui/FormInput";
import {FormButton} from "@/components/ui/FormButton";
import {supabase} from "@/lib/supabaseClient";
import {FormTextarea} from "@/components/ui/FormTextarea";

export const SetupForm = () => {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const {data: {user}} = await supabase.auth.getUser();

      if (!user) {
        setMessage('Error: user not found. Please log in again.');
        setIsLoading(false);
        return;
      }

      const USERNAME_REGEX = /^[A-Za-z0-9]{3,20}$/;
      if (!USERNAME_REGEX.test(username)) {
        setMessage('Username must contain only English letters and numbers (3-20 chars).');
        return;
      }

      const {error} = await supabase
        .from('users')
        .update({
          username: username,
          bio: bio || null,
        })
        .eq('id', user.id)

      setIsLoading(false);

      if (error) {
        if (error.code === '23505') {
          setMessage('Error: This username is already taken. Try another one.');
        } else {
          setMessage(`Error updating profile: ${error.message}`);
        }
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setMessage(`Unexpected error: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
      <form
        onSubmit={handleSubmit}
        className="p-8 mx-4 bg-card rounded-lg shadow-xl w-full max-w-sm border border-border"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-primary">
          Setup Your Profile
        </h2>
        <p className="text-center text-muted-foreground mb-6 text-sm">
          Please choose a username and optionally add a bio to complete your profile.
        </p>
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
            Bio (Optional)
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
          {isLoading ? 'Saving...' : 'Save and continue'}
        </FormButton>

        {message && (
          <p className="mt-4 text-center text-sm text-destructive">
            {message}
          </p>
        )}
      </form>
  )
}