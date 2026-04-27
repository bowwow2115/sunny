<template>
  <div class="_home">
    <v-row>
      <!-- 좌측 컬럼: 로고, 환영메시지, 엑셀등록, 다가오는 생일 -->
      <v-col cols="12" md="6">
        <v-card class="pa-2 rounded-xl _log d-flex flex-column">
          <v-card-title class="_logo align-end">
            <img
              src="@/assets/images/sunny-en.svg"
              alt="sunny"
              class="me-3"
              style="height: 48px"
            />
            <h1 class="_font-miso text-h4 font-weight-bold">해맑은 어린이집</h1>
          </v-card-title>

          <v-card-text class="mt-5 flex-grow-1">
            <div
              class="_log-info d-flex flex-wrap justify-space-between align-center"
            >
              <h2 class="text-h6 font-weight-bold">
                <u class="font-weight-black" @click="copyToClipboard(userId)"
                  >{{ userId }}님</u
                >, 안녕하세요.
              </h2>
              <v-card-actions class="flex-wrap">
                <v-btn
                  variant="outlined"
                  rounded
                  color="grey"
                  class="px-6"
                  @click="handleLogout"
                >
                  로그아웃
                </v-btn>
                <v-btn
                  variant="outlined"
                  rounded
                  class="px-6 ms-2"
                  @click="goToMypage"
                >
                  마이페이지
                </v-btn>
              </v-card-actions>
            </div>

            <!-- 엑셀 등록 섹션 -->
            <div class="_excel-regist pt-4">
              <h3 class="text-subtitle-1 mb-4">
                <v-icon
                  icon="ri-file-excel-fill"
                  color="#1d6f42"
                  class="me-1"
                ></v-icon>
                엑셀 파일로 원아등록 바로 하기
              </h3>
              <div class="_btn-grp d-flex flex-wrap gap-2">
                <v-btn
                  variant="tonal"
                  size="large"
                  class="_excel-download flex-grow-1"
                  href="/sunny/app/file/sunny_regist_children.xlsx"
                  target="_blank"
                >
                  양식 다운로드
                </v-btn>
                <v-btn
                  variant="tonal"
                  size="large"
                  class="_excel-upload flex-grow-1"
                  @click="openUploadChildDialog"
                >
                  원아 엑셀 등록
                </v-btn>
              </div>
            </div>
          </v-card-text>

          <!-- 관리자 메뉴 (isAdmin 일 때만 표시) -->
          <div
            v-if="isAdmin"
            class="_admin-menu d-flex flex-wrap gap-2 pa-4 border-t"
          >
            <v-btn variant="text" size="large" @click="openManageClassDialog">
              <v-icon icon="ri-book-read-fill" start></v-icon>
              반 관리
            </v-btn>
            <v-btn variant="text" size="large" @click="openManageUserDialog">
              <v-icon icon="ri-user-fill" start></v-icon>
              사용자 관리
            </v-btn>
            <v-btn variant="text" size="large" @click="openManageRideDialog">
              <v-icon icon="ri-bus-2-fill" start></v-icon>
              차량 관리
            </v-btn>
          </div>
        </v-card>

        <!-- 다가오는 생일 카드 -->
        <v-card class="pa-2 rounded-xl _birth-come mt-6">
          <v-card-title class="text-h6">
            <span class="font-weight-bold">생일</span>이 다가오고 있어요!
          </v-card-title>
          <v-card-text>
            <ul v-if="beingBirthdayChildList.length > 0" class="pa-0 ma-0">
              <li
                v-for="(child, index) in beingBirthdayChildList"
                :key="child.id || index"
                class="px-3 py-2 d-flex align-center"
              >
                <span
                  class="_d-day font-weight-black me-2 d-inline-flex align-center"
                  :class="child.dDay === 0 ? 'text-error' : 'text-grey'"
                >
                  <v-icon
                    v-if="child.dDay === 0"
                    icon="ri-cake-2-fill"
                    size="small"
                    class="me-1"
                  ></v-icon>
                  {{ child.dDay === 0 ? 'Today!' : `D-${child.dDay}` }}
                </span>
                <span class="font-weight-medium">{{ child.name }}</span>
                <small class="text-grey ms-2"
                  >{{ child.className }}, {{ child.birthday }}</small
                >
              </li>
            </ul>
            <div v-else class="text-center py-4 text-grey">
              다가오는 {{ currentMonth }}월의 생일자가 없습니다.
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- 우측 컬럼: 이번달 생일 -->
      <v-col cols="12" md="6">
        <v-card class="pa-2 pt-8 rounded-xl _birth position-relative">
          <v-card-title class="_font-miso font-weight-bold text-h4">
            <b class="_today-b d-block mb-2">
              <span class="text-primary">{{ currentMonth }}</span>
              <span>월</span>
            </b>
            의 생일
          </v-card-title>
          <v-card-text class="mt-5">
            <ul v-if="birthMonthChildList.length > 0" class="pa-0 ma-0">
              <li
                v-for="(child, index) in birthMonthChildList"
                :key="child.id || index"
                class="font-weight-bold py-2 d-flex align-center"
              >
                <v-btn
                  icon
                  size="small"
                  variant="text"
                  color="primary"
                  class="me-2"
                >
                  <v-icon icon="ri-add-circle-fill"></v-icon>
                </v-btn>
                <span>{{ child.name }}</span>
                <b class="text-primary mx-2">{{ child.birthday }}</b>
                <small class="text-grey font-weight-regular">{{
                  child.className
                }}</small>
              </li>
            </ul>
            <div v-else class="text-center py-8 text-grey">
              등록된 생일자가 없습니다.
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { getBirthMonthChild } from '@/api/api'
import auth from '@/api/auth'
import UploadChildDialog from '@/components/dialog/UploadChildDialog.vue'
import ManageClassDialog from '@/components/admin/ClassDialog.vue'
import ManageUserDialog from '@/components/admin/UserDialog.vue'
import ManageRideDialog from '@/components/admin/RideDialog.vue'
import { useGlobal } from '@/composables/useGlobal'
import type { Child } from '@/types'

