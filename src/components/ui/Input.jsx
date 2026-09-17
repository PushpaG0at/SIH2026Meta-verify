import React, { forwardRef } from 'react';
import { AlertCircle, X } from 'lucide-react';

export const Input = forwardRef(({
  label,
  error,
  helperText,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  clearable = false,
  onClear,
  value,
  id,
  name,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  size = 'md',
  className = '',
  wrapperClassName = '',
  onChange,
  ...props
}, ref) => {
  const inputId = id || name || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  const sizes = {
    sm: 'py-1.5 text-xs px-2.5',
    md: 'py-2 text-sm px-3',
    lg: 'py-2.5 text-base px-3.5'
  };

  const hasLeft = Boolean(LeftIcon);
  const hasRight = Boolean(RightIcon || (clearable && value) || error);

  return (
    <div className={`w-full ${wrapperClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-slate-700 mb-1 select-none"
        >
          {label}
          {required && <span className="text-rose-500 ml-1 font-bold">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {LeftIcon && (
          <div className="absolute left-3 pointer-events-none text-slate-400">
            <LeftIcon className="w-4 h-4" />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          className={`w-full rounded-lg bg-white border transition-all placeholder-slate-400 text-slate-900 shadow-2xs focus:outline-none focus:ring-2 disabled:bg-slate-100 disabled:cursor-not-allowed ${
            hasLeft ? 'pl-9' : ''
          } ${hasRight ? 'pr-9' : ''} ${sizes[size] || sizes.md} ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
              : 'border-slate-300 hover:border-slate-400 focus:border-blue-500 focus:ring-blue-100'
          } ${className}`}
          {...props}
        />

        {/* Right action or status icon */}
        <div className="absolute right-2.5 flex items-center gap-1">
          {clearable && value && !disabled && (
            <button
              type="button"
              onClick={onClear}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          {error && !clearable && (
            <AlertCircle className="w-4 h-4 text-rose-500" />
          )}
          {RightIcon && !error && (!clearable || !value) && (
            <div className="text-slate-400 pointer-events-none">
              <RightIcon className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      {error ? (
        <p className="mt-1 text-[11px] font-medium text-rose-600 flex items-center gap-1">
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="mt-1 text-[11px] text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
