import React from 'react';
import { Info, CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';

export const Alert = ({
  variant = 'info',
  title,
  children,
  onDismiss,
  action,
  className = '',
  ...props
}) => {
  const configs = {
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-900',
      icon: <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />,
      titleColor: 'text-blue-900',
      closeColor: 'text-blue-500 hover:text-blue-700'
    },
    success: {
      container: 'bg-emerald-50 border-emerald-200 text-emerald-950',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />,
      titleColor: 'text-emerald-900',
      closeColor: 'text-emerald-500 hover:text-emerald-700'
    },
    warning: {
      container: 'bg-amber-50 border-amber-200 text-amber-950',
      icon: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />,
      titleColor: 'text-amber-900',
      closeColor: 'text-amber-500 hover:text-amber-700'
    },
    error: {
      container: 'bg-rose-50 border-rose-200 text-rose-950',
      icon: <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />,
      titleColor: 'text-rose-900',
      closeColor: 'text-rose-500 hover:text-rose-700'
    }
  };

  const config = configs[variant] || configs.info;

  return (
    <div
      role="alert"
      className={`relative flex items-start gap-3 p-4 rounded-xl border text-xs shadow-2xs ${config.container} ${className}`}
      {...props}
    >
      {config.icon}
      <div className="flex-1 space-y-1">
        {title && <h5 className={`font-bold ${config.titleColor}`}>{title}</h5>}
        {children && <div className="leading-relaxed opacity-90">{children}</div>}
        {action && <div className="pt-2">{action}</div>}
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className={`p-1 rounded-md transition-colors ${config.closeColor}`}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
