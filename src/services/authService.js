import apiClient from './api';
import { MOCK_USERS } from '../utils/mockData';

/**
 * Resolves a high-fidelity synthetic demo user profile for offline/demonstration mode
 */
function getDemoUser(email, roleHint) {
  const cleanEmail = (email || '').trim().toLowerCase();

  // Determine role
  let role = (roleHint || '').toUpperCase();
  if (!role || !['BUSINESS', 'INSPECTOR', 'OFFICER', 'ADMIN'].includes(role)) {
    if (cleanEmail.includes('inspector') || cleanEmail.includes('insp.')) {
      role = 'INSPECTOR';
    } else if (cleanEmail.includes('officer')) {
      role = 'OFFICER';
    } else if (cleanEmail.includes('admin')) {
      role = 'ADMIN';
    } else {
      role = 'BUSINESS';
    }
  }

  // Pre-configured profiles matching SIH test credentials
  if (role === 'BUSINESS') {
    if (cleanEmail === 'ramesh@kirana.in' || cleanEmail === 'business@metra-demo.in' || !cleanEmail) {
      return {
        id: 'usr_biz_01',
        name: 'Ramesh Kumar',
        email: cleanEmail || 'ramesh@kirana.in',
        role: 'BUSINESS',
        phone: '+91 98112 34567',
        orgName: 'Ramesh Kirana & General Stores',
        licenseNo: '07AAAAA0000A1Z5',
        address: 'Shop 42, Central Mandi Market, Sector 18, New Delhi',
        authenticated: true
      };
    }
    return {
      id: 'usr_biz_01',
      name: MOCK_USERS.business?.name || 'Rajesh Sharma',
      email: cleanEmail,
      role: 'BUSINESS',
      phone: MOCK_USERS.business?.phone || '+91 98765 43210',
      orgName: MOCK_USERS.business?.organization || 'Sharma Traders & Co.',
      licenseNo: MOCK_USERS.business?.registrationNumber || 'GSTIN07AAACS1429B1Z8',
      address: MOCK_USERS.business?.address || 'Central Market, New Delhi',
      authenticated: true
    };
  }

  if (role === 'INSPECTOR') {
    if (cleanEmail.includes('sharma') || cleanEmail === 'inspector@metra-demo.in' || !cleanEmail) {
      return {
        id: 'usr_insp_01',
        name: 'Insp. Vikram Sharma',
        email: cleanEmail || 'inspector.sharma@legalmetrology.gov.in',
        role: 'INSPECTOR',
        phone: '+91 94120 12345',
        orgName: 'Legal Metrology Division (Zone 2, Central Delhi)',
        badgeNumber: 'DL-LM-INS-042',
        jurisdiction: 'Zone 2 - Central Delhi District',
        authenticated: true
      };
    }
    return {
      id: 'usr_insp_02',
      name: MOCK_USERS.inspector?.name || 'Vikram Singh',
      email: cleanEmail,
      role: 'INSPECTOR',
      phone: MOCK_USERS.inspector?.phone || '+91 98111 22334',
      badgeNumber: MOCK_USERS.inspector?.badgeNumber || 'INSP-NZ-4082',
      jurisdiction: MOCK_USERS.inspector?.jurisdiction || 'Zone 4 - North Delhi Metro & Industrial Cluster',
      orgName: 'Legal Metrology Field Calibration Unit',
      authenticated: true
    };
  }

  if (role === 'OFFICER') {
    if (cleanEmail.includes('sen') || cleanEmail === 'officer@metra-demo.in' || !cleanEmail) {
      return {
        id: 'usr_off_01',
        name: 'Shri R. Sen',
        email: cleanEmail || 'officer.sen@legalmetrology.gov.in',
        role: 'OFFICER',
        phone: '+91 98100 54321',
        designation: 'Authorized Legal Metrology Verification Officer',
        orgName: 'Controllerate of Legal Metrology, Delhi State',
        licenseNo: 'LMO-DL-CONT-01',
        authenticated: true
      };
    }
    return {
      id: 'usr_off_03',
      name: MOCK_USERS.officer?.name || 'Dr. Anita Deshmukh',
      email: cleanEmail,
      role: 'OFFICER',
      phone: MOCK_USERS.officer?.phone || '+91 99200 88776',
      designation: MOCK_USERS.officer?.designation || 'Authorized Legal Metrology Verification Officer',
      orgName: MOCK_USERS.officer?.office || 'Directorate of Legal Metrology, State HQ',
      authenticated: true
    };
  }

  // Generic fallback
  const displayName = cleanEmail ? cleanEmail.split('@')[0].replace(/[._-]/g, ' ') : 'Administrator';
  const formattedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
  return {
    id: `usr_${Date.now().toString().slice(-6)}`,
    name: formattedName,
    email: cleanEmail || 'admin@metraverify.gov.in',
    role: role || 'BUSINESS',
    orgName: 'Legal Metrology Department',
    authenticated: true
  };
}

