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

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { SnackbarOptions } from '@/types'

const show = ref(false)
const message = ref('')
const type = ref<SnackbarOptions['type']>('info')
const timeout = ref(3000)

let timeoutId: ReturnType<typeof setTimeout> | null = null

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

const snackbarColor = computed<string | undefined>(() => undefined)

const showSnackbar = (payload: SnackbarOptions) => {
  if (timeoutId) clearTimeout(timeoutId)

  type.value = payload.type || 'info'
  message.value = payload.message || ''
  timeout.value = payload.timeout || 3000
  show.value = true

  timeoutId = setTimeout(() => closeSnackbar(), timeout.value)
}

const closeSnackbar = () => {
  show.value = false
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
}

defineExpose({ showSnackbar, closeSnackbar })
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