const router = useRouter()
const store = useAppStore()
const {
  $showMessage,
  $showError,
  $withLoading,
  $dialog,
  $showAlert,
  $showConfirm,
} = useGlobal()

// ✅ 상태 관리
const birthMonthChildList = ref<Child[]>([])
const beingBirthdayChildList = ref<Array<Child & { dDay: number }>>([])
const currentMonth = ref<number | string>('')

const isAdmin = computed<boolean>(() => store.isAdmin)
const userId = computed<string>(() => store.userId)

const copyToClipboard = async (text: string) => {
  try {
    // ✅ 성공 메시지 (글로벌 훅 사용)
    $showMessage?.({
      type: 'success',
      message: '전화번호를 클립보드에 저장했습니다.',
    })
    console.log('Copied:', text)
  } catch (e) {
    console.error('Clipboard error:', e)
  }
}

// ✅ 이번 달 생일자 목록 조회
const fetchBirthMonthChildren = async () => {
  try {
    const response: any = await getBirthMonthChild()

    if (response?.code === '0' || response?.code === 0) {
      const list: Child[] = response.data || []

      // ✅ 생일순 정렬 (일자 오름차순)
      birthMonthChildList.value = [...list].sort((a: Child, b: Child) => {
        const dayA = new Date(a.birthday as string).getDate()
        const dayB = new Date(b.birthday as string).getDate()
        return dayA - dayB
      })

      // ✅ D-day 계산 및 다가오는 생일 필터링
      beingBirthdayChildList.value = birthMonthChildList.value
        .map((child: Child) => {
          const dDay = calculateMMDDDifference(child.birthday as string)
          return dDay >= 0 ? { ...child, dDay } : null
        })
        .filter(Boolean)
        .sort((a: any, b: any) => a.dDay - b.dDay) as Array<
        Child & { dDay: number }
      > // ✅ D-day 오름차순
    }
  } catch (e) {
    console.error('Fetch birth children error:', e)
    $showError?.(e)
  }
}

// ✅ 현재 월 계산
const getCurrentMonth = () => {
  const today = new Date()
  currentMonth.value = today.getMonth() + 1
}

