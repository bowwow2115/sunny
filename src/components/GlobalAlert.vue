<template>
  <v-alert
    v-model="show"
    :type="type"
    variant="tonal"
    border="start"
    closable
    transition="slide-y-transition"
    class="global-alert"
    @click:close="closeAlert"
  >
    {{ message }}
  </v-alert>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { AlertOptions } from '@/types'

const show = ref(false)
const type = ref<AlertOptions['type']>('success')
const message = ref('')

let timeoutId: ReturnType<typeof setTimeout> | null = null

const showAlert = (payload: AlertOptions) => {
  if (timeoutId) clearTimeout(timeoutId)

  type.value = payload.type || 'info'
  message.value = payload.message || ''
  show.value = true

  timeoutId = setTimeout(() => closeAlert(), 2000)
}

const closeAlert = () => {
  show.value = false
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
}

defineExpose({ showAlert, closeAlert })
</script>

<style scoped>
.global-alert {
  position: fixed !important;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2400 !important; /* Vuetify dialog z-index 보다 높게 */
  max-width: 400px;
  min-width: 280px;
}

/* 모바일 대응 */
@media (max-width: 600px) {
  .global-alert {
    top: auto;
    bottom: 16px;
    left: 16px;
    right: 16px;
    max-width: none;
  }
}

/* Vuetify 3 alert 스타일 보정 */
:deep(.v-alert__close) {
  align-self: flex-start;
}

:deep(.v-alert__content) {
  font-size: 0.875rem;
}
</style>
