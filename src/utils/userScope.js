/**
 * User Scoping & Multi-Tenancy Isolation Helper
 *
 * Ensures newly registered business owners start with a clean 0-state slate
 * and only view/manage instruments, applications, and certificates that belong to them.
 */

export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('mv_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isDemoSeedUser(user) {
  if (!user) return false;
  const email = (user.email || '').toLowerCase().trim();
  const id = user.id || '';
  // Only the pre-seeded static demo profiles should receive static synthetic mock lists
  return (
    id === 'usr_biz_01' ||
    email === 'business@metra-demo.in' ||
    email === 'rajesh@sharmatraders.com'
  );
}

export function getUserStorageKey(prefix, user) {
  const identifier = user?.id || user?.email || 'guest';
  return `${prefix}_${identifier}`;
}
