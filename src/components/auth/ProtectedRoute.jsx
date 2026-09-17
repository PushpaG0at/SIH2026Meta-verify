import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AccessDeniedPage from '../../pages/auth/AccessDeniedPage';
import LoadingState from '../ui/LoadingState';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, role, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <LoadingState title="Verifying authorization..." message="Checking credentials and security session" />
      </div>
    );
  }

  // If not authenticated, redirect to login for this role or portal entry
  if (!isAuthenticated || !user) {
    const defaultPortalRole = allowedRoles[0]?.toLowerCase() || 'business';
    return (
      <Navigate
        to={`/login?role=${defaultPortalRole}`}
        state={{ from: location }}
        replace
      />
    );
  }

  // Normalize user's actual stored role
  const userRole = (user.role || role || '').toUpperCase();
  const normalizedAllowed = allowedRoles.map((r) => r.toUpperCase());

  // Check if account has authorized role for this route
  if (normalizedAllowed.length > 0 && !normalizedAllowed.includes(userRole)) {
    // Intercept unauthorized cross-role access / direct URL attack
    return <AccessDeniedPage attemptedRole={allowedRoles[0]} />;
  }

  return children;
};

export default ProtectedRoute;
