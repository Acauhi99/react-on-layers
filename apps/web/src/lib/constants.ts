export const APP_CONFIG = {
  name: 'React on Layers',
  version: '1.0.0',
  description: 'Modern React app with TanStack',
} as const

export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
} as const

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
} as const