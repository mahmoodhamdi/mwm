/**
 * GitHub OAuth Configuration
 * إعدادات تسجيل الدخول بـ GitHub
 */

const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
const GITHUB_REDIRECT_URI =
  typeof window !== 'undefined' ? `${window.location.origin}/auth/github/callback` : '';

/**
 * Get GitHub OAuth authorization URL
 * الحصول على رابط تفويض GitHub
 */
export function getGitHubAuthUrl(): string {
  if (!GITHUB_CLIENT_ID) {
    throw new Error('GitHub Client ID is not configured');
  }

  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: GITHUB_REDIRECT_URI,
    scope: 'user:email',
    state: generateState(),
  });

  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

/**
 * Generate random state for CSRF protection
 * إنشاء حالة عشوائية للحماية من CSRF
 */
function generateState(): string {
  const state = Math.random().toString(36).substring(2, 15);
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('github_oauth_state', state);
  }
  return state;
}

/**
 * Verify state from callback
 * التحقق من الحالة من رابط الرجوع
 */
export function verifyState(state: string): boolean {
  if (typeof window === 'undefined') return false;
  const savedState = sessionStorage.getItem('github_oauth_state');
  sessionStorage.removeItem('github_oauth_state');
  return savedState === state;
}

/**
 * Initiate GitHub OAuth flow
 * بدء عملية تسجيل الدخول بـ GitHub
 */
export function initiateGitHubAuth(): void {
  const authUrl = getGitHubAuthUrl();
  window.location.href = authUrl;
}

const githubOAuth = {
  getGitHubAuthUrl,
  verifyState,
  initiateGitHubAuth,
};

export default githubOAuth;
