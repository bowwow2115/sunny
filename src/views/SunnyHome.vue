<template>
  <div class="_home">
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="pa-2 rounded-xl _log d-flex">
          <v-card-title class="_logo align-end">
            <img src="@/assets/images/sunny-en.svg" alt="sunny" />
            <h1 class="_font-miso display-1 font-weight-bold">
              해맑은 어린이집
            </h1>
          </v-card-title>
          <v-card-text class="mt-5">
            <div
              class="_log-info d-flex flex-wrap justify-space-between align-center"
            >
              <h2 class="font-weight-bold">
                <u class="font-weight-black">{{ userId }}님</u>, 안녕하세요.
              </h2>
              <v-card-actions class="flex-wrap">
                <v-btn
                  @click="logout"
                  type="button"
                  outlined
                  rounded
                  text
                  color="gray"
                  class="px-8"
                  >로그아웃</v-btn
                >
                <v-btn type="button" outlined rounded text class="px-8"
                  >마이페이지</v-btn
                >
              </v-card-actions>
            </div>
            <div class="_excel-regist pt-4">
              <h3 class="mb-4">
                <v-icon color="#1d6f42" class="mr-1">ri-file-excel-fill</v-icon
                >엑셀 파일로 원아등록 바로 하기
              </h3>
              <div class="_btn-grp">
                <v-btn
                  type="button"
                  text
                  x-large
                  class="_excel-download"
                  href="/sunny/app/file/sunny_regist_children.xlsx"
                  >양식 다운로드</v-btn
                >
                <v-btn
                  type="button"
                  text
                  x-large
                  class="_excel-upload"
                  @click="openUploadChildDialog"
                  >원아 엑셀 등록</v-btn
                >
              </div>
            </div>
          </v-card-text>
          <!-- 관리자 로그인 메뉴 -->
          <div class="_admin-menu" v-if="isAdmin">
            <v-btn
              type="button"
              text
              x-large
              plain
              @click="openManageClassDialog()"
              ><v-icon>ri-book-read-fill</v-icon>반 관리</v-btn
            >
            <v-btn
              type="button"
              text
              x-large
              plain
              @click="openManageUserDialog()"
              ><v-icon>ri-user-fill</v-icon>사용자 관리</v-btn
            >
            <v-btn
              type="button"
              text
              x-large
              plain
              @click="openManageRideDialog()"
              ><v-icon>ri-bus-2-fill</v-icon>차량 관리</v-btn
            >
          </div>
        </v-card>
        <v-card class="pa-2 rounded-xl _birth-come mt-6">
          <v-card-title
            ><span class="font-weight-bold">생일</span>이 다가오고
            있어요!</v-card-title
          >
          <v-card-text>
            <ul v-if="beingBirthdayChildList.length > 0">
              <li
                v-for="(child, index) in beingBirthdayChildList"
                :key="index"
                class="px-3 py-1"
              >
                <small
                  class="_d-day font-weight-black mr-1"
                  v-if="child.dDay == 0"
                  ><v-icon>ri-cake-2-fill</v-icon></small
                >
                <small class="_d-day font-weight-black mr-1" v-else
                  >D-{{ child.dDay }}</small
                >

                {{ `${child.name}` }}
                <small>{{ `${child.className}, ${child.birthday}` }}</small>
              </li>
            </ul>
            <ul v-else>
              {{
                `다가오는 ${currentMonth}월의 생일자가 없습니다.`
              }}
            </ul>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-2 pt-8 rounded-xl _birth">
          <v-card-title class="_font-miso font-weight-bold display-1">
            <b class="_today-b mb-4"
              ><span>{{ currentMonth }}</span
              ><span>월</span></b
            >
            의 생일
          </v-card-title>
          <v-card-text class="mt-5">
            <ul v-if="birthMonthChildList.length > 0">
              <li
                v-for="(child, index) in birthMonthChildList"
                :key="index"
                class="font-weight-black"
              >
                <v-btn icon color="#fff"
                  ><v-icon>ri-add-circle-fill</v-icon></v-btn
                >
                {{ `${child.name}` }}
                <b>{{ `${child.birthday}` }}</b>
                <small class="font-weight-regular ml-2">{{
                  `${child.className}`
                }}</small>
                <!-- <v-btn icon color="white"
                  ><v-icon>ri-add-circle-fill</v-icon></v-btn
                > -->
              </li>
            </ul>
            <ul v-else>
              등록된 생일자가 없습니다.
            </ul>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { getBirthMonthChlid } from '@/api/api'
