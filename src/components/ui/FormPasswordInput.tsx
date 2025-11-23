'use client'

import { ChangeEvent, useState } from 'react'

type PasswordInputProps = {
  id: string
  label: string
  value: string
  onChangeAction: (e: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  required?: boolean
  minLength?: number
  maxLength?: number
}

export const FormPasswordInput = ({
  id,
  label,
  value,
  onChangeAction,
  placeholder,
  required = false,
  minLength,
  maxLength,
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative mb-6">
      <label className="block text-sm font-medium text-muted-foreground mb-2" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChangeAction}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        className="w-full p-2 pr-14 rounded bg-muted text-foreground border border-border focus:outline-none focus:border-primary placeholder:text-muted-foreground"
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-1 top-[33px] px-2 py-1 rounded bg-background shadow-lg text-muted-foreground hover:text-foreground focus:outline-none transition cursor-pointer"
      >
        {showPassword ? 'hide' : 'show'}
      </button>
    </div>
  )
}