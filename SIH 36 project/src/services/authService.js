import apiClient from './api';
import { MOCK_USERS } from '../utils/mockData';

export const authService = {
  /**
   * Real API login via POST /auth/login
   */
  async login(email, password, role = 'business') {
    try {
      const res = await apiClient.post('/auth/login', {
        email: email?.trim(),
        password: password
      });

      if (res.data?.token) {
        localStorage.setItem('mv_auth_token', res.data.token);
      }
      if (res.data?.user) {
        const normalizedRole = (res.data.user.role || role).toLowerCase();
        localStorage.setItem('mv_user_role', normalizedRole);
        localStorage.setItem('mv_user', JSON.stringify({
          ...res.data.user,
          role: normalizedRole
        }));
      }

      return {
        token: res.data.token,
        user: {
          ...res.data.user,
          role: (res.data.user?.role || role).toLowerCase()
        },
        message: res.data.message
      };
    } catch (error) {
      // If backend responded with an error (e.g. 401 invalid credentials), rethrow normalized error
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }

      console.warn('[authService] Network login failed, falling back to local credentials profile:', error.message);
      const normalizedRole = role.toLowerCase();
      const user = MOCK_USERS[normalizedRole] || MOCK_USERS.business;
      const fakeToken = `mock_token_${normalizedRole}_${Date.now()}`;
      localStorage.setItem('mv_auth_token', fakeToken);
      localStorage.setItem('mv_user_role', normalizedRole);
      localStorage.setItem('mv_user', JSON.stringify(user));
      return { token: fakeToken, user };
    }
  },

  /**
   * Real API registration via POST /auth/register
   */
  async register({ name, email, phone, password, role = 'business', orgName, licenseNo }) {
    try {
      const res = await apiClient.post('/auth/register', {
        name: name?.trim(),
        email: email?.trim(),
        password,
        phone: phone?.trim(),
        role: role.toUpperCase(),
        orgName: orgName?.trim(),
        licenseNo: licenseNo?.trim()
      });

      if (res.data?.token) {
        localStorage.setItem('mv_auth_token', res.data.token);
      }
      if (res.data?.user) {
        const normalizedRole = (res.data.user.role || role).toLowerCase();
        localStorage.setItem('mv_user_role', normalizedRole);
        localStorage.setItem('mv_user', JSON.stringify({
          ...res.data.user,
          role: normalizedRole
        }));
      }

      return {
        token: res.data.token,
        user: res.data.user,
        message: res.data.message
      };
    } catch (error) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  },

  /**
   * Fetch current authenticated profile via GET /auth/me
   */
  async getCurrentUser() {
    try {
      const res = await apiClient.get('/auth/me');
      const serverUser = res.data?.user;
      if (serverUser) {
        const normalizedRole = (serverUser.role || 'business').toLowerCase();
        const enriched = {
          ...serverUser,
          role: normalizedRole
        };
        localStorage.setItem('mv_user', JSON.stringify(enriched));
        localStorage.setItem('mv_user_role', normalizedRole);
        return enriched;
      }
      return null;
    } catch (error) {
      const savedUser = localStorage.getItem('mv_user');
      const savedRole = localStorage.getItem('mv_user_role') || 'business';
      if (savedUser) {
        try {
          return JSON.parse(savedUser);
        } catch {
          return MOCK_USERS[savedRole] || MOCK_USERS.business;
        }
      }
      return MOCK_USERS[savedRole] || MOCK_USERS.business;
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
      console.warn('[authService] Could not fetch remote demo accounts:', error.message);
      return null;
    }
  },

  /**
   * Logout and clear local session state
   */
  async logout() {
    try {
      // Backend does not require server-side state logout for JWT, but notify if endpoint exists
      await apiClient.post('/auth/logout').catch(() => {});
    } finally {
      localStorage.removeItem('mv_auth_token');
      localStorage.removeItem('mv_user');
      localStorage.removeItem('mv_user_role');
    }
  }
};

export default authService;
