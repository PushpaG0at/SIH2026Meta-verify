import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

export const Textarea = forwardRef(({
  label,
  error,
  helperText,
  id,
  name,
  rows = 3,
  value,
  placeholder,
  required = false,
  disabled = false,
  maxLength,
  showCount = false,
  className = '',
  wrapperClassName = '',
  onChange,
  ...props
}, ref) => {
  const inputId = id || name || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const currentLength = typeof value === 'string' ? value.length : 0;

  return (
    <div className={`w-full ${wrapperClassName}`}>
      <div className="flex items-center justify-between mb-1">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-slate-700 select-none"
          >
            {label}
            {required && <span className="text-rose-500 ml-1 font-bold">*</span>}
          </label>
        )}
        {showCount && maxLength && (
          <span className="text-[11px] text-slate-400 font-mono">
            {currentLength}/{maxLength}
          </span>
        )}
      </div>

      <div className="relative">
        <textarea
          ref={ref}
          id={inputId}
          name={name}
          rows={rows}
          value={value}
          onChange={onChange}
          disabled={disabled}
          maxLength={maxLength}
          placeholder={placeholder}
          required={required}
          className={`w-full rounded-lg bg-white border p-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 shadow-2xs transition-all focus:outline-none focus:ring-2 disabled:bg-slate-100 disabled:cursor-not-allowed ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
              : 'border-slate-300 hover:border-slate-400 focus:border-blue-500 focus:ring-blue-100'
          } ${className}`}
          {...props}
        />
      </div>

      {error ? (
        <p className="mt-1 text-[11px] font-medium text-rose-600 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="mt-1 text-[11px] text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
