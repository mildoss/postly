'use client'

import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { AuthForm } from '@/components/AuthForm';

export default function Login() {
  const router = useRouter();

  const handleSignIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      return 'Error:' + error.message;
    }

    return null;
  }

  const handleSuccess = () => {
    router.push('/');
    router.refresh();
  }

  return (
    <AuthForm
      title="Sign in to your account"
      buttonText="Sign In"
      linkText="Don't have an account? Sign up"
      linkHref="/signup"
      handleSubmitAction={handleSignIn}
      onSuccessAction={handleSuccess}
    />
  )
}