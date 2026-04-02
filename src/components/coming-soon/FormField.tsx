'use client'

import React from 'react'
import { FieldError } from 'react-hook-form'

interface FormFieldProps {
  label: string
  required?: boolean
  error?: FieldError
  children: React.ReactNode
}

/** Wraps a label + input + error message in a consistent layout */
export const FormField: React.FC<FormFieldProps> = ({ label, required, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
      {label}
      {required && <span className="text-[#FF9530] ml-0.5">*</span>}
    </label>
    {children}
    {error && (
      <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-0.5">
        <span>⚠</span> {error.message}
      </p>
    )}
  </div>
)

const inputBase =
  'w-full px-4 py-2.5 bg-gray-50 border rounded-lg text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400'
const inputNormal = `${inputBase} border-gray-200 focus:border-[#FF9530] focus:bg-white focus:ring-1 focus:ring-[#FF9530]/20`
const inputError = `${inputBase} border-red-400 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-200`

export const inputClass = (hasError?: boolean) => (hasError ? inputError : inputNormal)

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean
  options: string[]
  placeholder?: string
}

/**
 * SelectInput wrapped in forwardRef so React Hook Form's `register()` ref
 * is forwarded directly to the underlying <select> element.
 */
export const SelectInput = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ hasError, options, placeholder, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={`${inputClass(hasError)} appearance-none cursor-pointer pr-8`}
        {...props}
      >
        <option value="">{placeholder ?? 'Select an option'}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <svg
        className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  )
)

SelectInput.displayName = 'SelectInput'
