'use client'

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { AuthForm } from "@/components/auth/AuthForm";

export default function SignUp() {
  const [successMessage, setSuccessMessage] = useState('')

  const handleSignUp = async (email: string, password: string) => {
    const {error} = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: `${location.origin}/api/auth/callback`,
      },
    })

    if (error) {
      return 'Registration error: ' + error.message;
    } else {
      setSuccessMessage('Registration successful! Please check your email.')
      return null;
    }
  }

  if (successMessage) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)] bg-background">
        <p className="p-8 text-foreground text-center">{successMessage}</p>
      </div>
    )
  }

  return (
    <AuthForm
      title="Create an account"
      buttonText="Sign Up"
      linkText="Already have an account? Log in"
      linkHref="/login"
      handleSubmitAction={handleSignUp}
    />
  )
}