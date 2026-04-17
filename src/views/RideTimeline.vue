<template>
  <v-card class="mx-auto" style="padding: 0">
    <v-card flat variant="tonal" class="_timeline">
      <!-- 오전 배경 -->
      <v-img
        v-if="selectedAmPm === '오전'"
        src="@/assets/images/morning.webp"
        gradient="to top, rgba(0,0,0,.2), rgba(0,0,0,0.6)"
      >
        <v-container class="pa-6">
          <div class="_timeline-top">
            <div class="_timeline-select">
              <v-select
                v-model="selectedAmPm"
                :items="['오전', '오후']"
                variant="solo"
                bg-color="white"
                density="compact"
                class="me-2"
                @update:model-value="handleAmPmChange"
              ></v-select>
              <v-select
                v-model="selectedRide"
                :items="selectedAmPm === '오전' ? amRideList : pmRideList"
                item-title="name"
                return-object
                variant="solo"
                bg-color="white"
                density="compact"
                label="차량 선택"
              ></v-select>
            </div>
            <div class="_btn-grp flex-nowrap">
              <v-btn
                @click="openRideTable"
                variant="flat"
                color="black"
                class="font-weight-regular"
                size="small"
              >
                <v-icon icon="ri-printer-line" start></v-icon>
                인쇄
              </v-btn>
              <v-btn
                @click="openAddMeetingLocationDialog"
                variant="flat"
                color="accent"
                class="ml-2 font-weight-regular"
                size="small"
              >
                <v-icon icon="ri-add-line" start></v-icon>
                장소 추가
              </v-btn>
            </div>
          </div>
        </v-container>
      </v-img>

      <!-- 오후 배경 -->
      <v-img
        v-if="selectedAmPm === '오후'"
        src="@/assets/images/sunset.webp"
        gradient="to top, rgba(0,0,0,.2), rgba(0,0,0,0.6)"
      >
        <v-container class="pa-6">
          <div class="_timeline-top">
            <div class="_timeline-select">
              <v-select
                v-model="selectedAmPm"
                :items="['오전', '오후']"
                variant="solo"
                bg-color="white"
                density="compact"
                class="me-2"
                @update:model-value="handleAmPmChange"
              ></v-select>
              <v-select
                v-model="selectedRide"
                :items="selectedAmPm === '오전' ? amRideList : pmRideList"
                item-title="name"
                return-object
                variant="solo"
                bg-color="white"
                density="compact"
                label="차량 선택"
              ></v-select>
            </div>
            <div class="_btn-grp flex-nowrap">
              <v-btn
                @click="openRideTable"
                variant="flat"
                class="font-weight-regular"
                size="small"
              >
                <v-icon icon="ri-printer-line" start></v-icon>
                인쇄
              </v-btn>
              <v-btn
                @click="openAddMeetingLocationDialog"
                variant="flat"
                color="accent"
                class="ml-2"
                size="small"
              >
                <v-icon icon="ri-add-line" start></v-icon>
                장소 추가
              </v-btn>
            </div>
          </div>
        </v-container>
      </v-img>
    </v-card>

    <v-card-text>
      <v-timeline
        v-if="selectedRide?.meetingLocationList?.length"
        dense
        side="end"
        class="pt-0"
      >
        <v-timeline-item
          v-for="(meetingLocation, index) in selectedRide.meetingLocationList"
          :key="meetingLocation.id || index"
          :color="selectedAmPm === '오전' ? 'tertiary' : 'info'"
          size="small"
          class="py-2"
        >
          <v-card
            :class="selectedAmPm === '오전' ? '_am-card' : '_pm-card'"
            class="_timeline-card py-4"
            variant="outlined"
            rounded="lg"
          >
            <v-card-title class="py-0 d-flex align-start justify-space-between">
              <div>
                <h3 class="text-h6 font-weight-bold">
                  {{ meetingLocation.time }}
                </h3>
                <p class="text-body-1 mt-1">
                  {{ meetingLocation.name }}
                  <small v-if="meetingLocation.comment" class="text-grey">
                    ({{ meetingLocation.comment }})
                  </small>
                </p>
              </div>
              <v-btn
                icon
                size="small"
                variant="text"
                @click="openMeetingLocationMoreInfo(meetingLocation)"
              >
                <v-icon icon="ri-edit-2-fill"></v-icon>
              </v-btn>
            </v-card-title>

            <v-card-text class="py-2">
              <v-chip
                v-for="(childRide, j) in meetingLocation.childRideList"
                :key="childRide.id || j"
                variant="outlined"
                size="small"
                class="me-2 mb-2"
                @click="openParentsDialog(meetingLocation.childRideList)"
              >
                <b class="me-1">{{ childRide.child?.name }}</b>
                <span class="text-grey"
                  >({{ childRide.child?.className }})</span
                >
                <span v-if="childRide.comment" class="_comment text-grey ms-1">
                  {{ childRide.comment }}
                </span>
              </v-chip>
            </v-card-text>
          </v-card>
        </v-timeline-item>
      </v-timeline>

      <div v-else class="text-center py-16">
        <v-icon icon="mdi-information-off" size="48" class="mb-4"></v-icon>
        <p class="text-body-1 text-grey">승하차 장소의 정보가 없습니다</p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getRideList } from '@/api/api'
