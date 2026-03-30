// composables/useGlobal.js
import { getCurrentInstance } from 'vue'

/**
 * Vue 3 Composition API 에서 globalProperties 에 접근하는 훅
 * @returns {Object} 글로벌 프로퍼티 객체
 */
export function useGlobal() {
  const instance = getCurrentInstance()
  const globalProperties = instance?.appContext?.config?.globalProperties

  return {
    // 자주 사용하는 메서드들을 직접 추출하여 반환
    $showMessage: globalProperties?.$showMessage,
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
