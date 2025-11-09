type FormButtonProps = {
  type: "submit" | "button" | "reset";
  disabled: boolean;
  children: string;
}

export const FormButton = ({type,disabled,children}: FormButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  )
}