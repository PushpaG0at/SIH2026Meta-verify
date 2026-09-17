/**
 * Helper formatters for METRA-VERIFY
 */

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(d);
  } catch {
    return dateString;
  }
};

export const getStatusConfig = (status) => {
  const map = {
    APPROVED: { label: 'Approved', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    VERIFIED: { label: 'Verified', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    VALID: { label: 'Valid & Active', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    SUBMITTED: { label: 'Submitted', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    INSPECTION: { label: 'Under Inspection', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    INSPECTION_SCHEDULED: { label: 'Inspection Scheduled', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    OFFICER_REVIEW: { label: 'Officer Review', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    PENDING_REVIEW: { label: 'Pending Review', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    PENDING: { label: 'Pending', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    DRAFT: { label: 'Draft', color: 'bg-slate-100 text-slate-700 border-slate-300' },
    EXPIRED: { label: 'Expired', color: 'bg-amber-50 text-amber-800 border-amber-200' },
    REVOKED: { label: 'Revoked', color: 'bg-rose-50 text-rose-700 border-rose-200' },
    REJECTED: { label: 'Rejected', color: 'bg-rose-50 text-rose-700 border-rose-200' },
    HIGH: { label: 'High Priority', color: 'bg-rose-50 text-rose-700 border-rose-200' },
    MEDIUM: { label: 'Medium Priority', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    LOW: { label: 'Low Priority', color: 'bg-slate-100 text-slate-700 border-slate-300' }
  };
  return map[status] || { label: status, color: 'bg-slate-100 text-slate-700 border-slate-200' };
};

export const getRiskConfig = (level) => {
  switch (level?.toUpperCase()) {
    case 'LOW':
      return { label: 'Low Risk', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' };
    case 'MEDIUM':
      return { label: 'Medium Risk', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' };
    case 'HIGH':
      return { label: 'High Risk', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' };
    default:
      return { label: 'Unknown', bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', dot: 'bg-slate-400' };
  }
};
