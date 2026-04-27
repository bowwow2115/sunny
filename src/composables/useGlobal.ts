import { getCurrentInstance, inject, type Ref } from 'vue'
import type {
  AlertOptions,
  ConfirmOptions,
  ErrorOptions,
  SnackbarOptions,
} from '@/types'

interface SnackbarRefValue {
  showSnackbar: (opts: SnackbarOptions) => any
}
interface AlertRefValue {
  showAlert: (opts: AlertOptions) => any
}
interface ConfirmRefValue {
  showConfirm: (opts: ConfirmOptions) => Promise<boolean>
}

export function useGlobal() {
  const instance = getCurrentInstance()
  const globalProperties = instance?.appContext?.config?.globalProperties as
    | Record<string, any>
    | undefined

  const snackbarRef = inject<Ref<SnackbarRefValue | null> | null>(
    'snackbarRef',
    null
  )
  const alertRef = inject<Ref<AlertRefValue | null> | null>('alertRef', null)
  const confirmRef = inject<Ref<ConfirmRefValue | null> | null>(
    'confirmRef',
    null
  )

  const $showMessage = ({
    type = 'info',
    message = '',
    duration = 3000,
  }: SnackbarOptions = {}) => {
    if (snackbarRef?.value?.showSnackbar) {
      return snackbarRef.value.showSnackbar({
        type,
        message,
        timeout: duration,
      })
    }
    console.warn('[$showMessage] Snackbar ref not available')
    console.log(`[${(type as string).toUpperCase()}] ${message}`)
  }

  const $showAlert = ({
    type = 'info',
    message = '',
    duration = 2000,
  }: AlertOptions = {}) => {
    if (alertRef?.value?.showAlert) {
      return alertRef.value.showAlert({ type, message, timeout: duration })
    }
    console.warn('[$showAlert] Alert ref not available')
    console.log(`[${(type as string).toUpperCase()}] ${message}`)
  }

  const $showConfirm = ({
    message = '',
    confirmText = '확인',
    cancelText = '닫기',
    persistent = false,
  }: ConfirmOptions = {}): Promise<boolean> => {
    if (confirmRef?.value?.showConfirm) {
      return confirmRef.value.showConfirm({
        message,
        confirmText,
        cancelText,
        persistent,
      })
    }
    console.warn('[$showConfirm] Confirm ref not available')
    return Promise.resolve(window.confirm(message))
  }

  const $showError = (opts: ErrorOptions = {}) => {
    return globalProperties?.$showError?.(opts)
  }

  const $withLoading = <T>(promise: Promise<T>): Promise<T> => {
    return globalProperties?.$withLoading?.(promise) as Promise<T>
  }

  return {
    $showMessage,
    $showAlert,
    $showConfirm,
    $showError,
    $withLoading,
    /** ConfirmPlugin — GlobalConfirmSheet 마운트 (window.$confirm 아님) */
    $confirm: globalProperties?.$confirm,
    $dialog: globalProperties?.$dialog,
    $constants: globalProperties?.$constants,
    $lodash: globalProperties?.$lodash,
    $utils: globalProperties?.$utils,
    global: globalProperties,
  }
}
