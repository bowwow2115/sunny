// plugins/dialogPlugin.js
import { createApp, h } from 'vue'
// import vuetify from '@/plugins/vuetify' // ✅ Vuetify 직접 임포트

/**
 * 다이얼로그 앱에 메인 앱 컨텍스트를 안전하게 상속하는 헬퍼
 */
function inheritAppContext(dialogApp, mainApp) {
  if (!mainApp) return

  try {
    // ✅ 1. 글로벌 프로퍼티 복사
    if (mainApp.config?.globalProperties) {
      Object.assign(
        dialogApp.config.globalProperties,
        mainApp.config.globalProperties
      )
    }

    // ✅ 2. provides 복사 (Vuetify, Router, Store 포함)
    if (mainApp._context?.provides) {
      console.log('[inheritAppContext] Copying provides...')
      if (!dialogApp._context) {
        dialogApp._context = {}
      }
      if (!dialogApp._context.provides) {
        dialogApp._context.provides = {}
      }
      Object.assign(dialogApp._context.provides, mainApp._context.provides)
      console.log('[inheritAppContext] Provides copied')
    }
  } catch (err) {
    console.warn('[inheritAppContext] Context copy issue:', err)
  }
}

/**
 * 다이얼로그 마운트 함수
 */
function mountDialog(component, props = {}, mainApp) {
  return new Promise((resolve, reject) => {
    console.log('[mountDialog] Starting mount with props:', props)

    const container = document.createElement('div')
    container.classList.add('dialog-root')

    let isResolved = false

    const cleanup = () => {
      console.log('[mountDialog] Cleanup started')
      if (dialogApp) {
        dialogApp.unmount() // ✅ 먼저 unmount
      }
      if (container?.parentNode) {
        container.parentNode.removeChild(container) // ✅ 그 후 DOM 제거
      }
    }

    const safeResolve = (result) => {
      if (isResolved) return
      isResolved = true
      console.log('[mountDialog] Resolved with:', result)
      cleanup()
      resolve(result)
    }

    const safeReject = (error) => {
      if (isResolved) return
      isResolved = true
      console.error('[mountDialog] Rejected with:', error)
      cleanup()
      reject(error)
    }

    const dialogApp = createApp(component, {
      ...props,
      onClose: (result) => safeResolve(result),
      onError: (error) => safeReject(error),
    })

    // ✅ 필수 플러그인 설치 (Vuetify 필수!)
    console.log('[mountDialog] Installing Vuetify plugin...')
    dialogApp.use(vuetify)

    // ✅ 메인 앱 컨텍스트 상속
    inheritAppContext(dialogApp, mainApp || window.$app)

    // ✅ 에러 핸들링
    dialogApp.config.errorHandler = (err) => {
      console.error('[Dialog Error]', err)
      safeReject(err)
    }

    try {
      console.log('[mountDialog] About to mount app')
      dialogApp.mount(container)
      console.log('[mountDialog] App mounted to container')
      document.body.appendChild(container)
      console.log('[mountDialog] Container appended to body')
    } catch (error) {
      console.error('[mountDialog] Mount failed:', error.message, error.stack)
      cleanup()
      safeReject(error)
    }
  })
}

// 플러그인 등록
const DialogPlugin = {
  install(app) {
    window.$app = app // ✅ 전역 앱 인스턴스 저장

    app.config.globalProperties.$dialog = function (component, props = {}) {
      return mountDialog(component, props, app)
    }
  },
}

const ConfirmPlugin = {
  install(app) {
    app.config.globalProperties.$confirm = async function (props = {}) {
      try {
        const { default: ConfirmSheet } = await import(
          '@/components/GlobalConfirmSheet.vue'
        )
        return await mountDialog(ConfirmSheet, props, app)
      } catch (error) {
        console.error('[ConfirmPlugin] Failed to load component:', error)
        // ✅ fallback: 기본 브라우저 컨펌
        return window.confirm(props.message || '확인하시겠습니까?')
      }
    }
  },
}

const ErrorDialogPlugin = {
  install(app) {
    app.config.globalProperties.$showError = async function ({
      code = '',
      message = '',
    } = {}) {
      try {
        const { default: ErrorDialog } = await import(
          '@/components/dialog/ErrorDialog.vue'
        )
        await mountDialog(ErrorDialog, { code, message }, app)
      } catch (error) {
        console.error('[ErrorDialog] Fallback to alert:', error)
        // ✅ fallback: 기본 알림
        window.alert(message || '오류가 발생했습니다.')
      }
    }
  },
}

const MessageDialogPlugin = {
  install(app) {
    app.config.globalProperties.$showMessage = async function ({
      type = 'info',
      message = '',
      duration = 3000,
    } = {}) {
      try {
        const { default: GlobalSnackbar } = await import(
          '@/components/GlobalSnackbar.vue'
        )
        await mountDialog(GlobalSnackbar, { type, message, duration }, app)
      } catch (error) {
        console.error('[MessageDialog] Fallback to console:', error)
        // ✅ fallback: 콘솔 출력
        console.log(`[${type.toUpperCase()}] ${message}`)
      }
    }
  },
}

export {
  DialogPlugin,
  ConfirmPlugin,
  ErrorDialogPlugin,
  MessageDialogPlugin,
  mountDialog, // ✅ 유틸로 별도 노출 (고급 사용 시)
}
