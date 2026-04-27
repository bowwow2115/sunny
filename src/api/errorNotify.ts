/** API 레이어에서 전역 에러 UI 호출 — window.vue 대신 콜백 주입 */

type ErrorPayload = { message?: string; code?: string | number }

let notifyError: ((payload: ErrorPayload) => void) | null = null

export function setApiErrorNotifier(fn: (payload: ErrorPayload) => void): void {
  notifyError = fn
}

export function notifyApiError(message: string): void {
  notifyError?.({ message })
}
