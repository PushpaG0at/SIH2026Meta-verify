import React from 'react';
import { Check } from 'lucide-react';

export const STEPS = [
  { id: 'draft', label: 'Draft' },
  { id: 'documents', label: 'Documents' },
  { id: 'ai_precheck', label: 'AI Pre-check' },
  { id: 'submitted', label: 'Submitted' },
  { id: 'inspection', label: 'Inspection' },
  { id: 'officer_review', label: 'Officer Review' },
  { id: 'approved', label: 'Approved' },
  { id: 'certificate', label: 'Certificate' }
];

export const ProgressStepper = ({ currentStep = 1, steps = STEPS }) => {
  return (
    <div className="w-full py-4 overflow-x-auto">
      <div className="flex items-center justify-between min-w-[620px] px-2">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <React.Fragment key={step.id}>
              {/* Step Node */}
              <div className="flex flex-col items-center group relative">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : isCurrent
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-xs'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : stepNumber}
                </div>
                <span
                  className={`mt-2 text-[11px] font-semibold tracking-tight text-center max-w-[76px] whitespace-normal ${
                    isCurrent
                      ? 'text-blue-700 font-bold'
                      : isCompleted
                      ? 'text-slate-700'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting Bar */}
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-1 -mt-5 transition-all duration-200 ${
                    stepNumber < currentStep ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressStepper;
