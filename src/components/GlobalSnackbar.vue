<template>
  <v-snackbar
    v-model="show"
    :timeout="timeout"
    :color="snackbarColor"
    location="bottom center"
    class="global-snackbar"
  >
    <div class="d-flex align-center">
      <v-icon
        :icon="typeIcon.icon"
        :color="typeIcon.color"
        class="me-2"
        size="20"
      ></v-icon>
      <span>{{ message }}</span>
    </div>

    <template v-slot:actions>
      <v-btn variant="text" icon size="small" @click="closeSnackbar">
        <v-icon icon="ri-close-line"></v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { ref, computed } from 'vue'

// 상태 관리
const show = ref(false)
const message = ref('')
const type = ref('info')
const timeout = ref(3000)

let timeoutId = null

// 타입별 아이콘 및 색상 설정 (RemixIcon 사용)
const typeIcon = computed(() => {
  switch (type.value) {
    case 'success':
      return { icon: 'ri-checkbox-circle-fill', color: 'success' }
    case 'warning':
      return { icon: 'ri-alert-fill', color: 'warning' }
    case 'error':
      return { icon: 'ri-error-warning-fill', color: 'error' }
    case 'info':
    default:
      return { icon: 'ri-information-fill', color: 'info' }
  }
})

const snackbarColor = computed(() => {
  // 배경색을 타입에 따라 다르게 하려면 반환, 단색으로 통일 하려면 제거
  return undefined
})

// 스낵바 표시 (외부에서 호출 가능하도록 노출)
const showSnackbar = (payload) => {
  // 기존 타이머 정리
  if (timeoutId) {
    clearTimeout(timeoutId)
  }

  type.value = payload.type || 'info'
  message.value = payload.message || ''
  timeout.value = payload.timeout || 3000
  show.value = true

  // 자동 닫기
  timeoutId = setTimeout(() => {
    closeSnackbar()
  }, timeout.value)
}

// 스낵바 닫기
const closeSnackbar = () => {
  show.value = false
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
}

// 외부에서 호출 가능하도록 노출
defineExpose({
  showSnackbar,
  closeSnackbar,
})
</script>

<style scoped>
.global-snackbar {
  z-index: 2500 !important; /* Vuetify dialog (2400) 보다 높게 */
}

:deep(.v-snackbar__content) {
  font-size: 0.875rem;
  font-weight: 500;
}

:deep(.v-snackbar__actions) {
  margin-inline-start: 16px;
}

/* 모바일 대응 */
@media (max-width: 600px) {
  .global-snackbar {
    margin: 16px;
  }

  :deep(.v-snackbar__content) {
    flex-direction: column;
    align-items: flex-start;
  }

  :deep(.v-snackbar__actions) {
    margin-inline-start: 0;
    margin-top: 8px;
  }
}
</style>
