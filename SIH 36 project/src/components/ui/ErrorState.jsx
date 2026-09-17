import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

export const ErrorState = ({
  title = 'Unable to load information',
  message = 'An unexpected error occurred while fetching the requested record.',
  onRetry,
  className = ''
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-xl border border-rose-200 ${className}`}
    >
      <div className="p-3 bg-rose-50 rounded-full text-rose-600 mb-3">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h4 className="text-base font-semibold text-slate-900">{title}</h4>
      <p className="mt-1 text-xs text-slate-600 max-w-md">{message}</p>
      {onRetry && (
        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={onRetry} leftIcon={RefreshCw}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default ErrorState;
