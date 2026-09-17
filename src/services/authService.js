import apiClient from './api';
import { MOCK_USERS } from '../utils/mockData';

export const authService = {
  /**
   * Real API login via POST /auth/login
   */
  async login(email, password) {
    const cleanEmail = email?.trim()?.toLowerCase();
    try {
      const res = await apiClient.post('/auth/login', {
        email: cleanEmail,
        password: password
      });

      if (res.data?.token) {
        localStorage.setItem('mv_auth_token', res.data.token);
      }
      if (res.data?.user) {
        const upperRole = (res.data.user.role || 'BUSINESS').toUpperCase();
        const userObj = {
          ...res.data.user,
          role: upperRole,
          authenticated: true
        };
        localStorage.setItem('mv_user_role', upperRole);
        localStorage.setItem('mv_user', JSON.stringify(userObj));

        return {
          token: res.data.token,
          user: userObj,
          message: res.data.message
        };
      }

      throw new Error('Invalid response from authentication server');
    } catch (error) {
      // Backend responded with HTTP status code
      if (error.response) {
        const status = error.response.status;
        const serverMsg = error.response.data?.error || error.response.data?.message;

        if (status === 401) {
          throw new Error(serverMsg || 'Invalid credentials. Please verify your email and password.');
        }

        if (status === 403) {
          throw new Error(serverMsg || 'Access forbidden: You do not have permission to access this resource.');
        }

        if (status >= 500) {
          throw new Error(serverMsg || 'Server error: The authentication server encountered an internal issue. Please try again later.');
        }

        if (serverMsg) {
          throw new Error(serverMsg);
        }
      }

      // No response received (backend offline, wrong port, network error, or CORS blocked)
      if (error.code === 'ECONNABORTED' || error.message?.toLowerCase().includes('timeout')) {
        throw new Error('Request timeout: The authentication server took too long to respond.');
      }

      if (!error.response || error.code === 'ERR_NETWORK' || error.message?.toLowerCase().includes('network error')) {
        throw new Error('Backend unavailable: Unable to connect to the authentication server. Please ensure the backend is running on http://localhost:5000.');
      }

      throw new Error(error.normalizedMessage || error.message || 'Authentication failed. Please verify your credentials and try again.');
    }
  },

  /**
   * Real API registration via POST /auth/register
   */
  async register({ name, email, phone, password, role = 'BUSINESS', orgName, licenseNo }) {
    const assignedRole = (role || 'BUSINESS').toUpperCase();
    const cleanEmail = email?.trim()?.toLowerCase();
    const cleanName = name?.trim();
    const cleanPhone = phone?.trim();

    try {
      const res = await apiClient.post('/auth/register', {
        name: cleanName,
        email: cleanEmail,
        password,
        phone: cleanPhone,
        role: assignedRole,
        orgName: orgName?.trim(),
        licenseNo: licenseNo?.trim()
      });

      const userRole = (res.data?.user?.role || assignedRole).toUpperCase();
      const userObj = {
        ...res.data.user,
        role: userRole,
        authenticated: true
      };

      if (res.data?.token) {
        localStorage.setItem('mv_auth_token', res.data.token);
      }
      localStorage.setItem('mv_user_role', userRole);
      localStorage.setItem('mv_user', JSON.stringify(userObj));

      return {
        token: res.data?.token,
        user: userObj,
        role: userRole,
        message: res.data?.message || 'User registered successfully'
      };
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const serverMsg = error.response.data?.error || error.response.data?.message;

        if (status === 409 || serverMsg?.toLowerCase().includes('already exists')) {
          throw new Error('An account with this email already exists. Please sign in instead.');
        }

        if (status === 400 && serverMsg) {
          throw new Error(serverMsg);
        }

        if (status === 503 || status === 502 || status === 504) {
          throw new Error('Registration service is currently unavailable. Please try again.');
        }

        if (status === 500) {
          throw new Error('Something went wrong while creating your account.');
        }

        if (serverMsg) {
          throw new Error(serverMsg);
        }
      }

      // Network / connection errors
      if (error.code === 'ECONNABORTED' || error.message?.toLowerCase().includes('timeout')) {
        throw new Error('Registration service is currently unavailable. Please try again.');
      }

      if (!error.response || error.code === 'ERR_NETWORK') {
        throw new Error('Unable to connect to the registration service.');
      }

      throw new Error(error.message || 'Something went wrong while creating your account.');
    }
  },

  /**
   * Fetch current authenticated profile via GET /auth/me
   */
  async getCurrentUser() {
    const token = localStorage.getItem('mv_auth_token');
    if (!token) return null;

    try {
      const res = await apiClient.get('/auth/me');
      const serverUser = res.data?.user;
      if (serverUser) {
        const normalizedRole = (serverUser.role || 'BUSINESS').toUpperCase();
        const enriched = {
          ...serverUser,
          role: normalizedRole,
          authenticated: true
        };
        localStorage.setItem('mv_user', JSON.stringify(enriched));
        localStorage.setItem('mv_user_role', normalizedRole);
        return enriched;
      }
      return null;
    } catch (error) {
      const savedUser = localStorage.getItem('mv_user');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed && parsed.role) {
            return {
              ...parsed,
              role: parsed.role.toUpperCase(),
              authenticated: true
            };
          }
        } catch {
          return null;
        }
      }
      return null;
    }
  },

  /**
   * Retrieve pre-seeded live demo accounts with valid JWTs from GET /auth/demo-accounts
   */
  async getDemoAccounts() {
    try {
      const res = await apiClient.get('/auth/demo-accounts');
      return res.data?.accounts || null;
    } catch (error) {
      return null;
    }
  },

  /**
   * Logout and clear local session state
   */
  async logout() {
    try {
      await apiClient.post('/auth/logout').catch(() => {});
    } finally {
      localStorage.removeItem('mv_auth_token');
      localStorage.removeItem('mv_user');
      localStorage.removeItem('mv_user_role');
    }
  }
};

export default authService;
