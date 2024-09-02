<template>
  <v-container>
    <v-row style="height: 50vh">
      <v-col cols="6" xs="12">
        <v-card style="height: 50vh">
          <v-card-title>이달의 생일자</v-card-title>
          <v-card-text
            v-for="(child, index) in birthMonthChildList"
            :key="index"
            >{{ `${child.name}(${child.className})` }}
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" xs="12">
        <v-card>
          <v-card-title>원아 등록</v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <v-row style="height: 50vh">
      <v-col cols="6">
        <v-card>
          <v-card-title>원아 등록</v-card-title>
        </v-card>
      </v-col>
      <v-col cols="6"></v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getBirthMonthChlid } from '@/api/api'
export default {
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
