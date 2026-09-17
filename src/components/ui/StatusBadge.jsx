import React from 'react';
import { getStatusConfig } from '../../utils/formatters';

export const StatusBadge = ({ status, size = 'md', className = '' }) => {
  const config = getStatusConfig(status);
  
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3 py-1.5 font-semibold'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.color} ${sizeStyles[size] || sizeStyles.md} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;
