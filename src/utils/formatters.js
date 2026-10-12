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

export const getStatusConfig = (status, isHindi = false) => {
  const map = {
    APPROVED: { label: isHindi ? 'स्वीकृत' : 'Approved', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    OFFICER_APPROVED: { label: isHindi ? 'अधिकारी द्वारा स्वीकृत' : 'Officer Approved', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    VERIFIED: { label: isHindi ? 'सत्यापित' : 'Verified', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    VALID: { label: isHindi ? 'वैध एवं सक्रिय' : 'Valid & Active', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    SUBMITTED: { label: isHindi ? 'प्रस्तुत' : 'Submitted', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    AI_REVIEWED: { label: isHindi ? 'एआई प्री-चेक्ड' : 'AI Pre-Checked', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
    INSPECTION: { label: isHindi ? 'निरीक्षणाधीन' : 'Under Inspection', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    INSPECTION_ASSIGNED: { label: isHindi ? 'निरीक्षक नियुक्त' : 'Inspector Assigned', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    INSPECTION_SCHEDULED: { label: isHindi ? 'निरीक्षण निर्धारित' : 'Inspection Scheduled', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    INSPECTION_COMPLETED: { label: isHindi ? 'निरीक्षण पूर्ण' : 'Inspection Completed', color: 'bg-violet-50 text-violet-700 border-violet-200' },
    OFFICER_REVIEW: { label: isHindi ? 'अधिकारी समीक्षा' : 'Officer Review', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    PENDING_REVIEW: { label: isHindi ? 'समीक्षा लंबित' : 'Pending Review', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    PENDING: { label: isHindi ? 'लंबित' : 'Pending', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    ASSIGNED: { label: isHindi ? 'आवंटित' : 'Assigned', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    COMPLETED: { label: isHindi ? 'पूर्ण' : 'Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    CORRECTION_REQUESTED: { label: isHindi ? 'सुधार अनुरोधित' : 'Correction Requested', color: 'bg-amber-50 text-amber-800 border-amber-200' },
    RETURNED_FOR_REINSPECTION: { label: isHindi ? 'पुनर्निरीक्षण हेतु वापस' : 'Returned for Re-Inspection', color: 'bg-amber-50 text-amber-800 border-amber-200' },
    DRAFT: { label: isHindi ? 'प्रारूप' : 'Draft', color: 'bg-slate-100 text-slate-700 border-slate-300' },
    UNVERIFIED: { label: isHindi ? 'असत्यापित' : 'Unverified', color: 'bg-slate-100 text-slate-600 border-slate-300' },
    EXPIRED: { label: isHindi ? 'समाप्त' : 'Expired', color: 'bg-amber-50 text-amber-800 border-amber-200' },
    REVOKED: { label: isHindi ? 'रद्द' : 'Revoked', color: 'bg-rose-50 text-rose-700 border-rose-200' },
    REJECTED: { label: isHindi ? 'अस्वीकृत' : 'Rejected', color: 'bg-rose-50 text-rose-700 border-rose-200' },
    OFFICER_REJECTED: { label: isHindi ? 'अधिकारी द्वारा अस्वीकृत' : 'Officer Rejected', color: 'bg-rose-50 text-rose-700 border-rose-200' },
    FLAGGED: { label: isHindi ? 'चिह्नित' : 'Flagged', color: 'bg-rose-50 text-rose-700 border-rose-200' },
    HIGH: { label: isHindi ? 'उच्च प्राथमिकता' : 'High Priority', color: 'bg-rose-50 text-rose-700 border-rose-200' },
    MEDIUM: { label: isHindi ? 'मध्यम प्राथमिकता' : 'Medium Priority', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    LOW: { label: isHindi ? 'निम्न प्राथमिकता' : 'Low Priority', color: 'bg-slate-100 text-slate-700 border-slate-300' },
    NORMAL: { label: isHindi ? 'सामान्य' : 'Normal', color: 'bg-slate-100 text-slate-700 border-slate-300' }
  };
  return map[status] || { label: status?.replace(/_/g, ' ') || 'Unknown', color: 'bg-slate-100 text-slate-700 border-slate-200' };
};

export const getRiskConfig = (level, isHindi = false) => {
  switch (level?.toUpperCase()) {
    case 'LOW':
      return { label: isHindi ? 'कम जोखिम' : 'Low Risk', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' };
    case 'MEDIUM':
      return { label: isHindi ? 'मध्यम जोखिम' : 'Medium Risk', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' };
    case 'HIGH':
      return { label: isHindi ? 'उच्च जोखिम' : 'High Risk', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' };
    default:
      return { label: isHindi ? 'अज्ञात' : 'Unknown', bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', dot: 'bg-slate-400' };
  }
};
