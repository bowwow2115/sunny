<template>
  <div class="_home">
    <v-row class="align-stretch">
      <v-col cols="12" md="6">
        <v-card class="pa-2 rounded-xl _log d-flex">
          <v-card-title class="_logo align-end">
            <img src="/images/sunny-en.svg" alt="sunny" />
            <h1 class="_font-miso display-1 font-weight-bold">
              해맑은 어린이집
            </h1>
          </v-card-title>
          <v-card-text class="mt-5">
            <div
              class="_log-info d-flex flex-wrap justify-space-between align-center"
            >
              <h2 class="font-weight-bold">
                <u class="font-weight-black">테스트님</u>, 안녕하세요.
              </h2>
              <v-card-actions class="flex-wrap">
                <v-btn
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
                  :href="'/file/sunny_regist_children.xlsx'"
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
        </v-card>
        <!-- <v-btn
          type="button"
          block
          class="_quick-regist d-flex justify-space-between align-center py-6 px-6 rounded-xl"
          height="auto"
        >
          <p class="mb-0 text-h6 font-weight-black">
            <small class="font-weight-bold">새로 입학했나요?</small>원아등록
            바로가기
          </p>
          <v-icon>ri-draft-fill</v-icon>
        </v-btn> -->
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-2 pt-8 rounded-xl _birth">
          <v-card-title class="_font-miso font-weight-bold display-1">
            <b class="_today-b mb-4"><span>09</span><span>월</span></b>
            의 생일
          </v-card-title>
          <v-card-text class="mt-5">
            <ul>
              <li
                v-for="(child, index) in birthMonthChildList"
                :key="index"
                class="font-weight-black"
              >
                {{ `${child.name}` }}
                <b>{{ `${child.birthday}` }}</b>
                <v-btn icon color="#fff"
                  ><v-icon>ri-add-circle-fill</v-icon></v-btn
                >
                <small class="font-weight-regular">{{
                  `${child.className}`
                }}</small>
                <!-- <v-btn icon color="white"
                  ><v-icon>ri-add-circle-fill</v-icon></v-btn
                > -->
              </li>
            </ul>
          </v-card-text>
        </v-card>
        <v-card class="pa-2 rounded-xl _birth-come mt-6">
          <v-card-title
            ><span class="font-weight-bold">생일</span>이 다가오고
            있어요!</v-card-title
          >
          <v-card-text>
            <ul>
              <li
                v-for="(child, index) in birthMonthChildList"
                :key="index"
                class="px-3 py-1"
              >
                <small class="_d-day font-weight-black mr-1">D-11</small>
                {{ `${child.name}` }}
                <small>{{ `${child.className}, ${child.birthday}` }}</small>
              </li>
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

export default {
  name: 'SunnyHome',
  data() {
    return {
      birthMonthChildList: [],
    }
  },
  mounted() {
    this.getBirthMonthChlid()
  },
  methods: {
    getBirthMonthChlid() {
      getBirthMonthChlid()
        .then((response) => {
          if (response.code === '0') {
            this.birthMonthChildList = response.data
          }
        })
        .catch((e) => {
          this.$showError(e)
        })
    },
    async openUploadChildDialog() {
      await this.$dialog(UploadChildDialog)
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
  background: url('../../public/images/cake.png') no-repeat bottom -4rem right -4rem;
  background-size: cover;
  max-width: 25rem;
  z-index: -1;
}
</style>
