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
        <span class="text-h6 font-weight-bold">사용자 관리</span>
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

      <!-- 사용자 목록 섹션 -->
      <v-list class="pa-0">
        <v-list-group v-model="groups.users" value="users">
          <template #activator="{ props: activatorProps }">
            <v-list-item v-bind="activatorProps" prepend-icon="ri-user-fill">
              <v-list-item-title>사용자</v-list-item-title>
            </v-list-item>
          </template>

          <!-- 사용자 목록 -->
          <template v-if="userList?.length">
            <v-list-item
              v-for="(user, index) in userList"
              :key="user.id || index"
              class="ml-14"
            >
              <v-list-item-title class="_list-title-with-sub">
                <span class="font-weight-medium">{{ user.userId }}</span>
                <span class="text-grey ms-2">{{ user.userName }}</span>
              </v-list-item-title>
            </v-list-item>
          </template>

          <!-- 빈 상태 -->
          <v-list-item v-else>
            <v-list-item-icon>
              <v-icon icon="mdi-information-off"></v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              등록된 유저의 정보가 없습니다.
            </v-list-item-title>
          </v-list-item>

          <!-- ✅ 사용자 추가 버튼 (주석 해제 시 사용) -->
          <!--
          <v-list-item class="py-2">
            <v-btn
              block
              variant="flat"
              @click="openUserAddDialog"
            >
              사용자 추가
              <v-icon icon="ri-add-fill" color="success" class="ml-2"></v-icon>
            </v-btn>
          </v-list-item>
          -->
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

<script setup>
import { ref, onMounted } from 'vue'
import { getUsers } from '@/api/api'
import { useGlobal } from '@/composables/useGlobal'

// const { $showMessage, $showError, $withLoading, $dialog } = useGlobal()

// ✅ 플러그인 연동용 props
const props = defineProps({
  onClose: { type: Function, default: () => {} },
  onError: { type: Function, default: () => {} },
})

// ✅ 상태 관리
const dialogModel = ref(true)
const isMobile = ref(false)
const groups = ref({ users: true })
const userList = ref([])

// ✅ 모바일 감지
const checkIfMobile = () => {
  const ua = navigator.userAgent || navigator.vendor || window.opera
  isMobile.value =
    /android/i.test(ua) || (/iPad|iPhone|iPod/.test(ua) && !window.MSStream)
}

// ✅ 사용자 목록 로딩
const fetchUsers = async () => {
  try {
    const response = await getUsers()
    if (response?.code === '0' || response?.code === 0) {
      userList.value = response.data || []
    }
  } catch (e) {
    console.error('Fetch users error:', e)
    // $showError?.(e)
  }
}

// ✅ 다이얼로그 닫기
const handleCancel = () => {
  dialogModel.value = false
  setTimeout(() => {
    props.onClose(true)
  }, 150)
}

// ✅ 사용자 추가 다이얼로그 (필요시 주석 해제)
// const openUserAddDialog = async () => {
//   try {
//     // const { default: UserAddDialog } = await import('@/components/admin/UserAddDialog.vue')
//     // const result = await $dialog?.(UserAddDialog, null)
//     // if (result) {
//     //   $showMessage?.({ type: 'success', message: '성공적으로 추가했습니다.' })
//     //   userList.value.push(result)
//     // }
//   } catch (e) {
//     console.error('UserAddDialog error:', e)
//     props.onError?.(e)
//   }
// }

// ✅ 마운트 시 초기화
onMounted(() => {
  checkIfMobile()
  fetchUsers()

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

._list-title-with-sub {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
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
