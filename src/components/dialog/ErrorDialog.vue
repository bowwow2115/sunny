<template>
  <!-- ✅ teleport="body" 로 오버레이 컨텍스트 보장 -->
  <v-dialog
    class="_dialog-sm"
    v-model="dialogModel"
    persistent
    max-width="400px"
    teleport="body"
    @click:outside="handleClose"
  >
    <v-card>
      <!-- 헤더: 에러 코드 -->
      <v-card-title class="d-flex align-center justify-space-between">
        <span class="text-h6 font-weight-bold">{{ errorCode }}</span>
        <v-btn icon size="small" variant="text" @click="handleClose">
          <v-icon icon="ri-close-line"></v-icon>
        </v-btn>
      </v-card-title>

      <!-- 본문: 에러 메시지 -->
      <v-card-text class="text-body-1">
        {{ errorMessage }}
      </v-card-text>

      <!-- 하단 액션 -->
      <v-card-actions class="justify-end py-4 px-6">
        <v-btn variant="flat" color="error" size="large" @click="handleClose">
          닫기
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

// ✅ 플러그인 연동용 props
const props = defineProps({
  // 에러 데이터
  code: { type: [String, Number], default: '' },
  message: { type: String, default: '' },

  // ✅ 플러그인 콜백 (필수)
  onClose: { type: Function, default: () => {} },

  // 옵션
  persistent: { type: Boolean, default: true }, // 배경 클릭으로 닫기 방지
})

// ✅ 다이얼로그 상태 (v-model 연동용)
const dialogModel = ref(true)

// ✅ 에러 정보 (props 와 동기화)
const errorCode = ref<string | number>(
  props.code || '정의되지 않은 에러입니다.'
)
const errorMessage = ref<string>(props.message || '관리자에게 문의하세요')

// ✅ props 변경 시 에러 정보 업데이트
watch(
  () => props.code,
  (newVal) => {
    errorCode.value = newVal || '정의되지 않은 에러입니다.'
  }
)

watch(
  () => props.message,
  (newVal) => {
    errorMessage.value = newVal || '관리자에게 문의하세요'
  }
)

// ✅ 다이얼로그 닫기 핸들러
const handleClose = () => {
  dialogModel.value = false
  // ✅ 애니메이션 완료 후 콜백 호출 (옵션)
  setTimeout(() => {
    props.onClose()
  }, 150)
}

// ✅ ESC 키로 닫기 처리 (선택사항)
// onMounted(() => {
//   const onKeydown = (e) => {
//     if (e.key === 'Escape' && !props.persistent) {
//       handleClose()
//       document.removeEventListener('keydown', onKeydown)
//     }
//   }
//   document.addEventListener('keydown', onKeydown)
// })
</script>

<style scoped>
/* Vue 3 deep selector 예시 */
:deep(.v-card-title) {
  padding: 16px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

:deep(.v-card-text) {
  padding: 24px;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.87);
}

:deep(.v-card-actions) {
  padding: 8px 24px 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
