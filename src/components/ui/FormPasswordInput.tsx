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
      <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor={id}>
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
        className="w-full p-2 pr-14 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-1 top-[33px] px-2 py-1 rounded bg-gray-900 text-gray-400 hover:text-gray-200 focus:outline-none transition cursor-pointer"
      >
        {showPassword ? 'hide' : 'show'}
      </button>
    </div>
  )
}