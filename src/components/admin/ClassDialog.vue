<template>
  <v-dialog
    v-model="dialogModel"
    :fullscreen="isMobile"
    :scrim="!isMobile"
    persistent
    teleport="body"
    @click:outside="handleCancel"
  >
    <v-card class="pa-2 _pop-small-card">
      <!-- 헤더 -->
      <v-card-title class="d-flex align-center justify-space-between">
        <span class="text-h6 font-weight-bold">반 설정</span>
        <v-btn
          v-if="!isMobile"
          icon
          size="small"
          variant="text"
          @click="handleCancel"
        >
          <v-icon icon="ri-close-line"></v-icon>
        </v-btn>
      </v-card-title>

      <!-- 반 목록 섹션 -->
      <v-list class="pa-0">
        <v-list-group v-model="groups.classes" value="classes">
          <template #activator="{ props: activatorProps }">
            <v-list-item
              v-bind="activatorProps"
              prepend-icon="ri-book-read-fill"
            >
              <v-list-item-title>반</v-list-item-title>
            </v-list-item>
          </template>

          <!-- 반 목록 -->
          <template v-if="classList?.length">
            <v-list-item
              v-for="(sunnyClass, index) in classList"
              :key="sunnyClass.id || index"
              class="ml-14"
            >
              <v-list-item-title>{{ sunnyClass.name }}</v-list-item-title>
              <v-list-item-action start>
                <v-btn
                  icon
                  size="small"
                  variant="text"
                  color="grey"
                  @click="deleteClass(sunnyClass)"
                >
                  <v-icon icon="ri-close-circle-fill"></v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </template>

          <!-- 빈 상태 -->
          <v-list-item v-else>
            <v-list-item-icon>
              <v-icon icon="mdi-information-off"></v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              등록된 반의 정보가 없습니다.
            </v-list-item-title>
          </v-list-item>

          <!-- 반 추가 버튼 -->
          <v-list-item class="py-2">
            <v-btn block variant="flat" @click="openClassAddDialog">
              반 추가
              <v-icon icon="ri-add-fill" color="success" class="ml-2"></v-icon>
            </v-btn>
          </v-list-item>
        </v-list-group>
      </v-list>

      <!-- 하단 액션 -->
      <v-card-actions class="flex-wrap justify-end py-4 px-6">
        <v-btn variant="text" color="grey" size="large" @click="handleCancel">
          닫기
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// ✅ API 함수 임포트 시 별칭 사용 (이름 충돌 방지)
import { getClassList, deleteClass as deleteClassApi } from '@/api/api'
import ClassAddDialog from './ClassAddDialog.vue'
import { useGlobal } from '@/composables/useGlobal'
import type { ClassInfo } from '@/types'

const { $showMessage, $showError, $withLoading, $dialog, $confirm } =
  useGlobal()

const props = defineProps({
  onClose: { type: Function, default: () => {} },
  onError: { type: Function, default: () => {} },
})

const dialogModel = ref<boolean>(true)
const isMobile = ref<boolean>(false)
const groups = ref<{ classes: boolean }>({ classes: true })
const classList = ref<ClassInfo[]>([])

const checkIfMobile = (): void => {
  const ua =
    navigator.userAgent || navigator.vendor || (window as any).opera
  isMobile.value =
    /android/i.test(ua) ||
    (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream)
}

const fetchClassList = async (): Promise<void> => {
  try {
    const response = await getClassList()
    if (response?.code === '0' || response?.code === 0) {
      classList.value = response.data || []
    }
  } catch (e) {
    console.error('Fetch class list error:', e)
    $showError?.(e)
  }
}

const handleCancel = (): void => {
  dialogModel.value = false
  setTimeout(() => {
    props.onClose(true)
  }, 150)
}

// ✅ 로컬 함수 이름 변경: deleteClass → handleDeleteClass
const handleDeleteClass = async (sunnyClass: ClassInfo): Promise<void> => {
  try {
    const confirmed = await $confirm?.({
      message: `${sunnyClass.name}을 정말 삭제하시겠습니까?`,
    })

    if (!confirmed) return

    // ✅ 별칭으로 임포트한 API 함수 호출
    const response =
      (await $withLoading?.(deleteClassApi(sunnyClass.id))) ??
      (await deleteClassApi(sunnyClass.id))

    if (response?.code === '0' || response?.code === 0) {
      $showMessage?.({ type: 'success', message: '성공적으로 삭제했습니다.' })
      const idx = classList.value.findIndex(
        (item: ClassInfo) => item.id === sunnyClass.id
      )
      if (idx !== -1) {
        classList.value.splice(idx, 1)
      }
    }
  } catch (e) {
    console.error('Delete class error:', e)
    $showError?.(e)
  }
}

const openClassAddDialog = async (): Promise<void> => {
  try {
    const result = await $dialog?.(ClassAddDialog)

    if (result) {
      $showMessage?.({ type: 'success', message: '성공적으로 추가했습니다.' })
      classList.value.push(result as ClassInfo)
    }
  } catch (e) {
    console.error('ClassAddDialog error:', e)
    props.onError?.(e)
  }
}

onMounted(() => {
  checkIfMobile()
  fetchClassList()

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
._pop-small-card {
  border-radius: 16px;
}

/* Vue 3 deep selector */
:deep(.v-list-group__items) {
  padding-left: 8px;
}

:deep(.v-list-item__prepend) {
  margin-inline-end: 12px;
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
