<template>
  <!-- ✅ 외부 클릭/ESC로 닫을 수 있도록 persistent=false -->
  <v-dialog
    v-model="dialogModel"
    :persistent="persistent"
    max-width="400px"
    teleport="body"
    @click:outside="handleCancel"
  >
    <v-card class="text-center pa-4">
      <!-- 헤더: 메시지 + 닫기 버튼 -->
      <v-card-title class="d-flex align-center justify-space-between">
        <span class="text-h6 font-weight-bold">{{ message }}</span>
        <v-btn
          v-if="!persistent"
          icon
          size="small"
          variant="text"
          @click="handleCancel"
        >
          <v-icon icon="ri-close-line"></v-icon>
        </v-btn>
      </v-card-title>

      <v-card-actions class="justify-center gap-4 py-4">
        <v-btn
          variant="flat"
          color="success"
          size="large"
          @click="handleConfirm"
        >
          {{ confirmText }}
        </v-btn>
        <v-btn
          variant="outlined"
          color="error"
          size="large"
          @click="handleCancel"
        >
          {{ cancelText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue'

// ✅ props 대신 ref로 상태 관리
const message = ref('')
const confirmText = ref('확인')
const cancelText = ref('닫기')
const persistent = ref(true)

// ✅ dialogModel 은 플러그인 마운트용으로 true 로 시작
const dialogModel = ref(true)

// ✅ 외부에서 호출할 함수 (Promise 반환)
const showConfirm = (payload) => {
  return new Promise((resolve) => {
    message.value = payload.message || ''
    confirmText.value = payload.confirmText || '확인'
    cancelText.value = payload.cancelText || '닫기'
    persistent.value =
      payload.persistent !== undefined ? payload.persistent : false // ✅ 기본값: false (닫기 가능)

    currentResolve = resolve
    dialogModel.value = true
  })
}

let currentResolve = null

const handleConfirm = () => {
  dialogModel.value = false
  setTimeout(() => {
    if (currentResolve) {
      currentResolve(true)
      currentResolve = null
    }
  }, 150)
}

const handleCancel = () => {
  if (!persistent.value) {
    dialogModel.value = false
    setTimeout(() => {
      if (currentResolve) {
        currentResolve(false) // ✅ 닫기/취소도 false로 반환
        currentResolve = null
      }
    }, 150)
  }
}

// 외부에서 호출 가능하도록 노출
defineExpose({
  showConfirm,
})

// ✅ ESC 키로 닫기 처리는 제거 (showConfirm의 persistent 옵션으로 제어)
</script>

<style scoped>
.gap-4 {
  gap: 16px;
}

/* Vue 3 deep selector */
:deep(.v-card-title) {
  padding: 16px 24px 8px;
}

:deep(.v-card-actions) {
  padding: 8px 24px 16px;
}

/* 모바일 대응 */
@media (max-width: 600px) {
  .v-card-actions {
    flex-direction: column;
    gap: 8px;
  }

  .v-card-actions .v-btn {
    width: 100%;
  }
}
</style>
