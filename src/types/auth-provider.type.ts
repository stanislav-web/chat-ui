/**
 * Authorization providers types
 * @type {string}
 * @const
 */
 type AuthProviderType = 'google' | 'facebook' | 'vk' | 'twitter' | 'apple' | 'github' | 'linkedin';

/**
 * Authorization providers types
 * @type {string}
 * @const
 */
 type AuthProviderPath = '/auth/google' | '/auth/facebook' | '/auth/vk' | '/auth/twitter' | '/auth/apple' | '/auth/github' | '/auth/linkedin';

/**
 * Authorization refresh
 * @type {string}
 * @const
 */
type RefreshTokenPath = '/auth/refresh';

/**
 * Logout
 * @type {string}
 * @const
 */
type LogoutPath = '/auth/logout';

export type {
  AuthProviderType,
  AuthProviderPath,
  RefreshTokenPath,
  LogoutPath
}
