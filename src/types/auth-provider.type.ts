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

export type {
  AuthProviderType,
  AuthProviderPath
}