export const authService = {
  /**
   * Real API login via POST /auth/login with seamless offline demonstration fallback
   */
  async login(email, password, expectedRole = null) {
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
        const upperRole = (res.data.user.role || expectedRole || 'BUSINESS').toUpperCase();
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
      // Real backend response handling
      if (error.response) {
        const status = error.response.status;
        const serverMsg = error.response.data?.error || error.response.data?.message;

        if (status === 401) {
          throw new Error(serverMsg || 'Invalid credentials. Please verify your email and password.');
        }

        if (status === 403) {
          throw new Error(serverMsg || 'Access forbidden: You do not have permission to access this resource.');
        }

        if (status < 500 && serverMsg) {
          throw new Error(serverMsg);
        }
      }

      // Backend offline, network error, connection refused, or 500:
      // Seamlessly activate SIH demonstration mode
      console.warn('[authService] Backend offline or unreachable at http://localhost:5000. Activating seamless SIH Quick Demo session:', error.message);

      const demoUser = getDemoUser(cleanEmail, expectedRole);
      const demoToken = `mock_token_${demoUser.role.toLowerCase()}_${Date.now()}`;

      localStorage.setItem('mv_auth_token', demoToken);
      localStorage.setItem('mv_user_role', demoUser.role);
      localStorage.setItem('mv_user', JSON.stringify(demoUser));

      return {
        token: demoToken,
        user: demoUser,
        role: demoUser.role,
        message: 'Signed in successfully (Demonstration Mode)',
        isOfflineDemo: true
      };
    }
  },

  /**
   * Real API registration via POST /auth/register with offline demo fallback
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
      }

      // Backend offline or unreachable during registration:
      console.warn('[authService] Backend offline during registration, creating demo session:', error.message);
      const demoToken = `mock_token_${assignedRole.toLowerCase()}_${Date.now()}`;
      const userObj = {
        id: `usr_${Date.now().toString().slice(-6)}`,
        name: cleanName || 'Registered Enterprise',
        email: cleanEmail,
        phone: cleanPhone || '+91 98765 43210',
        role: assignedRole,
        orgName: orgName?.trim() || `${cleanName}'s Organization`,
        licenseNo: licenseNo?.trim() || 'REG-DL-2026-001',
        authenticated: true
      };

      localStorage.setItem('mv_auth_token', demoToken);
      localStorage.setItem('mv_user_role', assignedRole);
      localStorage.setItem('mv_user', JSON.stringify(userObj));

      return {
        token: demoToken,
        user: userObj,
        role: assignedRole,
        message: 'Account registered successfully (Demo Mode)',
        isOfflineDemo: true
      };
    }
  },

  /**
   * Fetch current authenticated profile via GET /auth/me
   */
  async getCurrentUser() {
    const token = localStorage.getItem('mv_auth_token');
    if (!token) return null;

    // Fast-path: If mock token, return cached user object without network failure
    if (token.startsWith('mock_token_')) {
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
          // fall through
        }
      }
    }

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
   * Retrieve pre-seeded live demo accounts
   */
  async getDemoAccounts() {
    try {
      const res = await apiClient.get('/auth/demo-accounts');
      if (res.data?.accounts && res.data.accounts.length > 0) {
        return res.data.accounts;
      }
    } catch (error) {
      // Backend offline
    }
    return [
      {
        role: 'BUSINESS',
        email: 'ramesh@kirana.in',
        name: 'Ramesh Kumar (Trader)',
        orgName: 'Ramesh Kirana & General Stores',
        licenseNo: '07AAAAA0000A1Z5'
      },
      {
        role: 'INSPECTOR',
        email: 'inspector.sharma@legalmetrology.gov.in',
        name: 'Insp. Vikram Sharma',
        orgName: 'Legal Metrology Division (Zone 2, Central Delhi)',
        licenseNo: 'DL-LM-INS-042'
      },
      {
        role: 'OFFICER',
        email: 'officer.sen@legalmetrology.gov.in',
        name: 'Shri R. Sen',
        orgName: 'Controllerate of Legal Metrology, Delhi State',
        licenseNo: 'LMO-DL-CONT-01'
      }
    ];
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

