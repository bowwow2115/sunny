<template>
  <div class="_print-paper">
    <v-card elevation="0">
      <v-card-title class="d-flex align-center justify-space-between">
        <v-select
          v-model="selectedRide"
          :items="rideList"
          item-title="name"
          return-object
          variant="outlined"
          density="compact"
          label="차량 선택"
          class="me-4"
          style="max-width: 400px"
        ></v-select>

        <v-btn
          variant="flat"
          color="black"
          class="font-weight-regular no-print"
          @click="handlePrint"
        >
          <v-icon icon="ri-printer-line" color="white" start></v-icon>
          인쇄
        </v-btn>
      </v-card-title>

      <v-table density="compact" fixed-header class="_print-ride-table">
        <thead>
          <tr>
            <th class="text-left">장소</th>
            <th class="text-left">시간</th>
            <th class="text-left">비고</th>
            <th class="text-left">원아</th>
            <th class="text-left">보호자1</th>
            <th class="text-left">보호자2</th>
            <th class="text-left">요일</th>
          </tr>
        </thead>
        <tbody>
          <template
            v-for="(meetingLocation, j) in selectedRide?.meetingLocationList ||
            []"
            :key="meetingLocation.id || j"
          >
            <tr
              v-for="(childRide, k) in meetingLocation.childRideList || []"
              :key="childRide.id || `${j}-${k}`"
            >
              <!-- 첫 번째 childRide에만 장소/시간/비고 출력 (rowspan) -->
              <template v-if="k === 0">
                <td
                  :rowspan="meetingLocation.childRideList?.length || 1"
                  class="_rt-lo"
                >
                  <v-icon
                    icon="ri-map-pin-fill"
                    size="small"
                    class="me-1"
                  ></v-icon>
                  {{ meetingLocation.name }}
                </td>
                <td
                  :rowspan="meetingLocation.childRideList?.length || 1"
                  class="_rt-da"
                >
                  {{ meetingLocation.time }}
                </td>
                <td
                  :rowspan="meetingLocation.childRideList?.length || 1"
                  class="_rt-co"
                >
                  {{ meetingLocation.comment || '-' }}
                </td>
              </template>

              <td class="py-2">
                {{
                  `${childRide.child?.name || ''} (${
                    childRide.child?.className || ''
                  })`
                }}
              </td>
              <td class="py-2">
                {{ formatParent(childRide.child?.parentList?.[0]) }}
              </td>
              <td class="py-2">
                {{ formatParent(childRide.child?.parentList?.[1]) }}
              </td>
              <td class="py-2">
                <div class="_rt-day">
                  <span
                    v-for="day in ['월', '화', '수', '목', '금']"
                    :key="day"
                    >{{ day }}</span
                  >
                </div>
              </td>
            </tr>
          </template>

          <!-- 총 인원 행 -->
          <tr class="_rt-total">
            <td colspan="7" class="text-center font-weight-bold">
              총 인원: {{ selectedRide?.count || 0 }}명
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getRideList } from '@/api/api'
import { useGlobal } from '@/composables/useGlobal'

const route = useRoute()
const { $showError, $withLoading } = useGlobal()

// ✅ 상태 관리
const rideList = ref([])
const selectedRide = ref(null)

// ✅ 보호자 정보 포맷팅 헬퍼
const formatParent = (parent) => {
  if (!parent) return ''
  return `${parent.telephone || ''} (${parent.relation || ''})`
}

// ✅ 차량 목록 로딩
const fetchRideList = async () => {
  rideList.value = []

  try {
    await $withLoading(
      getRideList().then((response) => {
        if (response?.code === '0' || response?.code === 0) {
          const data = response.data || []

          rideList.value = data.map((item) => {
            // ✅ 총 인원 계산
            let count = 0
            item.meetingLocationList?.forEach((ml) => {
              count += ml.childRideList?.length || 0
            })

            // ✅ 오전/오후 접두사 추가
            const prefix = item.am ? '오전 ' : '오후 '

            return {
              ...item,
              name: prefix + (item.name || ''),
              count,
            }
          })

          // ✅ URL 쿼리 파라미터에 맞는 차량 선택
          const rideId = route.query?.id
          if (rideId) {
            selectedRide.value =
              rideList.value.find((ride) => ride.id == rideId) ||
              rideList.value[0]
          } else {
            selectedRide.value = rideList.value[0] || null
          }
        }
      })
    )
  } catch (e) {
    console.error('Fetch ride list error:', e)
    $showError?.(e)
  }
}

// ✅ 인쇄 실행
const handlePrint = () => {
  window.print()
}

// ✅ 마운트 시 초기화
onMounted(() => {
  console.log('Received query:', route.query)
  fetchRideList()
})
</script>

<style scoped>
/* ********** 기본 스타일 ********** */
._print-paper {
  display: block;
  margin: 1rem 10%;
  background: #fff;
}

._print-ride-table {
  /* 짝수 행 배경색 */
  :deep(tbody tr:nth-child(even)) {
    background-color: #f5f5f5;
  }

  /* 호버 효과 (인쇄 시 제외) */
  :deep(tbody tr) {
    transition: background-color 0.2s;
  }

  :deep(tbody tr:hover) {
    background-color: var(--v-secondary-lighten5, #fafafa) !important;
  }

  /* rowspan 셀 스타일 */
  ._rt-lo,
  ._rt-da,
  ._rt-co {
    border-bottom: none !important;
    vertical-align: top;
  }

  ._rt-lo {
    font-weight: 600;
    word-break: keep-all;
  }

  /* 요일 칩 스타일 */
  ._rt-day {
    display: flex;
    align-items: center;
    gap: 0.5em;

    span {
      display: flex;
      align-items: center;
      justify-content: center;
      border: thin solid rgba(0, 0, 0, 0.12);
      font-size: 0.8em;
      width: 25px;
      height: 25px;
      border-radius: 100%;
    }
  }

  /* 아이콘 스타일 */
  :deep(.v-icon) {
    font-size: 1.2em;
    opacity: 0.8;
  }

  /* 총 인원 행 */
  ._rt-total {
    background: none !important;
    color: unset;
    border-top: thin solid rgba(0, 0, 0, 0.87);
    text-align: center;
    padding: 10px;
  }
}

/* 인쇄 버튼 숨김 클래스 */
.no-print {
  @media print {
    display: none !important;
  }
}

/* ********** 인쇄 전용 스타일 ********** */
@media print {
  /* 색상 정확히 출력 */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* A4 용지 설정 */
  @page {
    size: A4;
    margin: 10mm;
  }

  html,
  body {
    margin: 0;
    padding: 0;
    background-color: #fff !important;
    -webkit-print-color-adjust: exact;
  }

  ._print-paper {
    width: 210mm;
    min-height: 297mm;
    margin: 0 auto;
    padding: 0;
    box-sizing: border-box;
    background: #fff;
  }

  ._print-ride-table {
    /* 페이지 분할 방지 */
    :deep(tr) {
      page-break-inside: avoid;
      page-break-after: auto;
    }

    /* 글자 크기 조정 */
    :deep(td) {
      font-size: 10px !important;
      padding: 4px 8px !important;
    }

    :deep(th) {
      font-size: 11px !important;
      padding: 6px 8px !important;
    }
  }

  /* Vuetify 컴포넌트 인쇄 최적화 */
  :deep(.v-card) {
    box-shadow: none !important;
    border: none !important;
  }

  :deep(.v-select) {
    pointer-events: none;
  }

  :deep(.v-field__input) {
    min-height: auto !important;
  }
}
</style>
