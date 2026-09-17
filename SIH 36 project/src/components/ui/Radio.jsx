import React, { forwardRef } from 'react';

export const Radio = forwardRef(({
  id,
  name,
  label,
  description,
  value,
  checked,
  onChange,
  disabled = false,
  className = '',
  wrapperClassName = '',
  ...props
}, ref) => {
  const radioId = id || (label ? `${name}-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className={`flex items-start gap-2.5 select-none ${wrapperClassName}`}>
      <div className="relative flex items-center justify-center mt-0.5">
        <input
          ref={ref}
          type="radio"
          id={radioId}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        <div
          className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
            disabled
              ? 'bg-slate-100 border-slate-300 cursor-not-allowed'
              : checked
              ? 'border-blue-600 bg-white'
              : 'border-slate-300 bg-white hover:border-slate-400'
          } ${className}`}
        >
          {checked && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
        </div>
      </div>

      {(label || description) && (
        <label htmlFor={radioId} className="cursor-pointer text-xs">
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
        </label>
      )}
    </div>
  );
});

Radio.displayName = 'Radio';

export default Radio;
