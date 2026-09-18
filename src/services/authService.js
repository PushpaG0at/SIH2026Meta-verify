import apiClient from './api';
import { MOCK_USERS } from '../utils/mockData';

/**
 * Persists registered / active users in a local registry so each unique email
 * always keeps its distinct identity and personalized name across sessions.
 */
export function saveRegisteredUser(userObj) {
  if (!userObj || !userObj.email) return;
  try {
    const raw = localStorage.getItem('mv_registered_users');
    const registry = raw ? JSON.parse(raw) : {};
    registry[userObj.email.trim().toLowerCase()] = {
      ...userObj,
      email: userObj.email.trim().toLowerCase()
    };
    localStorage.setItem('mv_registered_users', JSON.stringify(registry));
  } catch (e) {
    console.warn('[authService] Failed to persist user in registry:', e);
  }
}

export function getStoredUserByEmail(email) {
  if (!email) return null;
  try {
    const raw = localStorage.getItem('mv_registered_users');
    if (!raw) return null;
    const registry = JSON.parse(raw);
    return registry[email.trim().toLowerCase()] || null;
  } catch {
    return null;
  }
}

/**
 * Formats a clean, professional human name dynamically from an email handle
 * e.g. "pushpendra.singh@gmail.com" -> "Pushpendra Singh"
 * e.g. "arun_kumar@yahoo.com" -> "Arun Kumar"
 * e.g. "kavita@state.gov.in" -> "Kavita"
 */