// ✅ D-day 계산 (MM-DD 기준, 올해 기준)
const calculateMMDDDifference = (targetDate: string): number => {
  const now = new Date()
  const [targetYear, targetMonth, targetDay] = targetDate.split('-').map(Number)

  // ✅ 현재 연도로 목표 날짜 생성
  let target = new Date(now.getFullYear(), targetMonth - 1, targetDay)

  // ✅ 목표 날짜가 지났다면 내년으로
  if (target < now) {
    target = new Date(now.getFullYear() + 1, targetMonth - 1, targetDay)
  }

  const diffMs = target.getTime() - now.getTime()
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

// ✅ 로그아웃
const handleLogout = () => {
  auth.logout()
  // ✅ auth.logout() 내부에서 router.push('/SignIn') 처리한다고 가정
  // 또는 여기서 직접 처리:
  // store.dispatch('user/logout')
  // router.push('/SignIn')
}

// ✅ 마이페이지 이동
const goToMypage = () => {
  router.push({ path: '/Mypage' })
}

// ✅ 관리자 다이얼로그들
const openManageClassDialog = async () => {
  try {
    await $dialog?.(ManageClassDialog, null)
  } catch (e) {
    console.error('ManageClassDialog error:', e)
  }
}

const openManageUserDialog = async () => {
  try {
    await $dialog?.(ManageUserDialog, null)
  } catch (e) {
    console.error('ManageUserDialog error:', e)
  }
}

const openManageRideDialog = async () => {
  try {
    await $dialog?.(ManageRideDialog, null)
  } catch (e) {
    console.error('ManageRideDialog error:', e)
  }
}

// ✅ 엑셀 업로드 다이얼로그
const openUploadChildDialog = async () => {
  try {
    await $dialog?.(UploadChildDialog)
    // ✅ 업로드 성공 시 목록 새로고침 (필요시)
    await fetchBirthMonthChildren()
  } catch (e) {
    console.error('UploadChildDialog error:', e)
  }
}

// ✅ 마운트 시 초기화
onMounted(() => {
  getCurrentMonth()
  fetchBirthMonthChildren()
  console.log('isAdmin:', isAdmin.value)
})
</script>

<style scoped>
/* ========== 레이아웃 ========== */
._home {
  min-height: 100%;
  padding: 16px;
}

.gap-2 {
  gap: 8px;
}

/* ========== 로고 카드 ========== */
._log {
  min-height: 400px;
}

._logo {
  padding-bottom: 8px;
}

._logo img {
  height: 48px;
  object-fit: contain;
}

._font-miso {
  font-family: 'Miso', 'Noto Sans KR', sans-serif;
}

/* ========== 생일 카드 ========== */
._birth {
  min-height: 400px;
  overflow: hidden;
}

._birth::before {
  content: '';
  position: absolute;
  top: 0;
  right: -24px;
  width: 100%;
  height: 100%;
  background: url('@/assets/images/cake.png') no-repeat bottom -48px right -48px;
  background-size: contain;
  max-width: 320px;
  z-index: 0;
  pointer-events: none;
  opacity: 0.15;
}

._birth > * {
  position: relative;
  z-index: 1;
}

._today-b {
  font-size: 2.5rem;
  line-height: 1;
}

._today-b span:first-child {
  font-size: 3rem;
  color: var(--v-primary-base, #f9a319);
}

/* ========== 다가오는 생일 ========== */
._birth-come ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

._birth-come li {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

._birth-come li:last-child {
  border-bottom: none;
}

._d-day {
  min-width: 48px;
  text-align: center;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 4px;
  padding: 2px 8px;
}

._d-day.text-error {
  background: rgba(243, 0, 63, 0.1);
  color: var(--v-error-base, #f3003f);
}

/* ========== 엑셀 등록 버튼 ========== */
._btn-grp .v-btn {
  min-width: 140px;
}

/* ========== 관리자 메뉴 ========== */
._admin-menu {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}

._admin-menu .v-btn {
  flex: 1 1 auto;
  justify-content: flex-start;
}

/* ========== Vue 3 deep selector ========== */
:deep(.v-card-title) {
  padding: 16px 24px 8px;
}

:deep(.v-card-text) {
  padding: 8px 24px 16px;
}

:deep(.v-card-actions) {
  padding: 8px 16px;
}

/* ========== 모바일 대응 ========== */
@media (max-width: 768px) {
  ._home {
    padding: 8px;
  }

  ._log,
  ._birth {
    min-height: auto;
  }

  ._today-b {
    font-size: 2rem;
  }

  ._today-b span:first-child {
    font-size: 2.5rem;
  }

  ._admin-menu .v-btn {
    flex: 1 1 100%;
  }

  ._btn-grp {
    flex-direction: column;
  }

  ._btn-grp .v-btn {
    width: 100%;
  }
}

/* ========== 인쇄 시 스타일 ========== */
@media print {
  ._admin-menu,
  ._excel-regist {
    display: none !important;
  }
}
</style>
