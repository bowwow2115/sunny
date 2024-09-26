<template>
  <div class="_home">
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="pa-2 rounded-xl _log">
          <v-card-title class="_logo align-end">
            <img src="/images/sunny-en.svg" alt="sunny" />
            <h1 class="_font-miso display-1 font-weight-bold">
              해맑은 어린이집
            </h1>
          </v-card-title>
          <v-card-text class="d-flex justify-space-between align-center mt-6">
            <h2 class="font-weight-bold">000 님, 환영합니다.</h2>
            <v-card-actions class="pa-0">
              <v-btn
                type="button"
                outlined
                rounded
                text
                x-large
                color="gray"
                class="px-8"
                >로그아웃</v-btn
              >
              <v-btn type="button" outlined rounded text x-large class="px-8"
                >마이페이지</v-btn
              >
            </v-card-actions>
          </v-card-text>
        </v-card>
        <v-btn
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
        </v-btn>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-2 pt-8 rounded-xl _birth" elevation="0">
          <v-card-title class="_font-miso font-weight-bold display-1">
            <b class="_today-b mb-4"><span>09.</span><span>13</span></b>
            오늘의 생일
          </v-card-title>
          <v-card-text>
            <ul>
              <li
                v-for="(child, index) in birthMonthChildList"
                :key="index"
                class="font-weight-black mb-4"
              >
                {{ `${child.name}` }}
                <small class="font-weight-regular">{{
                  `${child.className} &nbsp; ${child.birthday}`
                }}</small>
                <!-- <v-btn icon color="white"
                  ><v-icon>ri-add-circle-fill</v-icon></v-btn
                > -->
              </li>
            </ul>
          </v-card-text>
        </v-card>
        <v-card class="pa-2 rounded-xl _birth-come" elevation="0">
          <v-card-title>생일이 다가오고 있어요!</v-card-title>
          <v-card-text>
            <ul>
              <li v-for="(child, index) in birthMonthChildList" :key="index">
                <span class="_d-day"></span>
                {{ `${child.name}` }}
                <small>{{ `${child.className}, ${child.birthday}` }}</small>
              </li>
            </ul>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row style="height: 50vh">
      <v-col cols="6" xs="12">
        <v-card style="height: 50vh">
          <v-card-title>이달의 생일자</v-card-title>
          <v-card-text
            v-for="(child, index) in birthMonthChildList"
            :key="index"
            ><strong>{{
              `${child.name}(${child.className}, ${child.birthday})`
            }}</strong>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <!-- <v-row style="height: 50vh">
      <v-col cols="6">
        <v-card>
          <v-card-title>원아 등록</v-card-title>
        </v-card>
      </v-col>
      <v-col cols="6"></v-col>
    </v-row> -->
  </div>
</template>

<script>
import { getBirthMonthChlid } from '@/api/api'
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
  right: 0;
  width: 100%;
  height: 100%;
  background: url('../../public/images/cake.png') no-repeat bottom -4rem right -4rem;
  background-size: cover;
  max-width: 25rem;
  z-index: -1;
}
</style>
