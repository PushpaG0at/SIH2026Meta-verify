import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed with this operation?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary', // 'primary' | 'danger' | 'success'
  isLoading = false
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex gap-4">
        <div
          className={`p-3 rounded-full shrink-0 h-fit ${
            variant === 'danger'
              ? 'bg-rose-100 text-rose-600'
              : variant === 'success'
              ? 'bg-emerald-100 text-emerald-600'
              : 'bg-blue-100 text-blue-600'
          }`}
        >
          {variant === 'danger' ? (
            <AlertTriangle className="w-6 h-6" />
          ) : (
            <CheckCircle2 className="w-6 h-6" />
          )}
        </div>
        <div>
          <p className="text-sm text-slate-600 mt-1 leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-3">
        <Button variant="outline" size="md" onClick={onClose} disabled={isLoading}>
          {cancelText}
        </Button>
        <Button
          variant={variant === 'danger' ? 'danger' : variant === 'success' ? 'success' : 'primary'}
          size="md"
          onClick={onConfirm}
          isLoading={isLoading}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
