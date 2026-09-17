import React, { forwardRef } from 'react';
import { Check } from 'lucide-react';

export const Checkbox = forwardRef(({
  id,
  name,
  label,
  description,
  checked,
  onChange,
  disabled = false,
  error,
  className = '',
  wrapperClassName = '',
  ...props
}, ref) => {
  const checkboxId = id || name || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`flex items-start gap-2.5 select-none ${wrapperClassName}`}>
      <div className="relative flex items-center justify-center mt-0.5">
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        <div
          className={`w-4.5 h-4.5 rounded border flex items-center justify-center transition-all cursor-pointer ${
            disabled
              ? 'bg-slate-100 border-slate-300 cursor-not-allowed'
              : checked
              ? 'bg-blue-600 border-blue-600 text-white shadow-2xs'
              : 'bg-white border-slate-300 hover:border-slate-400'
          } ${error ? 'border-rose-400' : ''} ${className}`}
        >
          {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </div>
      </div>

      {(label || description) && (
        <label htmlFor={checkboxId} className="cursor-pointer text-xs">
          {label && (
            <span className={`font-semibold block ${disabled ? 'text-slate-400' : 'text-slate-800'}`}>
              {label}
            </span>
          )}
          {description && (
            <span className="text-slate-500 text-[11px] block mt-0.5 leading-snug">
              {description}
            </span>
          )}
          {error && <span className="text-rose-600 text-[11px] font-medium block mt-0.5">{error}</span>}
        </label>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
