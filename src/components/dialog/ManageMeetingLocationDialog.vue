<template>
  <!-- ✅ teleport="body" 로 오버레이 컨텍스트 보장 -->
  <v-dialog
    v-model="dialogModel"
    persistent
    max-width="520px"
    teleport="body"
    @click:outside="handleCancel"
  >
    <v-card class="pa-2">
      <!-- 헤더 -->
      <v-card-title class="d-flex align-center justify-space-between">
        <span class="text-h6 font-weight-bold">
          {{ isEdit ? '승하차 장소 정보 수정' : '승하차 장소 정보 추가' }}
        </span>
        <v-btn icon size="small" variant="text" @click="handleCancel">
          <v-icon icon="ri-close-line"></v-icon>
        </v-btn>
      </v-card-title>

      <v-form ref="formRef" v-model="isValid">
        <v-card-text class="mt-4">
          <v-row>
            <!-- 장소 이름 -->
            <v-col cols="12" lg="6">
              <v-text-field
                v-model="form.name"
                prepend-inner-icon="ri-map-pin-fill"
                label="승하차 장소의 이름을 입력해주세요."
                :rules="nameRules"
                variant="outlined"
                clearable
                clear-icon="ri-close-circle-fill"
                density="comfortable"
              ></v-text-field>
            </v-col>

            <!-- 시간 입력 (4 자리 숫자) -->
            <v-col cols="12" lg="6">
              <v-text-field
                v-model="form.timeInput"
                prepend-inner-icon="ri-map-pin-time-fill"
                label="시간을 입력해주세요. (예: 1630)"
                :rules="timeRules"
                variant="outlined"
                clearable
                clear-icon="ri-close-circle-fill"
                density="comfortable"
                maxlength="4"
                @input="formatTimeInput"
              ></v-text-field>
            </v-col>

            <!-- 비고 -->
            <v-col cols="12" lg="6">
              <v-text-field
                v-model="form.comment"
                label="비고사항을 입력해주세요."
                variant="outlined"
                clearable
                clear-icon="ri-close-circle-fill"
                density="comfortable"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <!-- 하단 액션 -->
        <v-card-actions class="justify-end py-4 px-6">
          <v-btn variant="text" color="grey" size="large" @click="handleCancel">
            닫기
          </v-btn>
          <v-btn
            variant="text"
            color="accent"
            size="large"
            :loading="loading"
            @click="handleConfirm"
          >
            {{ isEdit ? '수정' : '추가' }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { updateMeetingLocation, addMeetingLocation } from '@/api/api'
import { useGlobal } from '@/composables/useGlobal'

const { $showError, $withLoading } = useGlobal()

// ✅ 플러그인 연동용 props
const props = defineProps({
  // 데이터 props
  id: { type: [String, Number], default: '' },
  name: { type: String, default: '' },
  time: { type: String, default: '' }, // HH:MM 형식
  sunnyRide: { type: Object, default: () => ({}) },
  comment: { type: String, default: '' },
  isEdit: { type: Boolean, default: false },

  // ✅ 플러그인 콜백 (필수)
  onClose: { type: Function, default: () => {} },
  onError: { type: Function, default: () => {} },
})

// ✅ 상태 관리
const dialogModel = ref(true)
const isValid = ref(false)
const loading = ref(false)
const formRef = ref(null)

// ✅ 폼 데이터
const form = ref({
  id: props.id,
  name: props.name,
  time: props.time,
  timeInput: props.time ? props.time.replace(':', '') : '', // HH:MM → HHMM
  sunnyRide: { ...props.sunnyRide },
  comment: props.comment,
})

// ✅ 검증 규칙
const nameRules = [(v) => !!v || '필수 항목입니다.']
const timeRules = [
  (v) => !!v || '필수 항목입니다.',
  (v) => /^\d+$/.test(v) || '숫자만 입력해 주세요.',
  (v) => /^\d{4}$/.test(v) || '4 자리로 입력해 주세요',
]

// ✅ 시간 입력 포맷팅 (숫자만 허용)
const formatTimeInput = (event) => {
  // ✅ 숫자 외 문자 제거
  form.value.timeInput = form.value.timeInput.replace(/[^0-9]/g, '').slice(0, 4)
}

// ✅ 다이얼로그 닫기 (취소)
const handleCancel = () => {
  dialogModel.value = false
  setTimeout(() => {
    props.onClose(null)
  }, 150)
}

// ✅ 확인 및 저장 실행
const handleConfirm = async () => {
  // ✅ Vuetify 3 폼 검증 (비동기)
  const { valid } = (await formRef.value?.validate?.()) || {
    valid: isValid.value,
  }

  if (!valid) {
    // $showMessage?.({ type: 'warning', message: '입력값을 확인해주세요.' })
    return
  }

  // ✅ 시간 포맷 변환 (HHMM → HH:MM)
  const timeInput = form.value.timeInput
  form.value.time = `${timeInput.slice(0, 2)}:${timeInput.slice(2)}`

  loading.value = true

  try {
    const apiCall = props.isEdit
      ? () => updateMeetingLocation(form.value) // ✅ 오타 수정: Loaction → Location
      : () => addMeetingLocation(form.value)

    const response = await ($withLoading?.(apiCall()) ?? apiCall())

    if (response?.code === '0' || response?.code === 0) {
      // $showMessage?.({ type: 'success', message: '성공적으로 저장했습니다.' })
      dialogModel.value = false
      setTimeout(() => {
        props.onClose(response.data)
      }, 150)
    }
  } catch (error) {
    console.error('Save meeting location error:', error)
    props.onError?.(error)
    $showError?.(error)
  } finally {
    loading.value = false
  }
}

// ✅ props 변경 시 form 동기화 (선택사항)
watch(
  () => props.time,
  (newVal) => {
    if (newVal) {
      form.value.timeInput = newVal.replace(':', '')
    }
  }
)

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
/* Vue 3 deep selector 예시 */
:deep(.v-text-field__prefix) {
  margin-inline-end: 8px;
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
