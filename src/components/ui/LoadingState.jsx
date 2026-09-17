import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState = ({
  message = 'Loading verification records...',
  className = ''
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-slate-200 ${className}`}
    >
      <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
      <p className="text-sm font-medium text-slate-700">{message}</p>
      <p className="text-xs text-slate-400 mt-1">Please wait while the system synchronizes data</p>
    </div>
  );
};

export default LoadingState;
