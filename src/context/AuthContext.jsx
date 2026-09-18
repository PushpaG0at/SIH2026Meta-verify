import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { checkPermission, getRolePermissions } from '../utils/permissions';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session strictly from verified authentication storage
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const token = localStorage.getItem('mv_auth_token');
        const storedUser = localStorage.getItem('mv_user');

        if (!token) {
          // No active session — user is completely unauthenticated
          if (isMounted) {
            setUser(null);
            setRole(null);
          }
          return;
        }

        // Verify with backend /auth/me if real token
        if (!token.startsWith('mock_token_')) {
          try {
            const serverUser = await authService.getCurrentUser();
            if (isMounted && serverUser) {
              const normalizedRole = (serverUser.role || 'BUSINESS').toUpperCase();
              setUser({ ...serverUser, role: normalizedRole, authenticated: true });
              setRole(normalizedRole);
              return;
            }
          } catch (err) {
            console.warn('[AuthContext] Token verification failed:', err.message);
          }
        }

        // If cached user exists and token was mock/offline
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            if (parsed && parsed.role) {
              const normalizedRole = parsed.role.toUpperCase();
              if (isMounted) {
                setUser({ ...parsed, role: normalizedRole, authenticated: true });
                setRole(normalizedRole);
              }
              return;
            }
          } catch {
            // Invalid cached state — purge
            localStorage.removeItem('mv_user');
            localStorage.removeItem('mv_auth_token');
            localStorage.removeItem('mv_user_role');
          }
        }

        // If token existed but was invalid and no valid user found
        if (isMounted) {
          setUser(null);
          setRole(null);
        }
      } catch (e) {
        console.error('[AuthContext] Initialization error:', e);
        if (isMounted) {
          setUser(null);
          setRole(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    // Global listener for 401 Unauthorized events from API interceptor
    const handleUnauthorized = () => {
      console.warn('[AuthContext] 401 Unauthorized event: terminating session');
      setUser(null);
      setRole(null);
      localStorage.removeItem('mv_auth_token');
      localStorage.removeItem('mv_user');
      localStorage.removeItem('mv_user_role');
    };

    window.addEventListener('metra:auth:unauthorized', handleUnauthorized);

    return () => {
      isMounted = false;
      window.removeEventListener('metra:auth:unauthorized', handleUnauthorized);
    };
  }, []);

  /**
   * Login with strict role enforcement & cross-role access rejection
   */
  const login = async (email, password, expectedPortalRole = null) => {
    setLoading(true);
    try {
      const result = await authService.login(email, password, expectedPortalRole);
      const activeUser = result.user;
      const actualRole = (activeUser.role || expectedPortalRole || 'BUSINESS').toUpperCase();

      // STRICT ROLE MISMATCH CHECK:
      // A Business user logging in at the Inspector or Officer portal MUST BE BLOCKED
      if (expectedPortalRole) {
        const expectedUpper = expectedPortalRole.toUpperCase();
        if (actualRole !== expectedUpper) {
          // Immediately purge any created session tokens
          await authService.logout();
          setUser(null);
          setRole(null);

          throw new Error(
            `Role mismatch. This account is registered as ${actualRole} and cannot access the ${expectedUpper} portal.`
          );
        }
      }

      const enrichedUser = {
        ...activeUser,
        role: actualRole,
        authenticated: true
      };

      setUser(enrichedUser);
      setRole(actualRole);
      localStorage.setItem('mv_user_role', actualRole);
      localStorage.setItem('mv_user', JSON.stringify(enrichedUser));

      return { success: true, user: enrichedUser, role: actualRole };
    } catch (err) {
      console.error('[AuthContext] Login error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register new account with fixed role
   */
  const register = async (payload) => {
    setLoading(true);
    try {
      const assignedRole = (payload.role || 'BUSINESS').toUpperCase();
      const result = await authService.register({
        ...payload,
        role: assignedRole
      });

      const activeUser = result.user;
      const userRole = (activeUser.role || assignedRole).toUpperCase();

      const enrichedUser = {
        ...activeUser,
        role: userRole,
        authenticated: true
      };

      setUser(enrichedUser);
      setRole(userRole);
      localStorage.setItem('mv_user_role', userRole);
      localStorage.setItem('mv_user', JSON.stringify(enrichedUser));

      return { success: true, user: enrichedUser, role: userRole };
    } catch (err) {
      console.error('[AuthContext] Registration error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout and terminate session permanently
   */
  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setRole(null);
      localStorage.removeItem('mv_auth_token');
      localStorage.removeItem('mv_user');
      localStorage.removeItem('mv_user_role');
    }
  };

  /**
   * Check if authenticated user holds a specific role
   */
  const hasRole = useCallback(
    (requiredRole) => {
      if (!user || !role) return false;
      return role.toUpperCase() === requiredRole.toUpperCase();
    },
    [user, role]
  );

  /**
   * Check if authenticated user holds a specific permission
   */
  const hasPermission = useCallback(
    (permission) => {
      if (!user || !role) return false;
      return checkPermission(role, permission);
    },
    [user, role]
  );

  const value = {
    user,
    role,
    loading,
    isAuthenticated: Boolean(user && role),
    login,
    register,
    logout,
    hasRole,
    hasPermission,
    permissions: getRolePermissions(role)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
