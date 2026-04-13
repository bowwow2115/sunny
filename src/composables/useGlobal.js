// composables/useGlobal.js
import { getCurrentInstance, inject } from 'vue'

/**
 * Vue 3 Composition API 에서 globalProperties 에 접근하는 훅
 * @returns {Object} 글로벌 프로퍼티 객체
 */
export function useGlobal() {
  const instance = getCurrentInstance()
  const globalProperties = instance?.appContext?.config?.globalProperties

  // ✅ App.vue에서 provide된 ref 가져오기
  const snackbarRef = inject('snackbarRef', null)
  const alertRef = inject('alertRef', null)
  const confirmRef = inject('confirmRef', null)

  // ✅ $showMessage 래퍼 (snackbarRef 사용)
  const $showMessage = ({
    type = 'info',
    message = '',
    duration = 3000,
  } = {}) => {
    if (snackbarRef?.value?.showSnackbar) {
      return snackbarRef.value.showSnackbar({
        type,
        message,
        timeout: duration,
      })
    } else {
      console.warn('[$showMessage] Snackbar ref not available')
      console.log(`[${type.toUpperCase()}] ${message}`)
    }
  }

  // ✅ $showAlert 래퍼 (alertRef 사용)
  const $showAlert = ({
    type = 'info',
    message = '',
    duration = 2000,
  } = {}) => {
    if (alertRef?.value?.showAlert) {
      return alertRef.value.showAlert({ type, message, timeout: duration })
    } else {
      console.warn('[$showAlert] Alert ref not available')
      console.log(`[${type.toUpperCase()}] ${message}`)
    }
  }

  // ✅ $showConfirm 래퍼 (confirmRef 사용) - Promise 반환
  const $showConfirm = ({
    message = '',
    confirmText = '확인',
    cancelText = '닫기',
    persistent = false,
  } = {}) => {
    if (confirmRef?.value?.showConfirm) {
      return confirmRef.value.showConfirm({
        message,
        confirmText,
        cancelText,
        persistent,
      })
    } else {
      console.warn('[$showConfirm] Confirm ref not available')
      return Promise.resolve(window.confirm(message))
    }
  }

  return {
    // 자주 사용하는 메서드들을 직접 추출하여 반환
    $showMessage, // ✅ 스낵바 메시지
    $showAlert, // ✅ 알림
    $showConfirm, // ✅ 컨펌 (Promise)
    $showError: globalProperties?.$showError,
    $withLoading: globalProperties?.$withLoading,
    $dialog: globalProperties?.$dialog,

    // 유틸/상수
    $constants: globalProperties?.$constants,
    $lodash: globalProperties?.$lodash,
    $utils: globalProperties?.$utils,

    // 필요시 전체 객체 접근 (타입 주의)
    global: globalProperties,
  }
}
