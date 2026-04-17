<template>
  <div>
    <!-- ✅ v-if 조건에 childrenList 도 체크 -->
    <!-- group by 기능 vuetify3 부터 변경된 듯 -->
    <!-- :sort-by="sortBy"
      :sort-desc="sortDesc"
      v-model:group-by="groupBy" -->
    <v-data-table
      v-if="Array.isArray(childrenList) && childrenList.length >= 0"
      v-model="selectedRow"
      :items="childrenList"
      v-model:items-per-page="itemsPerPage"
      v-model:page="page"
      :search="search"
      :headers="headers"
      :dense="true"
      show-select
      item-key="id"
      no-data-text="등록된 원아가 존재하지 않습니다."
      class="elevation-1 mt-0 _mobile-table"
      hide-default-footer
      :items-per-page-text="'명씩'"
    >
      <!-- 상단 툴바 -->
      <template v-slot:top>
        <v-toolbar dark color="primary" class="_custom-toolbar mb-4">
          <v-text-field
            v-model="search"
            clearable
            flat
            variant="solo"
            bg-color="white"
            hide-details
            prepend-inner-icon="ri-search-line"
            label="검색어를 입력하세요."
            class="me-2"
          ></v-text-field>

          <v-select
            v-model="groupBy"
            flat
            variant="solo"
            bg-color="white"
            hide-details
            prepend-inner-icon="ri-sort-desc"
            :items="[
              { name: '반명', value: 'className' },
              { name: '재원여부', value: 'status' },
            ]"
            item-title="name"
            item-value="value"
            label="집합 정렬할 기준을 선택해주세요."
            class="_group-select"
            clearable
          ></v-select>
        </v-toolbar>
      </template>

      <!-- 액션 버튼 -->
      <template #[`item.actions`]="{ item }">
        <v-btn icon size="small" variant="text" @click="openInfoDialog(item)">
          <v-icon icon="ri-more-2-line"></v-icon>
        </v-btn>
      </template>

      <!-- ✅ body-append: 슬롯에서 headers 받지 않고, 고정값 또는 computed 사용 -->
      <template v-slot:body-append="{ items }">
        <tr>
          <td
            :colspan="headers.length + 1"
            class="text-center py-2 text-body-2 grey--text"
          >
            총 {{ items?.length || 0 }}건의 원아가 검색되었습니다.
          </td>
        </tr>
      </template>

      <!-- 푸터 -->
      <template v-slot:footer>
        <v-row class="align-center" style="padding: 5px">
          <v-col cols="auto">
            <v-btn
              type="button"
              class="font-weight-bold"
              color="accent"
              variant="flat"
              @click="openChangeClassDialog"
            >
              반 변경
            </v-btn>
          </v-col>

          <v-col class="d-flex align-center justify-end">
            <v-menu location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  variant="outlined"
                  size="small"
                  class="me-2"
                  v-bind="props"
                >
                  {{
                    itemsPerPage === -1 ? '모두' : itemsPerPage + '명씩 보기'
                  }}
                  <v-icon icon="ri-arrow-down-s-fill" end></v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(number, index) in itemsPerPageArray"
                  :key="index"
                  @click="updateItemsPerPage(number)"
                >
                  <v-list-item-title>
                    {{ number === -1 ? '모두' : number }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <div class="d-flex align-center">
              <v-btn
                icon
                size="small"
                variant="tonal"
                :disabled="page <= 1"
                @click="formerPage"
              >
                <v-icon icon="ri-arrow-left-s-line"></v-icon>
              </v-btn>

              <span class="grey--text mx-4 text-body-2">
                {{ page }} / {{ numberOfPages }}
              </span>

              <v-btn
                icon
                size="small"
                variant="tonal"
                :disabled="page >= numberOfPages"
                @click="nextPage"
              >
                <v-icon icon="ri-arrow-right-s-line"></v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </template>
    </v-data-table>

    <!-- ✅ 로딩 중일 때 대체 UI -->
    <div v-else class="text-center py-8">
      <v-progress-circular indeterminate color="primary" size="48" />
      <p class="mt-4 text-body-2 grey--text">데이터를 불러오는 중...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { getAllChildren } from '@/api/api'
import ChildMoreInfo from '@/views/ChildMoreInfo.vue' // ← 유지 가능

import ChangeClassDialog from '@/components/dialog/ChangeClassDialog.vue'
import { useGlobal } from '@/composables/useGlobal'
import type { Child } from '@/types'

const { $showMessage, $showError, $withLoading, $dialog } = useGlobal()

// ✅ 상태 정의
const childrenList = ref<Child[]>([])
const itemsPerPageArray: number[] = [20, 30, 40, 50, -1]
const search = ref<string>('')
const sortDesc = ref<boolean>(false)
const page = ref<number>(1)
const itemsPerPage = ref<number>(10) // ✅ 초기값을 -1 이 아닌 숫자로 설정
const sortBy = ref<string>('name')
const groupBy = ref<string | null>(null)
const selectedRow = ref<Child[]>([])

// ❌ headers 는 ref() 로 감싸지 않음! (Vuetify 내부 처리와 충돌)
// ✅ 평범한 상수 배열로 정의
const headers = [
  { title: '이름', key: 'name' },
  { title: '입학일', key: 'admissionDate' },
  { title: '반명', key: 'className' },
  { title: '주소', key: 'addressName' },
  { title: '생일', key: 'birthday' },
  { title: '재원여부', key: 'status' },
  { title: '보호자', key: 'parents' },
  { title: '작업', key: 'actions', sortable: false },
]

// ✅ groupBy 유효성 검사 (headers.key 와 일치하는지)
watch(groupBy, (newVal: string | null) => {
  if (!newVal) return
  const validKeys = headers.map((h) => h.key)
  if (!validKeys.includes(newVal)) {
    console.warn(`⚠️ Invalid groupBy: "${newVal}"`)
    groupBy.value = null
  }
})

// ✅ 페이지 수 계산 (안전 처리)
const numberOfPages = computed(() => {
  const list = childrenList.value || []
  const perPage =
    itemsPerPage.value === -1 ? list.length : itemsPerPage.value || 10
  return perPage > 0 ? Math.ceil(list.length / perPage) : 1
})

onMounted(() => {
  fetchAllChildren()
})

// ✅ 데이터 로딩 - 모든 필드 안전 처리 + 필수 id 보장
const fetchAllChildren = async () => {
  try {
    await $withLoading(
      getAllChildren().then((response: any) => {
        if (response?.code === '0' && Array.isArray(response.data)) {
          childrenList.value = response.data.map((element: any) => {
            const parentNameList =
              element.parentList?.map((parent: any) => parent.name).join(' ') ||
              ''

            return {
              ...element,
              // ✅ item-key="id" 에 필수: 모든 아이템에 id 보장
              id:
                element.id ??
                element.idx ??
                `child_${Date.now()}_${Math.random()}`,
              parents: parentNameList,
              actions: null,
              addressName: `${element.address?.address || ''} ${
                element.address?.detailAddress || ''
              }`.trim(),
              className: element.className ?? '',
              status: element.status ?? '',
              // ✅ groupBy 에서 사용할 필드들도 항상 존재하도록
              admissionDate: element.admissionDate ?? '',
              birthday: element.birthday ?? '',
              name: element.name ?? '',
            }
          })
        } else {
          childrenList.value = []
        }
      })
    )
  } catch (e) {
    console.error('Fetch error:', e)
    childrenList.value = []
    $showError?.(e)
  }
}

// 반 변경 다이얼로그
const openChangeClassDialog = async () => {
  if (selectedRow.value.length === 0) {
    $showMessage?.({
      type: 'warning',
      message: '선택된 원아가 없습니다.',
    })
    return
  }

  try {
    const result = await $dialog?.(ChangeClassDialog, selectedRow.value)
    if (result) {
      $showMessage?.({
        type: 'success',
        message: '성공적으로 변경했습니다.',
      })
      await fetchAllChildren()
    }
  } catch (e) {
    $showError?.(e)
  }
}

// 상세 정보 다이얼로그
// ChildList.vue - openInfoDialog 함수
const openInfoDialog = async (info: any) => {
  console.log('[openInfoDialog] Called with:', info)
  console.log('[openInfoDialog] $dialog available:', !!$dialog)

  // ✅ 입력 검증
  if (!info?.id) {
    $showMessage?.({
      type: 'warning',
      message: '유효하지 않은 원아 정보입니다.',
    })
    return
  }

  // ✅ 승하차 정보 분리
  const amChildRideList: any[] = []
  const pmChildRideList: any[] = []

  if (Array.isArray(info.childRideList)) {
    info.childRideList.forEach((childRide: any) => {
      const isAm = childRide?.meetingLocation?.sunnyRide?.am === true
      ;(isAm ? amChildRideList : pmChildRideList).push(childRide)
    })
  }

  try {
    console.log('[openInfoDialog] About to open dialog...')
    // ✅ $dialog 로 동적 마운트 (ChildMoreInfo 는 템플릿에 없어야 함!)
    const result = await $dialog?.(ChildMoreInfo, {
      id: info.id,
      name: info.name ?? '',
      admissionDate: info.admissionDate ?? '',
      className: info.className ?? '',
      birthday: info.birthday ?? '',
      status: info.status ?? '',
      address: info.address,
      parentList: info.parentList,
      amChildRideList,
      pmChildRideList,
      closable: true, // ✅ ESC/오버레이 클릭으로 닫기 허용
    })

    console.log('[openInfoDialog] Result:', result)

    // ✅ 결과 처리
    if (result?.success === true && result?.id === info.id) {
      $showMessage?.({ type: 'success', message: '성공적으로 삭제했습니다.' })
      // 목록에서 제거
      const idx = childrenList.value.findIndex(
        (item: Child) => item.id === info.id
      )
      if (idx !== -1) childrenList.value.splice(idx, 1)
      // 선택 상태도 동기화
      const selIdx = selectedRow.value.findIndex(
        (item: Child) => item.id === info.id
      )
      if (selIdx !== -1) selectedRow.value.splice(selIdx, 1)
    } else if (result?.refresh === true) {
      await fetchAllChildren()
    }
    // result === null 이면 취소/닫기: 아무 작업 안 함
  } catch (error) {
    console.error('[openInfoDialog] Error:', error)
    $showError?.(error)
    await fetchAllChildren() // 데이터 무결성 보장
  }
}

// 페이지네이션 핸들러
const nextPage = () => {
  if (page.value < numberOfPages.value) {
    page.value += 1
  }
}

const formerPage = () => {
  if (page.value > 1) {
    page.value -= 1
  }
}

const updateItemsPerPage = (number: number) => {
  itemsPerPage.value = number
  page.value = 1 // 페이지 수 변경 시 첫 페이지로 이동
}

// 외부에서 호출 가능한 메서드 노출 (필요시)
defineExpose({
  refresh: fetchAllChildren,
})
</script>

<style scoped>
._custom-toolbar {
  position: sticky;
  top: 0;
  z-index: 2;
  height: unset;
}

/* Vue 3: deep selector 는 :deep() 사용 */
._custom-toolbar :deep(.v-select) {
  width: min-content;
}

._group-select {
  min-width: 200px;
}

._mobile-table :deep(.v-data-table-header) {
  font-size: 0.875rem;
}

._mobile-table :deep(.v-data-table__td) {
  padding: 8px 12px;
}
</style>
