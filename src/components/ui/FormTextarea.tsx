import {ChangeEvent} from "react";
import Image from "next/image";

type FormTextareaProps = {
  id: string;
  value: string;
  onChangeAction: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  rows: number;
  placeholder?: string;
  maxLength?: number;
  previewUrl?: string | null;
  onFileChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onFileRemove?: () => void;
}

export const FormTextarea = ({
  id,
  value,
  onChangeAction,
  rows,
  placeholder,
  maxLength,
  previewUrl,
  onFileRemove,
  onFileChange
}: FormTextareaProps) => {
  return (
    <div className="w-full relative">
      <textarea
        id={id}
        value={value}
        onChange={onChangeAction}
        rows={rows}
        className={`w-full p-2 ${previewUrl ? 'pr-26' : 'pr-10'} sm:overflow-hidden h-full pb-10 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500 resize-none`}
        placeholder={placeholder}
        maxLength={maxLength}
      />
      {previewUrl && (
        <div className="absolute top-2 right-12 mb-1">
          <div className="ml-2 relative inline-block">
            <Image
              src={previewUrl}
              alt="Preview"
              width={56}
              height={56}
              className="rounded-lg max-h-14 max-w-14 border-2 border-gray-600"
            />
            <button
              type="button"
              onClick={onFileRemove}
              className="absolute -top-2 -right-2 cursor-pointer bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-all text-xs"
              aria-label="Remove file"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      {onFileChange && (
        <div className="absolute top-2 right-4 sm:right-2">
          <input
            type="file"
            id={`${id}-file-upload`}
            onChange={onFileChange}
            className="hidden"
          />
          <label
            htmlFor={`${id}-file-upload`}
            className="cursor-pointer text-blue-400 hover:text-blue-500 inline-flex items-center justify-center w-8 h-8 rounded transition-all"
            title="Attach file"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
            </svg>
          </label>
        </div>
      )}
    </div>
  )
}