<template>
  <div class="_home">
    <v-row>
      <v-col md="6">
        <v-card class="pa-2 rounded-xl _log">
          <v-card-title class="_logo"><img src="" alt="" /></v-card-title>
          <v-card-text>
            <h2>000 님, 환영합니다.</h2>
          </v-card-text>

          <v-card-actions class="justify-space-between">
            <v-btn type="button" outlined rounded text x-large color="gray"
              >로그아웃</v-btn
            >
            <v-btn type="button" outlined rounded text x-large
              >마이페이지</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col md="6">
        <v-card class="pa-2 rounded-xl _birth">
          <v-card-title class="_font-miso font-weight-bold"
            >오늘의 생일</v-card-title
          >
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
      <v-col cols="6" xs="12">
        <v-card>
          <v-card-title>원아 등록</v-card-title>
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

<style></style>
