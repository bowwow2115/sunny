<template>
  <!-- ✅ teleport="body" 로 오버레이 컨텍스트 보장 -->
  <v-dialog
    v-model="dialogModel"
    persistent
    max-width="600px"
    teleport="body"
    @click:outside="handleCancel"
  >
    <v-card class="pa-2">
      <!-- 헤더 -->
      <v-card-title class="d-flex align-center justify-space-between">
        <span class="text-h6 font-weight-bold">
          {{
            (am ? '오전' : '오후') +
            (isEdit ? '차량 정보 수정' : '차량 정보 추가')
          }}
        </span>
        <v-btn icon size="small" variant="text" @click="handleCancel">
          <v-icon icon="ri-close-line"></v-icon>
        </v-btn>
      </v-card-title>

      <v-form ref="formRef" v-model="isValid">
        <v-card-text class="mt-4">
          <v-row>
            <!-- 코스 선택 -->
            <v-col cols="12" md="6">
              <v-select
                v-model="selectedSunnyRide"
                :items="am ? amRideList : pmRideList"
                item-title="name"
                item-value="id"
                return-object
                clearable
                :rules="rideRules"
                :label="(am ? '오전' : '오후') + ' 코스를 선택해주세요'"
                variant="outlined"
                hide-details="auto"
                density="comfortable"
                @update:model-value="resetMeetingLocation"
              ></v-select>
            </v-col>

            <!-- 승하차 장소 선택 -->
            <v-col cols="12" md="6">
              <v-select
                v-model="form.meetingLocation.id"
                :items="selectedSunnyRide?.meetingLocationList || []"
                item-title="name"
                item-value="id"
                :label="'승하차 장소를 선택해주세요.'"
                :rules="meetingLocationRules"
                variant="outlined"
                hide-details="auto"
                density="comfortable"
                :disabled="!selectedSunnyRide?.id"
              ></v-select>
            </v-col>

            <!-- 비고 -->
            <v-col cols="12">
              <v-text-field
                v-model="form.comment"
                prepend-inner-icon="ri-message-2-fill"
                label="비고"
                variant="outlined"
                clearable
                clear-icon="ri-close-circle-fill"
                density="comfortable"
              ></v-text-field>
            </v-col>
          </v-row>
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
import { ref, computed, onMounted, watch } from 'vue'
import { getRideList, addChildRide, updateChildRide } from '@/api/api'
import { useGlobal } from '@/composables/useGlobal'
import type { Ride } from '@/types'

const { $showError, $withLoading } = useGlobal()

// ✅ 플러그인 연동용 props
const props = defineProps({
  // 데이터 props
  id: { type: [String, Number], default: '' },
  comment: { type: String, default: '' },
  meetingLocation: { type: Object, default: () => ({}) },
  child: { type: Object, default: () => ({}) },
  isEdit: { type: Boolean, default: false },
  am: { type: Boolean, default: true }, // 오전/오후 구분

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
const form = ref<any>({
  id: props.id,
  comment: props.comment,
  meetingLocation: { ...props.meetingLocation },
  child: { ...props.child },
})

// ✅ 차량 목록 (오전/오후 분리)
const amRideList = ref<any[]>([])
const pmRideList = ref<any[]>([])
/** 빈 객체로 두면 라벨이 없어 [object Object]로 보임 — 선택 전에는 null */
const selectedSunnyRide = ref<any>(null)

// ✅ 검증 규칙 (빈 객체 {} 는 truthy라 id 기준으로 검사)
const rideRules = [(v: any) => !!(v && v.id) || '필수 항목입니다.']
const meetingLocationRules = [(v: any) => !!v || '필수 항목입니다.']

// ✅ 차량 목록 로딩
const fetchRideList = async () => {
  try {
    const response = await getRideList()

    if (response?.data) {
      // ✅ 데이터 가공: meetingLocation 이름 포맷팅
      response.data.forEach((ride: any) => {
        // ✅ 원본 데이터 변조 방지를 위해 얕은 복사 고려 (필요시)
        if (ride.meetingLocationList) {
          ride.meetingLocationList = ride.meetingLocationList.map(
            (loc: any) => ({
              ...loc,
              name: `${loc.name}(${loc.time})`,
            })
          )
        }

        if (ride.am) {
          amRideList.value.push(ride)
        } else {
          pmRideList.value.push(ride)
        }
      })

      // ✅ 수정 모드인 경우 기존 선택값 복원
      if (props.isEdit && props.meetingLocation?.sunnyRide?.id) {
        const targetList = props.am ? amRideList.value : pmRideList.value
        const found = targetList.find(
          (item: any) => item.id === (props.meetingLocation as any).sunnyRide.id
        )
        if (found) {
          selectedSunnyRide.value = found
        }
      }
    }
  } catch (error) {
    console.error('Failed to load ride list:', error)
    $showError?.(error)
  }
}

// ✅ 승하차 장소 초기화 (코스 변경·해제 시)
const resetMeetingLocation = () => {
  if (!form.value.meetingLocation) {
    form.value.meetingLocation = {}
  }
  form.value.meetingLocation.id = ''
  form.value.meetingLocation.name = ''
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

  // ✅ 선택된 코스 정보 form 에 병합
  if (selectedSunnyRide.value) {
    form.value.meetingLocation.sunnyRide = {
      ...selectedSunnyRide.value,
      am: props.am,
    }
  }

  loading.value = true

  try {
    const apiCall = props.isEdit
      ? () => updateChildRide(form.value)
      : () => addChildRide(form.value)

    const response: any = await ($withLoading?.(apiCall()) ?? apiCall())

    if (response?.code === '0' || response?.code === 0) {
      // $showMessage?.({ type: 'success', message: '성공적으로 저장했습니다.' })
      dialogModel.value = false
      setTimeout(() => {
        props.onClose(response.data)
      }, 150)
    }
  } catch (error) {
    console.error('Save ride error:', error)
    props.onError?.(error)
    $showError?.(error)
  } finally {
    loading.value = false
  }
}

// ✅ 마운트 시 초기화
onMounted(() => {
  fetchRideList()

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
