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
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="form.className"
                :items="classList"
                prepend-inner-icon="ri-book-read-fill"
                label="반을 선택해주세요."
                :rules="nameRules"
                variant="outlined"
                clearable
                clear-icon="ri-close-circle-fill"
                density="comfortable"
              ></v-select>
            </v-col>
          </v-row>

          <!-- ✅ 선택된 원아 목록 미리보기 (선택사항) -->
          <v-alert
            v-if="form.childrenList?.length"
            type="info"
            variant="tonal"
            density="compact"
            class="mt-4"
          >
            <div class="text-body-2">
              <strong>대상 원아:</strong> {{ form.childrenList.length }}명
              <v-chip
                v-for="(child, idx) in form.childrenList.slice(0, 3)"
                :key="child.id || idx"
                size="x-small"
                class="ml-2"
              >
                {{ child.name }}
              </v-chip>
              <span v-if="form.childrenList.length > 3" class="text-grey ms-2">
                외 {{ form.childrenList.length - 3 }}명
              </span>
            </div>
          </v-alert>
        </v-card-text>

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

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getClassList, updateChildrenClass } from '@/api/api'
import { useGlobal } from '@/composables/useGlobal'
import type { Child } from '@/types'

const { $confirm, $showError, $withLoading } = useGlobal()

// ✅ 플러그인 연동용 props
const props = defineProps({
  // 데이터 props
  childrenList: { type: Array, default: () => [] },
  className: { type: String, default: '' },
  isEdit: { type: Boolean, default: false },

  // ✅ 플러그인 콜백 (필수)
  onClose: { type: Function, default: () => {} },
  onError: { type: Function, default: () => {} },
})

// ✅ 상태 관리
const dialogModel = ref(true)
const isValid = ref(false)
const loading = ref(false)
const formRef = ref<any>(null)

// ✅ 폼 데이터
const form = ref<{ childrenList: Child[]; className: string }>({
  childrenList: [...(props.childrenList as Child[])],
  className: props.className,
})

// ✅ 반 목록
const classList = ref<string[]>([])

// ✅ 검증 규칙
const nameRules = [(v: any) => !!v || '필수 항목입니다.']

// ✅ 반 목록 로딩
const fetchClassList = async () => {
  try {
    const response = await getClassList()
    if (response?.code === '0' || response?.code === 0) {
      // ✅ Vuetify 3 select 는 { title, value } 객체 배열 또는 단순 문자열 배열 모두 지원
      classList.value = response.data?.map((element: any) => element.name) || []
    }
  } catch (error) {
    console.error('Failed to load class list:', error)
    $showError?.(error)
  }
}

// ✅ 다이얼로그 닫기 (취소)
const handleCancel = () => {
  dialogModel.value = false
  // ✅ 애니메이션 완료 후 콜백 호출
  setTimeout(() => {
    props.onClose(null)
  }, 150)
}

// ✅ 확인 및 반 변경 실행
const handleConfirm = async () => {
  // ✅ Vuetify 3 폼 검증 (비동기)
  const { valid } = (await formRef.value?.validate?.()) || {
    valid: isValid.value,
  }

  if (!valid) {
    // $showMessage?.({ type: 'warning', message: '반을 선택해주세요.' })
    return
  }

  const confirmOpts = {
    message: `정말 ${form.value.childrenList.length}명의 원아를 "${form.value.className}"으로 변경하시겠습니까?`,
  }
  const confirmed = await ($confirm?.(confirmOpts) ?? Promise.resolve(true))

  if (!confirmed) return

  loading.value = true

  try {
    // ✅ API 호출 (withLoading 래퍼 사용)
    const execute = () =>
      updateChildrenClass(form.value.childrenList, form.value.className)

    const response: any = await ($withLoading?.(execute()) ?? execute())

    if (response?.code === '0' || response?.code === 0) {
      // $showMessage?.({ type: 'success', message: '성공적으로 변경했습니다.' })
      dialogModel.value = false
      setTimeout(() => {
        props.onClose(response.data) // ✅ 변경 결과 반환
      }, 150)
    }
  } catch (error) {
    console.error('Update class error:', error)
    $showError?.(error)
    props.onError?.(error)
  } finally {
    loading.value = false
  }
}

// ✅ 마운트 시 초기화
onMounted(() => {
  fetchClassList()

  // ✅ ESC 키로 닫기
  const onKeydown = (e: KeyboardEvent) => {
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
:deep(.v-select__selection) {
  min-height: 24px;
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
