import React, { forwardRef } from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';

export const Select = forwardRef(({
  label,
  error,
  helperText,
  id,
  name,
  value,
  options = [],
  placeholder = 'Select an option',
  required = false,
  disabled = false,
  size = 'md',
  className = '',
  wrapperClassName = '',
  onChange,
  children,
  ...props
}, ref) => {
  const selectId = id || name || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  const sizes = {
    sm: 'py-1.5 text-xs pl-2.5 pr-8',
    md: 'py-2 text-sm pl-3 pr-9',
    lg: 'py-2.5 text-base pl-3.5 pr-10'
  };

  return (
    <div className={`w-full ${wrapperClassName}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold text-slate-700 mb-1 select-none"
        >
          {label}
          {required && <span className="text-rose-500 ml-1 font-bold">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        <select
          ref={ref}
          id={selectId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`w-full rounded-lg bg-white border appearance-none cursor-pointer transition-all text-slate-900 shadow-2xs focus:outline-none focus:ring-2 disabled:bg-slate-100 disabled:cursor-not-allowed ${
            sizes[size] || sizes.md
          } ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
              : 'border-slate-300 hover:border-slate-400 focus:border-blue-500 focus:ring-blue-100'
          } ${className}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.length > 0
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>

        <div className="absolute right-3 pointer-events-none text-slate-400">
          <ChevronDown className="w-4 h-4" />
        </div>
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

Select.displayName = 'Select';

export default Select;