export function formatNameFromEmail(email, role = 'BUSINESS') {
  if (!email) return '';
  if (email.toLowerCase().includes('pushpendra') || email.toLowerCase().includes('puhspagoat')) {
    return 'Pushpendra Singh';
  }
  const localPart = email.split('@')[0];
  const cleaned = localPart.replace(/[._\-+]/g, ' ');
  const words = cleaned
    .split(/\s+/)
    .map((w) => w.replace(/\d+/g, ''))
    .filter(Boolean);

  if (words.length === 0) {
    return localPart.charAt(0).toUpperCase() + localPart.slice(1);
  }

  return words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Resolves a personalized demo user profile for offline/demonstration mode.
 * Dynamically customizes names for Businessman, Inspector, and Officer based on
 * the actual email or explicit custom name provided.
 */
export function getDemoUser(email, roleHint, customName = null) {
  const cleanEmail = (email || '').trim().toLowerCase();

  // Explicit recognition for primary user Pushpendra Singh
  if (cleanEmail.includes('pushpendra') || cleanEmail.includes('puhspagoat')) {
    let role = (roleHint || '').toUpperCase();
    if (!role || !['BUSINESS', 'INSPECTOR', 'OFFICER', 'ADMIN'].includes(role)) {
      role = 'BUSINESS';
    }
    const pushpaUser = {
      id: 'usr_pushpa_01',
      name: (customName && customName.trim()) ? customName.trim() : 'Pushpendra Singh',
      email: cleanEmail,
      username: 'singhpushpendra95734_db_user',
      role,
      phone: '+91 95734 00000',
      orgName: 'Singh Legal Metrology & Enterprise Tech',
      licenseNo: '07AAAPS95734Z1',
      gstin: '07AAAPS95734Z1',
      address: 'Plot 24, Cyber Park & Logistics Complex, Sector 18, New Delhi - 110001',
      authenticated: true
    };
    saveRegisteredUser(pushpaUser);
    return pushpaUser;
  }

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

  // 1. Check if user already exists in persistent local registry
  const existingUser = getStoredUserByEmail(cleanEmail);
  if (existingUser) {
    const userRole = (role || existingUser.role || 'BUSINESS').toUpperCase();
    const finalName = (customName && customName.trim()) ? customName.trim() : existingUser.name;
    const updated = {
      ...existingUser,
      name: finalName,
      role: userRole,
      authenticated: true
    };
    saveRegisteredUser(updated);
    return updated;
  }

  // 2. Resolve display name: custom name > derived from email > role default preset
  let resolvedName = (customName || '').trim();

  const isGenericPresetEmail = (
    cleanEmail === 'business@metra-demo.in' ||
    cleanEmail === 'inspector@metra-demo.in' ||
    cleanEmail === 'officer@metra-demo.in' ||
    cleanEmail === 'ramesh@kirana.in' ||
    !cleanEmail
  );

  if (!resolvedName && !isGenericPresetEmail) {
    resolvedName = formatNameFromEmail(cleanEmail, role);
  }

  // Hash-based unique ID generator so same email always gets same ID
  const hashId = cleanEmail
    ? Math.abs(cleanEmail.split('').reduce((acc, char) => ((acc << 5) - acc) + char.charCodeAt(0), 0)) % 900000 + 100000
    : '01';

  // 3. Pre-configured or dynamically created profile for BUSINESS
  if (role === 'BUSINESS') {
    const defaultName = cleanEmail === 'ramesh@kirana.in' ? 'Ramesh Kumar' : (resolvedName || 'Ramesh Kumar');
    const userObj = {
      id: `usr_biz_${hashId}`,
      name: defaultName,
      email: cleanEmail || 'business@metra-demo.in',
      role: 'BUSINESS',
      phone: '+91 98112 34567',
      orgName: `${defaultName}'s Trading Co.`,
      licenseNo: `07AAB${cleanEmail ? cleanEmail.slice(0, 4).toUpperCase().replace(/[^A-Z]/g, 'X') : 'METR'}1Z5`,
      address: 'Shop 42, Central Mandi Market, Sector 18, New Delhi',
      authenticated: true
    };
    saveRegisteredUser(userObj);
    return userObj;
  }

  // 4. Pre-configured or dynamically created profile for INSPECTOR
  if (role === 'INSPECTOR') {
    let defaultName = resolvedName;
    if (!defaultName) {
      defaultName = 'Insp. Vikram Sharma';
    } else if (!defaultName.toLowerCase().startsWith('insp') && !defaultName.toLowerCase().startsWith('inspector')) {
      defaultName = `Insp. ${defaultName}`;
    }

    const userObj = {
      id: `usr_insp_${hashId}`,
      name: defaultName,
      email: cleanEmail || 'inspector@metra-demo.in',
      role: 'INSPECTOR',
      phone: '+91 94120 12345',
      orgName: 'Legal Metrology Division (Zone 2, Central Delhi)',
      badgeNumber: `DL-LM-INS-${cleanEmail ? (cleanEmail.charCodeAt(0) * 17 % 900 + 100) : '042'}`,
      jurisdiction: 'Zone 2 - Central Delhi District',
      authenticated: true
    };
    saveRegisteredUser(userObj);
    return userObj;
  }

  // 5. Pre-configured or dynamically created profile for OFFICER
  if (role === 'OFFICER') {
    let defaultName = resolvedName || 'Shri R. Sen';

    const userObj = {
      id: `usr_off_${hashId}`,
      name: defaultName,
      email: cleanEmail || 'officer@metra-demo.in',
      role: 'OFFICER',
      phone: '+91 98100 54321',
      designation: 'Authorized Legal Metrology Verification Officer',
      orgName: 'Controllerate of Legal Metrology, Delhi State',
      licenseNo: `LMO-DL-${cleanEmail ? cleanEmail.slice(0, 4).toUpperCase().replace(/[^A-Z]/g, 'X') : 'SEN'}-01`,
      authenticated: true
    };
    saveRegisteredUser(userObj);
    return userObj;
  }

  // Generic fallback
  const finalFallbackName = resolvedName || 'Metra Administrator';
  const userObj = {
    id: `usr_${Date.now().toString().slice(-6)}`,
    name: finalFallbackName,
    email: cleanEmail || 'admin@metraverify.gov.in',
    role: role || 'BUSINESS',
    orgName: 'Legal Metrology Department',
    authenticated: true
  };
  saveRegisteredUser(userObj);
  return userObj;
}

export const authService = {
  /**
   * Real API login via POST /auth/login with seamless offline demonstration fallback
   */
  async login(email, password, expectedRole = null, customName = null) {
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
          name: customName?.trim() || res.data.user.name,
          role: upperRole,
          authenticated: true
        };
        saveRegisteredUser(userObj);
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

      const demoUser = getDemoUser(cleanEmail, expectedRole, customName);
      const demoToken = `mock_token_${demoUser.role.toLowerCase()}_${Date.now()}`;

      saveRegisteredUser(demoUser);
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

      saveRegisteredUser(userObj);

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

