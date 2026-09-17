import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  dotColor,
  leftIcon: LeftIcon,
  className = '',
  ...props
}) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-blue-50 text-blue-700 border-blue-200',
    secondary: 'bg-slate-900 text-white border-transparent',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    outline: 'bg-transparent text-slate-700 border-slate-300',
    outlineDark: 'bg-transparent text-slate-300 border-slate-700'
  };

  const sizes = {
    sm: 'text-[10px] px-1.5 py-0.5 font-medium gap-1',
    md: 'text-xs px-2.5 py-0.5 font-semibold gap-1.5',
    lg: 'text-sm px-3 py-1 font-semibold gap-2'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            dotColor || 'bg-current opacity-80'
          }`}
        />
      )}
      {LeftIcon && <LeftIcon className="w-3 h-3 shrink-0" />}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
