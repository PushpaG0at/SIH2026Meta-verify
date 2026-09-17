import React, { useRef, useState } from 'react';
import { UploadCloud, FileCheck, X, FileText } from 'lucide-react';
import Button from './Button';

export const FileUploader = ({
  onFileSelect,
  accept = '.pdf,.png,.jpg,.jpeg',
  maxSizeMB = 5,
  label = 'Upload Verification Documents',
  sublabel = 'PDF, PNG, JPG up to 5MB (Invoices, Model Approvals, Calibration Records)'
}) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  const handleFiles = (files) => {
    setError('');
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMB}MB limit.`);
      return;
    }
    setSelectedFile(file);
    if (onFileSelect) onFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onFileSelect) onFileSelect(null);
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFiles(e.target.files)}
        accept={accept}
        className="hidden"
      />

      <div
        onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
          dragActive
            ? 'border-blue-500 bg-blue-50/50'
            : selectedFile
            ? 'border-emerald-300 bg-emerald-50/30'
            : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
        }`}
      >
        {selectedFile ? (
          <div className="flex items-center justify-between w-full max-w-md bg-white p-3 rounded-lg border border-emerald-200 shadow-xs">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-md">
                <FileCheck className="w-5 h-5" />
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-800 truncate">{selectedFile.name}</p>
                <p className="text-[11px] text-slate-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-full mb-2">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-800">{label}</p>
            <p className="text-xs text-slate-500 mt-0.5 text-center max-w-sm">{sublabel}</p>
            <div className="mt-3">
              <span className="text-xs font-medium text-blue-600 hover:text-blue-700 bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-2xs">
                Browse Files
              </span>
            </div>
          </>
        )}
      </div>

      {error && <p className="mt-1.5 text-xs text-rose-600 font-medium">{error}</p>}
    </div>
  );
};

export default FileUploader;
