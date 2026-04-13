<template>
  <v-dialog
    v-model="dialogModel"
    persistent
    max-width="400px"
    teleport="body"
    @click:outside="handleCancel"
  >
    <v-card class="pa-2 _pop-small-card">
      <!-- 헤더 -->
      <v-card-title class="d-flex align-center justify-space-between">
        <span class="text-h6 font-weight-bold">반 추가</span>
        <v-btn icon size="small" variant="text" @click="handleCancel">
          <v-icon icon="ri-close-line"></v-icon>
        </v-btn>
      </v-card-title>

      <!-- 본문 -->
      <v-card-text class="mt-4">
        <v-text-field
          v-model="form.name"
          label="반 이름을 입력해주세요."
          :rules="nameRules"
          variant="outlined"
          clearable
          clear-icon="ri-close-circle-fill"
          density="comfortable"
          autofocus
          @keyup.enter="handleConfirm"
        ></v-text-field>
      </v-card-text>

      <!-- 하단 액션 -->
      <v-card-actions class="flex-wrap justify-end py-4 px-6">
        <v-btn variant="text" color="grey" size="large" @click="handleCancel">
          닫기
        </v-btn>
        <v-btn
          variant="text"
          color="accent"
          size="large"
          :loading="loading"
          :disabled="!form.name"
          @click="handleConfirm"
        >
          추가
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { addClass } from '@/api/api'
import { useGlobal } from '@/composables/useGlobal'

const { $showError, $withLoading } = useGlobal()

// ✅ 플러그인 연동용 props
const props = defineProps({
  onClose: { type: Function, default: () => {} },
  onError: { type: Function, default: () => {} },
})

// ✅ 상태 관리
const dialogModel = ref(true)
const loading = ref(false)

// ✅ 폼 데이터
const form = ref({
  id: '',
  name: '',
})

// ✅ 검증 규칙
const nameRules = [
  (v) => !!v || '반 이름은 필수 항목입니다.',
  (v) => (v && v.length <= 20) || '20자 이하로 입력해주세요.',
]

// ✅ 다이얼로그 닫기 (취소)
const handleCancel = () => {
  dialogModel.value = false
  setTimeout(() => {
    props.onClose(null)
  }, 150)
}

// ✅ 반 추가 실행
const handleConfirm = async () => {
  // ✅ 간단한 유효성 검사
  if (!form.value.name?.trim()) {
    // $showMessage?.({ type: 'warning', message: '반 이름을 입력해주세요.' })
    return
  }

  loading.value = true

  try {
    const response = await ($withLoading?.(addClass(form.value)) ??
      addClass(form.value))

    if (response?.code === '0' || response?.code === 0) {
      // $showMessage?.({ type: 'success', message: '반이 추가되었습니다.' })
      dialogModel.value = false
      setTimeout(() => {
        props.onClose(response.data)
      }, 150)
    }
  } catch (error) {
    console.error('Add class error:', error)
    props.onError?.(error)
    $showError?.(error)
  } finally {
    loading.value = false
  }
}

// ✅ 마운트 시 초기화
onMounted(() => {
  // ✅ ESC 키로 닫기
  const onKeydown = (e) => {
    if (e.key === 'Escape') {
      handleCancel()
      document.removeEventListener('keydown', onKeydown)
    }
  }
  document.addEventListener('keydown', onKeydown)
})
</script>

<style scoped>
._pop-small-card {
  border-radius: 16px;
}

/* Vue 3 deep selector */
:deep(.v-card-title) {
  padding: 16px 24px 8px;
}

:deep(.v-card-text) {
  padding: 8px 24px 16px;
}

:deep(.v-card-actions) {
  padding: 8px 24px 16px;
}

/* 모바일 대응 */
@media (max-width: 600px) {
  .v-card-actions {
    flex-direction: column-reverse;
    gap: 8px;
  }

  .v-card-actions .v-btn {
    width: 100%;
  }
}
</style>
