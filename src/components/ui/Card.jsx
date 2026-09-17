import React from 'react';

export const Card = ({
  children,
  className = '',
  hoverEffect = false,
  bordered = true,
  padding = true,
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-xl ${
        bordered ? 'border border-slate-200' : ''
      } ${padding ? 'p-5' : ''} shadow-xs ${
        hoverEffect ? 'hover:shadow-sm hover:border-slate-300 transition-all' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div className={`pb-3 mb-3 border-b border-slate-100 flex flex-col space-y-1 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className = '', ...props }) => {
  return (
    <h3 className={`text-base font-bold text-slate-900 font-heading tracking-tight ${className}`} {...props}>
      {children}
    </h3>
  );
};

export const CardDescription = ({ children, className = '', ...props }) => {
  return (
    <p className={`text-xs text-slate-500 leading-normal ${className}`} {...props}>
      {children}
    </p>
  );
};

export const CardContent = ({ children, className = '', ...props }) => {
  return (
    <div className={`space-y-3 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = '', ...props }) => {
  return (
    <div className={`pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-3 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