import ReadParentsDialog from '@/components/dialog/ReadParentsDialog.vue'
import MeetingLocationMoreInfo from '@/views/MeetingLocationMoreInfo.vue'
import ManageMeetingLocationDialog from '@/components/dialog/ManageMeetingLocationDialog.vue'
import { useGlobal } from '@/composables/useGlobal'

const router = useRouter()
const { $showMessage, $showError, $withLoading, $dialog } = useGlobal()

// ✅ 상태 관리
const events = ref<any[]>([])
const input = ref<any>(null)
const nonce = ref<number>(0)
const rideList = ref<any[]>([])
const amRideList = ref<any[]>([])
const pmRideList = ref<any[]>([])
const selectedRide = ref<any>({ meetingLocationList: [], am: false })
const selectedAmPm = ref<string>('오전')
const isMobile = ref<boolean>(false)

// ✅ 차량 목록 로딩
const fetchRideList = async (init: boolean = false) => {
  rideList.value = []
  amRideList.value = []
  pmRideList.value = []

  try {
    await $withLoading(
      getRideList().then((response: any) => {
        if (response?.code === '0' || response?.code === 0) {
          rideList.value = response.data || []

          response.data?.forEach((item: any) => {
            if (item.am) amRideList.value.push(item)
            else pmRideList.value.push(item)
          })

          if (init && amRideList.value[0]) {
            selectedRide.value = amRideList.value[0]
          } else if (selectedRide.value?.id) {
            const targetList = selectedRide.value.am
              ? amRideList.value
              : pmRideList.value
            const found = targetList.find(
              (ride: any) => ride.id === selectedRide.value.id
            )
            if (found) selectedRide.value = found
          }
        }
      })
    )
  } catch (e) {
    console.error('Fetch ride list error:', e)
    $showError?.(e)
  }
}

// ✅ 오전/오후 변경 핸들러
const handleAmPmChange = () => {
  const targetList =
    selectedAmPm.value === '오전' ? amRideList.value : pmRideList.value
  if (targetList?.[0]) {
    selectedRide.value = targetList[0]
  }
}

// ✅ 보호자 정보 다이얼로그
const openParentsDialog = async (childRideList: any[]) => {
  try {
    await $dialog?.(ReadParentsDialog, childRideList)
  } catch (e) {
    console.error('ReadParentsDialog error:', e)
  }
}

// ✅ 승하차 장소 상세 정보
const openMeetingLocationMoreInfo = async (meetingLocation: any) => {
  try {
    const result = await $dialog?.(MeetingLocationMoreInfo, meetingLocation)
    if (result) {
      await fetchRideList()
    }
  } catch (e) {
    console.error('MeetingLocationMoreInfo error:', e)
    $showError?.(e)
  }
}

// ✅ 승하차 장소 추가 다이얼로그
const openAddMeetingLocationDialog = async () => {
  if (!selectedRide.value?.id) {
    $showMessage?.({
      type: 'warning',
      message: '차량을 먼저 선택해주세요.',
    })
    return
  }

  try {
    const result = await $dialog?.(ManageMeetingLocationDialog, {
      isEdit: false,
      sunnyRide: selectedRide.value,
    })
    if (result) {
      await fetchRideList()
    }
  } catch (e) {
    console.error('ManageMeetingLocationDialog error:', e)
    $showError?.(e)
  }
}

// ✅ 모바일 감지
const checkIfMobile = () => {
  const ua =
    navigator.userAgent || navigator.vendor || (window as any).opera
  isMobile.value =
    /android/i.test(ua) ||
    (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream)
}

// ✅ 인쇄용 테이블 새 창 열기
const openRideTable = () => {
  if (!selectedRide.value?.id) {
    $showMessage?.({
      type: 'warning',
      message: '차량을 먼저 선택해주세요.',
    })
    return
  }

  const url = router.resolve({
    name: 'RideTimelineTable',
    query: { id: selectedRide.value.id },
  }).href
  window.open(url, '_blank')
}

// ✅ 마운트 시 초기화
onMounted(() => {
  fetchRideList(true)
  checkIfMobile()
})

// ✅ selectedAmPm 변경 시 selectedRide 초기화
watch(selectedAmPm, () => {
  handleAmPmChange()
})
</script>

<style scoped>
._timeline {
  position: relative;
}

._timeline-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

._timeline-select {
  display: flex;
  gap: 8px;
  flex: 1;
  min-width: 200px;
}

._timeline-select :deep(.v-select) {
  min-width: 120px;
}

._btn-grp {
  display: flex;
  gap: 8px;
}

._timeline-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

._timeline-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

._am-card {
  border-left: 4px solid var(--v-tertiary-base);
}

._pm-card {
  border-left: 4px solid var(--v-info-base);
}

._comment {
  font-size: 0.75rem;
  opacity: 0.8;
}

._list-title-with-sub {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

/* Vue 3 deep selector */
:deep(.v-timeline-item__dot) {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

:deep(.v-chip__content) {
  font-size: 0.875rem;
}

/* 모바일 대응 */
@media (max-width: 600px) {
  ._timeline-top {
    flex-direction: column;
    align-items: stretch;
  }

  ._timeline-select {
    flex-direction: column;
  }

  ._timeline-select :deep(.v-select) {
    width: 100%;
  }

  ._btn-grp {
    justify-content: center;
  }

  :deep(.v-timeline) {
    padding-left: 8px;
  }

  :deep(.v-timeline-item__body) {
    min-width: 0;
  }
}
</style>
