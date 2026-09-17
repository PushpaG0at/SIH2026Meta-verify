/**
 * Role-Based Access Control (RBAC) & Permissions Architecture
 * METRA-VERIFY Legal Metrology Platform
 */

export const ROLES = {
  BUSINESS: 'BUSINESS',
  INSPECTOR: 'INSPECTOR',
  OFFICER: 'OFFICER'
};

export const PERMISSIONS = {
  // Business Permissions
  VIEW_BUSINESS_DASHBOARD: 'VIEW_BUSINESS_DASHBOARD',
  MANAGE_INSTRUMENTS: 'MANAGE_INSTRUMENTS',
  CREATE_APPLICATION: 'CREATE_APPLICATION',
  VIEW_CERTIFICATES: 'VIEW_CERTIFICATES',

  // Inspector Permissions
  VIEW_INSPECTOR_DASHBOARD: 'VIEW_INSPECTOR_DASHBOARD',
  VIEW_ASSIGNED_INSPECTIONS: 'VIEW_ASSIGNED_INSPECTIONS',
  PERFORM_INSPECTION: 'PERFORM_INSPECTION',
  SUBMIT_INSPECTION_REPORT: 'SUBMIT_INSPECTION_REPORT',

  // Officer Permissions
  VIEW_OFFICER_DASHBOARD: 'VIEW_OFFICER_DASHBOARD',
  REVIEW_APPLICATIONS: 'REVIEW_APPLICATIONS',
  APPROVE_VERIFICATION: 'APPROVE_VERIFICATION',
  VIEW_COMPLIANCE_REPORTS: 'VIEW_COMPLIANCE_REPORTS'
};

export const ROLE_PERMISSIONS = {
  [ROLES.BUSINESS]: [
    PERMISSIONS.VIEW_BUSINESS_DASHBOARD,
    PERMISSIONS.MANAGE_INSTRUMENTS,
    PERMISSIONS.CREATE_APPLICATION,
    PERMISSIONS.VIEW_CERTIFICATES
  ],
  [ROLES.INSPECTOR]: [
    PERMISSIONS.VIEW_INSPECTOR_DASHBOARD,
    PERMISSIONS.VIEW_ASSIGNED_INSPECTIONS,
    PERMISSIONS.PERFORM_INSPECTION,
    PERMISSIONS.SUBMIT_INSPECTION_REPORT
  ],
  [ROLES.OFFICER]: [
    PERMISSIONS.VIEW_OFFICER_DASHBOARD,
    PERMISSIONS.REVIEW_APPLICATIONS,
    PERMISSIONS.APPROVE_VERIFICATION,
    PERMISSIONS.VIEW_COMPLIANCE_REPORTS
  ]
};

export const getRolePermissions = (role) => {
  if (!role) return [];
  const normalized = role.toUpperCase();
  return ROLE_PERMISSIONS[normalized] || [];
};

export const checkPermission = (userRole, permission) => {
  if (!userRole || !permission) return false;
  const permissions = getRolePermissions(userRole);
  return permissions.includes(permission);
};

export const getRoleDashboardPath = (role) => {
  if (!role) return '/';
  const normalized = role.toLowerCase();
  switch (normalized) {
    case 'business':
      return '/business/dashboard';
    case 'inspector':
      return '/inspector/dashboard';
    case 'officer':
      return '/officer/dashboard';
    default:
      return '/';
  }
};
