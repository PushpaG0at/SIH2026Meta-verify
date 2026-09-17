import React from 'react';
import { getRiskConfig } from '../../utils/formatters';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

export const RiskBadge = ({ level = 'LOW', score, showIcon = true, className = '' }) => {
  const config = getRiskConfig(level);

  const getIcon = () => {
    switch (level?.toUpperCase()) {
      case 'LOW':
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />;
      case 'MEDIUM':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />;
      case 'HIGH':
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />;
      default:
        return null;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      {showIcon && getIcon()}
      <span>{config.label}</span>
      {score !== undefined && (
        <span className="ml-1 opacity-75 font-mono text-[11px] font-normal">
          ({score}/100)
        </span>
      )}
    </span>
  );
};

export default RiskBadge;
