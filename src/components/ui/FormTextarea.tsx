import {ChangeEvent} from "react";

type FormTextareaProps = {
  id: string;
  value: string;
  onChangeAction: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  rows: number;
  placeholder?: string;
  maxLength?: number;
}

export const FormTextarea = ({
  id,
  value,
  onChangeAction,
  rows,
  placeholder,
  maxLength,
}: FormTextareaProps) => {
  return (
    <textarea
      id={id}
      value={value}
      onChange={onChangeAction}
      rows={rows}
      className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500 resize-none"
      placeholder={placeholder}
      maxLength={maxLength}
    />
  )
}