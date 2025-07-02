import React, { useId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: "default" | "filled";
  inputSize?: "sm" | "md" | "lg";
}

export function Input({
  label,
  error,
  helperText,
  variant = "default",
  inputSize = "md",
  className = "",
  id,
  ...props
}: InputProps) {
  const reactId = useId();
  const inputId = id || reactId;

  const baseClasses =
    "w-full border rounded-md shadow-sm focus:ring-2 focus:outline-none transition-colors";

  const variantClasses = {
    default: "border-gray-300 focus:ring-blue-400 focus:border-blue-400",
    filled:
      "border-gray-300 bg-gray-50 focus:ring-blue-400 focus:border-blue-400",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };

  const errorClasses = error
    ? "border-red-500 focus:ring-red-400 focus:border-red-400"
    : "";

  const inputClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[inputSize]} ${errorClasses} ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}

      <input id={inputId} className={inputClasses} {...props} />

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}
