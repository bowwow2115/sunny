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
      <!-- 헤더 -->
      <v-card-title class="d-flex align-center justify-space-between">
        <span class="text-h6 font-weight-bold">차량 설정</span>
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

      <!-- 차량 목록 섹션 -->
      <v-list class="pa-0">
        <v-list-group v-model="groups.rides" value="rides">
          <template #activator="{ props: activatorProps }">
            <v-list-item v-bind="activatorProps" prepend-icon="ri-bus-2-fill">
              <v-list-item-title>차량</v-list-item-title>
            </v-list-item>
          </template>

          <!-- 차량 목록 -->
          <template v-if="rideList?.length">
            <v-list-item
              v-for="(ride, index) in rideList"
              :key="ride.id || index"
              class="ml-14"
            >
              <v-list-item-icon start class="my-2 mx-3">
                <span
                  :class="{
                    '_list-icon-am': ride.am,
                    '_list-icon-pm': !ride.am,
                  }"
                  class="_list-icon"
                >
                  {{ ride.am ? '오전' : '오후' }}
                </span>
              </v-list-item-icon>

              <v-list-item-title class="_list-title-with-sub">
                {{ ride.name }}
                <span v-if="ride.time" class="text-grey ms-1"
                  >({{ ride.time }})</span
                >
                <span v-if="ride.comment" class="text-grey ms-2">{{
                  ride.comment
                }}</span>
              </v-list-item-title>

              <v-list-item-action start>
                <v-btn
                  icon
                  size="small"
                  variant="text"
                  color="grey"
                  @click="handleDeleteRide(ride)"
                >
                  <v-icon icon="ri-close-circle-fill"></v-icon>
                </v-btn>
                <v-btn
                  icon
                  size="small"
                  variant="text"
                  color="success"
                  class="ms-2"
                  @click="openRideAddDialog(true, ride)"
                >
                  <v-icon icon="ri-edit-2-fill"></v-icon>
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
              등록된 차량의 정보가 없습니다.
            </v-list-item-title>
          </v-list-item>

          <!-- 차량 추가 버튼 -->
          <v-list-item class="py-2">
            <v-btn block variant="flat" @click="openRideAddDialog(false)">
              차량 추가
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
import { getRideList, deleteRide as deleteRideApi } from '@/api/api'
import RideAddDialog from './RideAddDialog.vue'
import { useGlobal } from '@/composables/useGlobal'
import type { Ride } from '@/types'

const { $showMessage, $showError, $withLoading, $dialog, $confirm } =
  useGlobal()

const props = defineProps({
  onClose: { type: Function, default: () => {} },
  onError: { type: Function, default: () => {} },
})

const dialogModel = ref<boolean>(true)
const isMobile = ref<boolean>(false)
const groups = ref<{ rides: boolean }>({ rides: true })
const rideList = ref<Ride[]>([])

const checkIfMobile = (): void => {
  const ua = navigator.userAgent || navigator.vendor || (window as any).opera
  isMobile.value =
    /android/i.test(ua) ||
    (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream)
}

const fetchRideList = async (): Promise<void> => {
  try {
    const response = await getRideList()
    if (response?.code === '0' || response?.code === 0) {
      rideList.value = (response.data || []).sort((a: Ride, b: Ride) => {
        if (a.am === b.am) return 0
        return a.am ? -1 : 1
      })
    }
  } catch (e) {
    console.error('Fetch ride list error:', e)
    $showError?.(e)
  }
}

const handleCancel = (): void => {
  dialogModel.value = false
  setTimeout(() => {
    props.onClose(true)
  }, 150)
}

// ✅ 로컬 함수 이름 변경: deleteRide → handleDeleteRide
const handleDeleteRide = async (ride: Ride): Promise<void> => {
  try {
    const confirmed = await $confirm?.({
      message: `주의: ${ride.name}을 삭제하시면 하위에 있는 승하차장소의 정보들도 삭제됩니다. 정말 삭제하시겠습니까?`,
    })

    if (!confirmed) return

    // ✅ 별칭으로 임포트한 API 함수 호출
    const response =
      (await $withLoading?.(deleteRideApi(ride.id))) ??
      (await deleteRideApi(ride.id))

    if (response?.code === '0' || response?.code === 0) {
      $showMessage?.({ type: 'success', message: '성공적으로 삭제했습니다.' })
      const idx = rideList.value.findIndex((item: Ride) => item.id === ride.id)
      if (idx !== -1) {
        rideList.value.splice(idx, 1)
      }
    }
  } catch (e) {
    console.error('Delete ride error:', e)
    $showError?.(e)
  }
}

const openRideAddDialog = async (
  isEdit: boolean = false,
  ride: Ride = {}
): Promise<void> => {
  try {
    const result = await $dialog?.(RideAddDialog, {
      id: ride.id || '',
      name: ride.name || '',
      time: ride.time || '',
      comment: ride.comment || '',
      am: ride.am ?? true,
      isEdit,
    })

    if (result) {
      $showMessage?.({
        type: 'success',
        message: isEdit ? '수정이 완료되었습니다.' : '추가가 완료되었습니다.',
      })

      if (isEdit) {
        const idx = rideList.value.findIndex(
          (item: Ride) => item.id === (result as Ride).id
        )
        if (idx !== -1) {
          rideList.value[idx] = result as Ride
        }
      } else {
        rideList.value.push(result as Ride)
        rideList.value.sort((a: Ride, b: Ride) => {
          if (a.am === b.am) return 0
          return a.am ? -1 : 1
        })
      }
    }
  } catch (e) {
    console.error('RideAddDialog error:', e)
    props.onError?.(e)
  }
}

onMounted(() => {
  checkIfMobile()
  fetchRideList()

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
._list-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

._list-icon-am {
  background: #e8f5e9;
  color: #388e3c;
}

._list-icon-pm {
  background: #fff3e0;
  color: #f57c00;
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
