import { createApp, type App, type Component } from 'vue'
import vuetify from '@/plugins/vuetify'
import type { ConfirmOptions, ErrorOptions, SnackbarOptions } from '@/types'

function inheritAppContext(dialogApp: App, mainApp?: App): void {
  if (!mainApp) return
  try {
    if (mainApp.config?.globalProperties) {
      Object.assign(
        dialogApp.config.globalProperties,
        mainApp.config.globalProperties
      )
    }
    const mainContext = (mainApp as any)._context
    const dialogContext = (dialogApp as any)._context
    if (mainContext?.provides) {
      if (!dialogContext.provides) dialogContext.provides = {}
      Object.assign(dialogContext.provides, mainContext.provides)
    }
  } catch (err) {
    console.warn('[inheritAppContext] Context copy issue:', err)
  }
}

export function mountDialog<T = any>(
  component: Component,
  props: Record<string, any> = {},
  mainApp?: App
): Promise<T> {
  return new Promise((resolve, reject) => {
    const container = document.createElement('div')
    container.classList.add('dialog-root')

    let isResolved = false
    let dialogApp: App | null = null

    const cleanup = () => {
      if (dialogApp) dialogApp.unmount()
      if (container?.parentNode) container.parentNode.removeChild(container)
    }

    const safeResolve = (result: T) => {
      if (isResolved) return
      isResolved = true
      cleanup()
      resolve(result)
    }

    const safeReject = (error: any) => {
      if (isResolved) return
      isResolved = true
      cleanup()
      reject(error)
    }

    dialogApp = createApp(component, {
      ...props,
      onClose: (result: T) => safeResolve(result),
      onError: (error: any) => safeReject(error),
    })

    dialogApp.use(vuetify)
    inheritAppContext(dialogApp, mainApp || window.$app)

    dialogApp.config.errorHandler = (err) => {
      console.error('[Dialog Error]', err)
      safeReject(err)
    }

    try {
      dialogApp.mount(container)
      document.body.appendChild(container)
    } catch (error) {
      console.error('[mountDialog] Mount failed:', error)
      cleanup()
      safeReject(error)
    }
  })
}

const DialogPlugin = {
  install(app: App) {
    window.$app = app
    app.config.globalProperties.$dialog = function (
      component: Component,
      props: Record<string, any> = {}
    ) {
      return mountDialog(component, props, app)
    }
  },
}

const ConfirmPlugin = {
  install(app: App) {
    app.config.globalProperties.$confirm = async function (
      props: ConfirmOptions = {}
    ) {
      try {
        const { default: ConfirmSheet } = await import(
          '@/components/GlobalConfirmSheet.vue'
        )
        return await mountDialog(ConfirmSheet, props, app)
      } catch (error) {
        console.error('[ConfirmPlugin] Failed to load component:', error)
        return window.confirm(props.message || '확인하시겠습니까?')
      }
    }
  },
}

const ErrorDialogPlugin = {
  install(app: App) {
    app.config.globalProperties.$showError = async function ({
      code = '',
      message = '',
    }: ErrorOptions = {}) {
      try {
        const { default: ErrorDialog } = await import(
          '@/components/dialog/ErrorDialog.vue'
        )
        await mountDialog(ErrorDialog, { code, message }, app)
      } catch (error) {
        console.error('[ErrorDialog] Fallback to alert:', error)
        window.alert(message || '오류가 발생했습니다.')
      }
    }
  },
}

const MessageDialogPlugin = {
  install(app: App) {
    app.config.globalProperties.$showMessage = async function ({
      type = 'info',
      message = '',
      duration = 3000,
    }: SnackbarOptions = {}) {
      try {
        const { default: GlobalSnackbar } = await import(
          '@/components/GlobalSnackbar.vue'
        )
        await mountDialog(GlobalSnackbar, { type, message, duration }, app)
      } catch (error) {
        console.error('[MessageDialog] Fallback to console:', error)
        console.log(`[${(type as string).toUpperCase()}] ${message}`)
      }
    }
  },
}

export { DialogPlugin, ConfirmPlugin, ErrorDialogPlugin, MessageDialogPlugin }
