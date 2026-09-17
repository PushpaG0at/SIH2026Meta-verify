import React from 'react';
import { Loader2 } from 'lucide-react';

export const Spinner = ({
  size = 'md',
  color = 'text-blue-600',
  className = '',
  label
}) => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <Loader2 className={`animate-spin ${sizes[size] || sizes.md} ${color}`} />
      {label && <span className="text-xs text-slate-600 font-medium">{label}</span>}
    </div>
  );
};

export default Spinner;
