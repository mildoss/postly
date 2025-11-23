'use client'

import { ChangeEvent } from 'react'

type FormInputProps = {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChangeAction: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
}

export const FormInput = ({
  id,
  label,
  type = 'text',
  value,
  onChangeAction,
  placeholder,
  required = false,
  minLength,
  maxLength,
}: FormInputProps) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChangeAction}
        required={required}
        className="w-full p-2 rounded bg-muted text-foreground border border-border focus:outline-none focus:border-primary placeholder:text-muted-foreground"
        placeholder={placeholder}
        minLength={minLength}
        maxLength={maxLength}
      />
    </div>
  )
}