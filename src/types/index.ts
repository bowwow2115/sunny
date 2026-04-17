export interface Child {
  id?: number | string
  name?: string
  birthday?: string
  gender?: string
  classId?: number | string
  className?: string
  parentId?: number | string
  [key: string]: any
}

export interface Parent {
  id?: number | string
  name?: string
  phone?: string
  relation?: string
  childId?: number | string
  [key: string]: any
}

export interface Ride {
  id?: number | string
  name?: string
  startTime?: string
  endTime?: string
  type?: string
  [key: string]: any
}

export interface ChildRide {
  id?: number | string
  childId?: number | string
  rideId?: number | string
  meetingLocationId?: number | string
  [key: string]: any
}

export interface MeetingLocation {
  id?: number | string
  name?: string
  address?: string
  [key: string]: any
}

export interface ClassInfo {
  id?: number | string
  name?: string
  [key: string]: any
}

export interface User {
  id?: number | string
  userId?: string
  name?: string
  authority?: string
  roles?: Array<{ authority: string }>
  [key: string]: any
}

export interface ApiResponse<T = any> {
  code: string | number
  message?: string
  data: T
}

export interface LoginForm {
  userId: string
  password: string
}

export interface PasswordForm {
  userId: string
  currentPwd: string
  newPwd: string
}

export interface RootState {
  isLoading: boolean
  isAdmin: boolean
  userId: string
}

export interface SnackbarOptions {
  type?: 'success' | 'error' | 'info' | 'warning'
  message?: string
  duration?: number
  timeout?: number
}

export interface AlertOptions {
  type?: 'success' | 'error' | 'info' | 'warning'
  message?: string
  duration?: number
  timeout?: number
}

export interface ConfirmOptions {
  message?: string
  confirmText?: string
  cancelText?: string
  persistent?: boolean
}

export interface ErrorOptions {
  code?: string | number
  message?: string
}
