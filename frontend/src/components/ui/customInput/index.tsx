import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  error?: string | false;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  error,
  className,
  ...rest
}) => {
  return (
    <div className={`flex flex-col w-full ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        className={`
          mt-1 block w-full px-3 py-2 border 
          ${
            error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
          } 
          rounded-md shadow-sm 
          focus:outline-none 
          sm:text-sm
          placeholder-gray-400
          text-gray-900
          bg-white
          disabled:bg-gray-100
          disabled:cursor-not-allowed
          transition-colors duration-200 ease-in-out
        `}
        {...rest}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
