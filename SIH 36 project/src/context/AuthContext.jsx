import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { MOCK_USERS } from '../utils/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(() => localStorage.getItem('mv_user_role') || 'business');
  const [loading, setLoading] = useState(true);
  const [demoAccounts, setDemoAccounts] = useState(null);

  // Initialize session from real API if token exists, or cached storage
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const token = localStorage.getItem('mv_auth_token');
        const storedRole = (localStorage.getItem('mv_user_role') || 'business').toLowerCase();

        // 1. Preload real demo accounts from backend for rapid testing
        authService.getDemoAccounts().then((accounts) => {
          if (isMounted && accounts) {
            setDemoAccounts(accounts);
          }
        }).catch(() => {});

        // 2. If token exists, verify with backend /auth/me
        if (token && !token.startsWith('mock_token_')) {
          try {
            const serverUser = await authService.getCurrentUser();
            if (isMounted && serverUser) {
              setUser(serverUser);
              setRole((serverUser.role || storedRole).toLowerCase());
              return;
            }
          } catch (verifyErr) {
            console.warn('[AuthContext] Stored token verification failed:', verifyErr.message);
          }
        }

        // 3. Fallback to cached user profile
        const storedUser = localStorage.getItem('mv_user');
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            if (isMounted) {
              setUser(parsed);
              if (parsed.role) {
                setRole(parsed.role.toLowerCase());
              }
            }
            return;
          } catch {
            // ignore parse error
          }
        }

        // 4. Default to business role preset
        const defaultUser = MOCK_USERS[storedRole] || MOCK_USERS.business;
        if (isMounted) {
          setUser(defaultUser);
          setRole(storedRole);
        }
      } catch (e) {
        console.error('[AuthContext] Initialization error:', e);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    // 5. Global listener for 401/403 Axios interceptor events
    const handleUnauthorized = (e) => {
      console.warn('[AuthContext] Received 401 Unauthorized event:', e.detail?.message);
      setUser(null);
      setRole('business');
    };

    const handleForbidden = (e) => {
      console.warn('[AuthContext] Received 403 Forbidden event:', e.detail?.message);
    };

    window.addEventListener('metra:auth:unauthorized', handleUnauthorized);
    window.addEventListener('metra:auth:forbidden', handleForbidden);

    return () => {
      isMounted = false;
      window.removeEventListener('metra:auth:unauthorized', handleUnauthorized);
      window.removeEventListener('metra:auth:forbidden', handleForbidden);
    };
  }, []);

  /**
   * Real API login
   */
  const login = async (email, password, selectedRole = 'business') => {
    setLoading(true);
    try {
      const result = await authService.login(email, password, selectedRole);
      const activeUser = result.user;
      const normalizedRole = (activeUser.role || selectedRole).toLowerCase();

      setUser(activeUser);
      setRole(normalizedRole);

      return { success: true, user: activeUser, role: normalizedRole };
    } catch (err) {
      console.error('[AuthContext] Login error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Real API registration
   */
  const register = async (payload) => {
    setLoading(true);
    try {
      const result = await authService.register(payload);
      const activeUser = result.user;
      const normalizedRole = (activeUser.role || payload.role || 'business').toLowerCase();

      setUser(activeUser);
      setRole(normalizedRole);

      return { success: true, user: activeUser, role: normalizedRole };
    } catch (err) {
      console.error('[AuthContext] Registration error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout
   */
  const logout = async () => {
    await authService.logout();
    setUser(null);
    setRole('business');
  };

  /**
   * Instant Role Switcher using real backend Demo Accounts when available
   */
  const switchRole = useCallback(
    (newRole) => {
      const normalizedRole = newRole.toLowerCase();
      const upperRole = newRole.toUpperCase();

      // Check if backend demo accounts has a real JWT for this role
      if (demoAccounts && demoAccounts[upperRole]) {
        const demoAcc = demoAccounts[upperRole];
        localStorage.setItem('mv_auth_token', demoAcc.token);
        localStorage.setItem('mv_user_role', normalizedRole);
        localStorage.setItem(
          'mv_user',
          JSON.stringify({
            ...demoAcc,
            role: normalizedRole
          })
        );
        setUser({
          ...demoAcc,
          role: normalizedRole
        });
        setRole(normalizedRole);
        return;
      }

      // Fallback to preset mock user
      const fallbackUser = MOCK_USERS[normalizedRole] || MOCK_USERS.business;
      setUser(fallbackUser);
      setRole(normalizedRole);
      localStorage.setItem('mv_user_role', normalizedRole);
      localStorage.setItem('mv_user', JSON.stringify(fallbackUser));
    },
    [demoAccounts]
  );

  const value = {
    user,
    role,
    loading,
    demoAccounts,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
    switchRole
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
