const constants = {
  DEFAULT_HOME: '/SunnyHome',
  TOKEN: 'auth',
  CONTEXT_PATH: '/sunny',
} as const

export type Constants = typeof constants
export default constants
