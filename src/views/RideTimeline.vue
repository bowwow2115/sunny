<template>
  <v-card class="mx-auto" style="padding: 0">
    <v-card dark flat>
      <v-btn absolute bottom color="pink" right fab>
        <v-icon>mdi-plus</v-icon>
      </v-btn>

      <v-img gradient="to top, rgba(0,0,0,.44), rgba(0,0,0,.44)">
        <!-- src="https://cdn.vuetifyjs.com/images/cards/forest.jpg" -->
        <v-container class="fill-height">
          <v-row align="center">
            <strong class="text-h1 font-weight-regular mr-6">{{
              selectedAmPm
            }}</strong>
            <v-row justify="end">
              <v-col class="d-flex" cols="3" sm="1">
                <v-select
                  v-model="selectedAmPm"
                  :items="['오전', '오후']"
                ></v-select>
              </v-col>
              <v-col class="d-flex" cols="3" sm="1">
                <v-select
                  v-model="selectedRideList"
                  :items="selectedAmPm == '오전' ? amRideList : pmRideList"
                  item-text="name"
                  item-value="sunnyChildRideList"
                ></v-select>
              </v-col>
              <!-- <div class="text-h5 font-weight-light">오전</div> -->
              <!-- <div class="text-uppercase font-weight-light">February 2015</div> -->
            </v-row>
          </v-row>
        </v-container>
      </v-img>
    </v-card>
    <v-card-text class="py-0">
      <v-timeline align-top dense>
        <v-timeline-item
          color="primary"
          small
          v-for="(item, index) in selectedRideList"
          :key="index"
        >
          <v-row class="pt-1">
            <v-col cols="4">
              <strong>{{ item.time }}</strong>
            </v-col>
            <v-col cols="7">
              <!-- TODO: 이름 클릭 시 부모정보 보이게 -->
              <strong>{{ item.child.name }}</strong>
              <div class="text-caption">
                {{
                  `${item.child.address.address} ${item.child.address.detailAddress}`
                }}
              </div>
              <div class="text-caption">{{ `${item.comment}` }}</div>
            </v-col>
            <v-col cols="2">
              <v-icon color="secondary">mdi-pencil</v-icon>
            </v-col>
          </v-row>
        </v-timeline-item>
      </v-timeline>
    </v-card-text>
  </v-card>
</template>

<script>
import { getRideList } from '@/api/api'
export default {
  name: 'RideTimeline',
  data() {
    return {
      events: [],
      input: null,
      nonce: 0,

      rideList: [],
      amRideList: [],
      pmRideList: [],
      selectedRideList: [],
      selectedAmPm: '오전',
    }
  },
  mounted() {
    this.getRideList()
  },
  methods: {
    getRideList() {
      this.$withLoading(
        getRideList()
          .then((response) => {
            if (response.code == '0') {
              this.rideList = response.data
              response.data.forEach((item) => {
                if (item.am) this.amRideList.push(item)
                else this.pmRideList.push(item)
              })
              this.selectedRideList = this.amRideList[0].sunnyChildRideList
            }
          })
          .catch((e) => {
            this.$showError(e)
          })
      )
    },
  },
}
</script>

<style></style>
