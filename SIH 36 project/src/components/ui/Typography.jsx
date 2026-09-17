import React from 'react';

export const Heading = ({
  level = 'h2',
  size,
  children,
  className = '',
  ...props
}) => {
  const Tag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(level) ? level : 'h2';

  const defaultSizes = {
    h1: 'text-2xl sm:text-4xl font-extrabold tracking-tight',
    h2: 'text-xl sm:text-2xl font-bold tracking-tight',
    h3: 'text-lg sm:text-xl font-bold tracking-tight',
    h4: 'text-base sm:text-lg font-bold',
    h5: 'text-sm sm:text-base font-semibold',
    h6: 'text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500'
  };

  const selectedSize = size || defaultSizes[Tag];

  return (
    <Tag className={`font-heading text-slate-900 ${selectedSize} ${className}`} {...props}>
      {children}
    </Tag>
  );
};

export const Text = ({
  variant = 'body',
  as: Component = 'p',
  children,
  className = '',
  ...props
}) => {
  const variants = {
    lead: 'text-base sm:text-lg text-slate-600 font-normal leading-relaxed',
    body: 'text-sm text-slate-700 leading-normal',
    muted: 'text-xs text-slate-500 leading-normal',
    small: 'text-xs text-slate-600',
    caption: 'text-[11px] text-slate-400 uppercase font-semibold tracking-wider',
    code: 'font-mono text-xs bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded border border-slate-200'
  };

  return (
    <Component className={`${variants[variant] || variants.body} ${className}`} {...props}>
      {children}
    </Component>
  );
};

export const Label = ({
  children,
  htmlFor,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-xs font-semibold text-slate-700 mb-1 select-none ${className}`}
      {...props}
    >
      {children}
      {required && <span className="text-rose-500 ml-1 font-bold">*</span>}
    </label>
  );
};

export default { Heading, Text, Label };