import UploadChildDialog from '@/components/dialog/UploadChildDialog.vue'
import ManageClassDialog from '@/components/admin/ClassDialog.vue'
import ManageUserDialog from '@/components/admin/UserDialog.vue'
import ManageRideDialog from '@/components/admin/RideDialog.vue'
import { mapGetters } from 'vuex'
import auth from '@/api/auth'

export default {
  name: 'SunnyHome',
  computed: {
    ...mapGetters(['isAdmin', 'userId']),
  },
  data() {
    return {
      birthMonthChildList: [],
      beingBirthdayChildList: [],
      currentMonth: '',
    }
  },
  mounted() {
    this.getBirthMonthChlid()
    this.getCurrentMonth()

    console.log(this.isAdmin)
  },
  methods: {
    async openManageClassDialog() {
      await this.$dialog(ManageClassDialog, null)
    },
    async openManageUserDialog() {
      await this.$dialog(ManageUserDialog, null)
    },
    async openManageRideDialog() {
      await this.$dialog(ManageRideDialog, null)
    },
    getBirthMonthChlid() {
      getBirthMonthChlid()
        .then((response) => {
          if (response.code === '0') {
            this.birthMonthChildList = response.data
            this.birthMonthChildList.sort((a, b) => {
              const dayA = new Date(a.birthday).getDate()
              const dayB = new Date(b.birthday).getDate()

              // 일자 기준으로 오름차순 정렬
              return dayA - dayB
            })
            this.birthMonthChildList.forEach((child) => {
              const dDay = this.calculateMMDDDifference(child.birthday)
              if (dDay >= 0) {
                child.dDay = dDay
                this.beingBirthdayChildList.push(child)
              }
            })
          }
        })
        .catch((e) => {
          this.$showError(e)
        })
    },
    async openUploadChildDialog() {
      await this.$dialog(UploadChildDialog)
    },
    getCurrentMonth() {
      const today = new Date()
      this.currentMonth = today.getMonth() + 1 // 0부터 시작하므로 1을 더함
    },
    /**
     * D-day를 계산하는 함수
     * @param {string} targetDate - YYYY-MM-DD 형식의 목표 날짜
     * @returns {number} 남은 일수 (D-day)
     */
    calculateMMDDDifference(targetDate) {
      // 현재 날짜 가져오기
      const now = new Date()

      // 현재 연도의 월-일을 사용하여 targetDate의 연도를 현재 연도로 설정
      const [targetYear, targetMonth, targetDay] = targetDate
        .split('-')
        .map(Number)
      const target = new Date(now.getFullYear(), targetMonth - 1, targetDay)

      // 현재 날짜와 목표 날짜의 차이 계산 (밀리초 단위)
      const differenceInMilliseconds = target - now

      // 밀리초를 일(day) 단위로 변환 (1일 = 24시간 * 60분 * 60초 * 1000밀리초)
      const dayDifference = Math.ceil(
        differenceInMilliseconds / (1000 * 60 * 60 * 24)
      )

      // 만약 목표 월-일이 현재 날짜보다 과거라면, 목표 날짜를 다음 연도로 설정하여 다시 계산
      // if (dayDifference < 0) {
      //   const nextYearTarget = new Date(
      //     now.getFullYear() + 1,
      //     targetMonth - 1,
      //     targetDay
      //   )
      //   const nextYearDifference = nextYearTarget - now
      //   return Math.ceil(nextYearDifference / (1000 * 60 * 60 * 24))
      // }

      return dayDifference
    },
    logout() {
      auth.logout()
    },
  },
}
</script>

<style scoped>
.v-card__title + .v-card__text {
  border-top: none;
}
._birth::before {
  content: '';
  position: absolute;
  top: 0;
  right: -1.5rem;
  width: 100%;
  height: 100%;
  background: url('../../public/images/cake.png') no-repeat bottom -3rem right -3rem;
  background-size: cover;
  max-width: 20rem;
  z-index: -1;
}
</style>
