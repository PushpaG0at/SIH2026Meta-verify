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

// Response interceptor: handle errors and categorize them clearly
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    let category = 'UNKNOWN_ERROR';
    let friendlyMessage = 'An unexpected error occurred. Please try again.';

    if (!error.response) {
      // No response from server (server down, wrong port, offline, or CORS failure)
      if (error.code === 'ECONNABORTED' || error.message?.toLowerCase().includes('timeout')) {
        category = 'TIMEOUT';
        friendlyMessage = 'Request timed out. The server took too long to respond.';
      } else {
        category = 'BACKEND_UNAVAILABLE';
        friendlyMessage = 'Backend service offline. Running in seamless offline/demonstration mode.';
      }
      console.warn(`[METRA-VERIFY API] ${category}:`, error.message);
    } else {
      const serverMessage = error.response.data?.error || error.response.data?.message;

      if (status === 401) {
        category = 'INVALID_CREDENTIALS';
        friendlyMessage = serverMessage || 'Invalid credentials: The email or password you entered is incorrect.';
        console.warn('[METRA-VERIFY Auth] 401 Unauthorized:', friendlyMessage);

        const hadToken = Boolean(localStorage.getItem('mv_auth_token'));
        localStorage.removeItem('mv_auth_token');

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
        category = 'FORBIDDEN';
        friendlyMessage = serverMessage || 'Access forbidden: You do not have permission for this action.';
        console.warn('[METRA-VERIFY Auth] 403 Forbidden:', friendlyMessage);

        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('metra:auth:forbidden', {
              detail: { message: friendlyMessage, status: 403 },
            })
          );
        }
      } else if (status >= 500) {
        category = 'SERVER_ERROR';
        friendlyMessage = serverMessage || 'Server error: The server encountered an internal issue. Please try again later.';
        console.error('[METRA-VERIFY API] 5xx Server Error:', serverMessage || error.message);
      } else if (status === 400) {
        category = 'VALIDATION_ERROR';
        friendlyMessage = serverMessage || 'Bad request: Please verify the submitted information.';
      } else if (status === 409) {
        category = 'CONFLICT';
        friendlyMessage = serverMessage || 'A conflict occurred with an existing resource.';
      } else {
        friendlyMessage = serverMessage || error.message || friendlyMessage;
      }
    }

    error.category = category;
    error.normalizedMessage = friendlyMessage;
    // Also override error.message so if thrown directly, the user-friendly message is shown
    error.message = friendlyMessage;

    return Promise.reject(error);
  }
);

export default apiClient;
