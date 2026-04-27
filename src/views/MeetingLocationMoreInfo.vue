<template>
  <v-dialog
    v-model="dialogModel"
    :fullscreen="isMobile"
    :scrim="!isMobile"
    persistent
    teleport="body"
    @click:outside="handleCancel"
  >
    <v-card class="pa-2">
      <v-card-title class="d-flex align-center justify-space-between">
        <span class="text-h6 font-weight-bold">{{ form.name }} 정보 수정</span>
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

      <!-- 승하차 장소 섹션 -->
      <v-list class="pa-0">
        <v-list-group v-model="groups.location" value="location">
          <template #activator="{ props: activatorProps }">
            <v-list-item v-bind="activatorProps" prepend-icon="ri-map-pin-fill">
              <v-list-item-title>승하차 장소</v-list-item-title>
            </v-list-item>
          </template>

          <v-list-item>
            <v-list-item-title class="_list-title-with-sub">
              {{ form.name }}
              <span class="ml-2 text-grey">{{ form.time }}</span>
            </v-list-item-title>
          </v-list-item>

          <v-list-item class="py-2">
            <v-btn block variant="flat" @click="openMeetingLocationDialog">
              정보 수정
              <v-icon
                icon="ri-edit-2-fill"
                color="success"
                class="ml-2"
              ></v-icon>
            </v-btn>
          </v-list-item>
        </v-list-group>
      </v-list>

      <!-- 등록된 원아 섹션 -->
      <v-list class="pa-0">
        <v-list-group v-model="groups.children" value="children">
          <template #activator="{ props: activatorProps }">
            <v-list-item v-bind="activatorProps" prepend-icon="ri-user-5-fill">
              <v-list-item-title>등록된 원아</v-list-item-title>
            </v-list-item>
          </template>

          <template v-if="form.childRideList?.length">
            <v-list-item
              v-for="(childRide, index) in form.childRideList"
              :key="childRide.id || index"
              class="ml-14"
            >
              <v-list-item-title class="_list-title-with-sub">
                {{ childRide.child?.name }}
                <span class="ml-2 text-grey">{{
                  childRide.child?.className
                }}</span>
              </v-list-item-title>
              <v-list-item-action start>
                <v-btn
                  icon
                  size="small"
                  variant="text"
                  color="grey"
                  @click="deleteChildRide1(childRide)"
                >
                  <v-icon icon="ri-close-circle-fill"></v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </template>

          <v-list-item v-else>
            <v-list-item-icon>
              <v-icon icon="mdi-information-off"></v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              등록된 원아의 정보가 없습니다.
            </v-list-item-title>
          </v-list-item>

          <v-list-item class="py-2">
            <v-btn block variant="flat" @click="openAddChildRideDialog">
              원아 추가
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
        <v-btn
          variant="text"
          color="error"
          size="large"
          @click="handleDeleteMeetingLocation"
        >
          {{ `${form.name} 삭제` }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  deleteChildRide,
  getAttendingChildren,
  deleteMeetingLocation,
} from '@/api/api'
import ManageMeetingLocationDialog from '@/components/dialog/ManageMeetingLocationDialog.vue'
import SearchChildDialog from '@/components/dialog/SearchChildDialog.vue'
import { useGlobal } from '@/composables/useGlobal'

const { $showMessage, $showError, $withLoading, $dialog, $confirm } =
  useGlobal() as any

// ✅ 플러그인 연동용 props
const props = defineProps({
  id: { type: [String, Number], default: '' },
  name: { type: String, default: '' },
  time: { type: String, default: '' },
  childRideList: { type: Array, default: () => [] },
  onClose: { type: Function, default: () => {} },
  onError: { type: Function, default: () => {} },
})

// ✅ 상태 관리
const dialogModel = ref<boolean>(true)
const isMobile = ref<boolean>(false)
const groups = ref<{ location: boolean; children: boolean }>({
  location: true,
  children: true,
})

// ✅ 폼 데이터
const form = ref<any>({
  id: props.id,
  name: props.name,
  time: props.time,
  childRideList: [...props.childRideList],
})

// ✅ 모바일 감지
const checkIfMobile = () => {
  const ua = navigator.userAgent || navigator.vendor || (window as any).opera
  isMobile.value =
    /android/i.test(ua) ||
    (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream)
}

// ✅ 다이얼로그 닫기
const handleCancel = () => {
  dialogModel.value = false
  setTimeout(() => {
    props.onClose(true)
  }, 150)
}

// ✅ 승하차 장소 정보 수정
const openMeetingLocationDialog = async () => {
  try {
    const result = await $dialog?.(ManageMeetingLocationDialog, {
      id: form.value.id,
      name: form.value.name,
      time: form.value.time,
      isEdit: true,
    })

    if (result) {
      form.value.name = result.name
      form.value.time = result.time
    }
  } catch (e) {
    console.error('MeetingLocationDialog error:', e)
    props.onError?.(e)
  }
}

// ✅ 원아 삭제
const deleteChildRide1 = async (childRide: any) => {
  try {
    const confirmed = await $confirm?.({
      message: `${childRide.child?.name}을 정말 "${form.value.name}"에서 제외시키겠습니까?`,
    })

    if (!confirmed) return

    const response =
      (await $withLoading?.(deleteChildRide(childRide.id))) ??
      (await deleteChildRide(childRide.id))

    if (response?.code === '0' || response?.code === 0) {
      $showMessage?.({ type: 'success', message: '성공적으로 삭제했습니다.' })
      // ✅ 배열에서 제거 (Vue 3: splice)
      const idx = form.value.childRideList.findIndex(
        (item: any) => item.id === childRide.id
      )
      if (idx !== -1) {
        form.value.childRideList.splice(idx, 1)
      }
    }
  } catch (e) {
    console.error('Delete child ride error:', e)
    $showError?.(e)
  }
}

// ✅ 승하차 장소 삭제
const handleDeleteMeetingLocation = async () => {
  try {
    const confirmed = await $confirm?.({
      message: `주의: ${form.value.name}을 정말 삭제하시겠습니까?`,
    })

    if (!confirmed) return

    const response =
      (await $withLoading?.(deleteMeetingLocation(form.value.id))) ??
      (await deleteMeetingLocation(form.value.id))

    if (response?.code === '0' || response?.code === 0) {
      $showMessage?.({ type: 'success', message: '성공적으로 삭제했습니다.' })
      handleCancel()
    }
  } catch (e) {
    console.error('Delete meeting location error:', e)
    $showError?.(e)
  }
}

// ✅ 원아 추가 다이얼로그
const openAddChildRideDialog = async () => {
  try {
    // ✅ 현재 코스에 등록되지 않은 원아만 필터링
    const allChildren: any = await getAttendingChildren()
    const availableChildren = (allChildren?.data || []).filter(
      (child: any) =>
        !form.value.childRideList.some((cr: any) => cr.child?.id === child.id)
    )

    const result = await $dialog?.(SearchChildDialog, {
      meetingLocationName: form.value.name,
      meetingLocationId: form.value.id,
      childList: availableChildren,
    })

    if (result?.length) {
      $showMessage?.({ type: 'success', message: '성공적으로 추가했습니다.' })
      // ✅ 배열에 추가 (Vue 3: push)
      form.value.childRideList.push(...result)
    }
  } catch (e) {
    console.error('Add child ride error:', e)
    props.onError?.(e)
  }
}

// ✅ 마운트 시 초기화
onMounted(() => {
  checkIfMobile()

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
._list-title-with-sub {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

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
