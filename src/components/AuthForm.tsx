'use client'

import { FormEvent, useState } from 'react'
import { FormInput } from "@/components/ui/FormInput";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { FormButton } from "@/components/ui/FormButton";
import Link from 'next/link';

type AuthFormProps = {
  title: string;
  buttonText: string;
  handleSubmitAction: (email: string, password: string) => Promise<string | null>
  onSuccessAction?: () => void
  linkText: string;
  linkHref: string;
}

export const AuthForm = ({
  title,
  buttonText,
  handleSubmitAction,
  onSuccessAction,
  linkText,
  linkHref,
}: AuthFormProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    const errorMessage = await handleSubmitAction(email, password);

    if (errorMessage) {
      setMessage(errorMessage);
    } else {
      if (onSuccessAction) {
        onSuccessAction();
      }
    }
    setIsLoading(false);
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleFormSubmit}
        className="p-8 mx-4 bg-gray-800 rounded-lg shadow-xl w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          {title}
        </h2>
        <FormInput
          id="email"
          label="Email"
          type="email"
          value={email}
          onChangeAction={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
        <PasswordInput
          id="password"
          label="Password"
          value={password}
          onChangeAction={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          minLength={6}
          maxLength={72}
        />
        <FormButton
          type={"submit"}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : buttonText}
        </FormButton>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-300">
            {message}
          </p>
        )}

        <div className="mt-6 text-center text-sm">
          <Link href={linkHref} className="font-medium text-blue-400 hover:text-blue-500 transition-colors">
            {linkText}
          </Link>
        </div>
      </form>
    </div>
  )
}