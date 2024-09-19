<template>
  <v-card class="mx-auto" style="padding: 0">
    <v-card dark flat>
      <v-btn
        @click="openAddMeetingLocationDialog(selectedRide)"
        absolute
        bottom
        color="pink"
        left
        fab
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>

      <v-img gradient="to top, rgba(0,0,0,.44), rgba(0,0,0,.44)">
        <!-- src="https://cdn.vuetifyjs.com/images/cards/forest.jpg" -->
        <v-container class="fill-height">
          <v-row>
            <v-col>
              <strong class="text-h1 font-weight-regular mr-6">{{
                selectedAmPm
              }}</strong>
            </v-col>
            <v-col class="d-flex" cols="7">
              <v-select
                v-model="selectedAmPm"
                :items="['오전', '오후']"
              ></v-select>
              <v-select
                v-model="selectedRide"
                :items="selectedAmPm == '오전' ? amRideList : pmRideList"
                item-text="name"
                return-object
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="10"></v-col>
            <v-col cols="2" style="display: flex; justify-content: center"
              ><v-btn @click="openRideTable()">
                <v-icon>mdi-printer-outline</v-icon></v-btn
              >
            </v-col>
          </v-row>
        </v-container>
      </v-img>
    </v-card>
    <v-card-text class="py-0">
      <v-timeline align-top dense>
        <v-timeline-item
          color="primary"
          small
          v-for="(meetingLocation, index) in selectedRide.meetingLocationList"
          :key="index"
        >
          <v-card :width="isMobile ? '100%' : '50%'">
            <v-card-title>
              {{ meetingLocation.time }}
              <v-spacer></v-spacer>
              <v-icon
                color="green accent-4"
                @click="openMeetingLocationMoreInfo(meetingLocation)"
                >mdi-pencil</v-icon
              >
            </v-card-title>
            <v-card-subtitle>{{
              `${meetingLocation.name}(${meetingLocation.comment})`
            }}</v-card-subtitle>
            <v-card-text
              @click="openParentsDialog(meetingLocation.childRideList)"
              style="background-color: #fafafa; cursor: pointer"
            >
              <div class="text-caption">
                <v-chip
                  v-for="(childRide, j) in meetingLocation.childRideList"
                  :key="j"
                  x-small
                >
                  {{
                    `${childRide.child.name}(${childRide.child.className})  ${
                      childRide.comment || ''
                    }`
                  }}
                </v-chip>
              </div>
            </v-card-text>
            <!-- <v-col cols="2">
              <v-icon
                color="green accent-4"
                @click="openRideChildDialog(true, item)"
                >mdi-pencil</v-icon
              >
            </v-col> -->
          </v-card>
        </v-timeline-item>
      </v-timeline>
    </v-card-text>
  </v-card>
</template>

<script>
import { getRideList } from '@/api/api'
import ReadParentsDialog from '@/components/dialog/ReadParentsDialog.vue'
import MeetingLocationMoreInfo from '@/views/MeetingLocationMoreInfo.vue'
import ManageMeetingLocationDialog from '@/components/dialog/ManageMeetingLocationDialog.vue'
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
      selectedRide: { meetingLocationList: [], am: false },
      selectedAmPm: '오전',
      isMobile: false,
    }
  },
  mounted() {
    this.getRideList(true)
    this.checkIfMobile()
  },
  methods: {
    getRideList(init = false) {
      this.rideList = []
      this.amRideList = []
      this.pmRideList = []
      this.$withLoading(
        getRideList()
          .then((response) => {
            if (response.code == '0') {
              this.rideList = response.data
              response.data.forEach((item) => {
                if (item.am) this.amRideList.push(item)
                else this.pmRideList.push(item)
              })
              if (init) this.selectedRide = this.amRideList[0]
              else {
                if (this.selectedRide.am) {
                  this.selectedRide = this.amRideList.find(
                    (amRide) => amRide.id == this.selectedRide.id
                  )
                } else {
                  this.selectedRide = this.pmRideList.find(
                    (pmRide) => pmRide.id == this.selectedRide.id
                  )
                }
              }
            }
          })
          .catch((e) => {
            this.$showError(e)
          })
      )
    },
    async openParentsDialog(childRideList) {
      await this.$dialog(ReadParentsDialog, childRideList)
    },
    async openMeetingLocationMoreInfo(meetingLocation) {
      const result = await this.$dialog(
        MeetingLocationMoreInfo,
        meetingLocation
      )
      if (result) this.getRideList()
    },
    async openAddMeetingLocationDialog(selectedRide) {
      let item = {}
      item.isEdit = false
      item.sunnyRide = selectedRide
      const result = await this.$dialog(ManageMeetingLocationDialog, item)
      if (result) this.getRideList()
    },
    checkIfMobile() {
      // 사용자 에이전트 문자열에서 모바일 기기를 확인
      const userAgent = navigator.userAgent || navigator.vendor || window.opera

      // 모바일 기기 감지 (iOS, Android, 기타 모바일 기기들)
      if (
        /android/i.test(userAgent) ||
        (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream)
      ) {
        this.isMobile = true
      } else {
        this.isMobile = false
      }
    },
    openRideTable() {
      // 새 창에서 특정 라우터 경로 열기
      console.log(this.selectedRide.id)
      let param = {}
      param.id = this.selectedRide.id

      const url = this.$router.resolve({
        name: 'RideTimelineTable',
        query: param,
      }).href
      window.open(url, '_blank')
    },
  },
}
</script>

<style></style>
