import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach bearer JWT token and demo role fallback
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mv_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const currentRole = localStorage.getItem('mv_user_role');
    if (currentRole) {
      config.headers['X-Demo-Role'] = currentRole.toUpperCase();
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 (Expired JWT / Unauthorized) & 403 (Forbidden)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred';

    // Attach normalized error message for clean consumption in services
    error.normalizedMessage = errorMessage;

    if (status === 401) {
      console.warn('[METRA-VERIFY Auth] 401 Unauthorized / Expired JWT encountered:', errorMessage);

      // Clear expired authentication state
      const hadToken = Boolean(localStorage.getItem('mv_auth_token'));
      localStorage.removeItem('mv_auth_token');

      // Dispatch event for UI / AuthContext to react without hard reload
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('metra:auth:unauthorized', {
            detail: {
              message: hadToken
                ? 'Your session has expired. Please sign in again.'
                : 'Authentication required to access this resource.',
              status: 401,
            },
          })
        );

        // If on a private route, redirect to login with query param
        const pathname = window.location.pathname;
        const isPublicPath =
          pathname === '/' ||
          pathname.startsWith('/login') ||
          pathname.startsWith('/register') ||
          pathname.startsWith('/verify') ||
          pathname.startsWith('/how-it-works');

        if (!isPublicPath && hadToken) {
          window.location.href = `/login?session=expired&redirect=${encodeURIComponent(pathname)}`;
        }
      }
    } else if (status === 403) {
      console.warn('[METRA-VERIFY Auth] 403 Forbidden:', errorMessage);

      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('metra:auth:forbidden', {
            detail: {
              message: errorMessage || 'Access forbidden: You do not have permission for this action.',
              status: 403,
            },
          })
        );
      }
    } else if (!error.response) {
      console.info('[METRA-VERIFY Network] Backend server not reachable or offline. Fallback may be used.');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
