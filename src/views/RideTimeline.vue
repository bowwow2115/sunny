<template>
  <v-card class="mx-auto" style="padding: 0">
    <v-card dark flat class="_timeline">
      <v-img
        v-if="selectedAmPm == '오전'"
        src="@/assets/images/morning.webp"
        gradient="to top, rgba(0,0,0,.2), rgba(0,0,0,0.6)"
      >
        <v-container class="pa-6">
          <div class="_timeline-top">
            <div class="_timeline-select">
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
            </div>
            <div class="_btn-grp flex-nowrap">
              <v-btn
                @click="openRideTable()"
                color="black"
                class="font-weight-regular"
              >
                <v-icon>ri-printer-line</v-icon></v-btn
              >
              <v-btn
                @click="openAddMeetingLocationDialog(selectedRide)"
                color="accent"
                class="ml-1 font-weight-regular"
              >
                <v-icon>ri-add-line</v-icon>
              </v-btn>
            </div>
          </div>
        </v-container>
      </v-img>
      <v-img
        v-if="selectedAmPm == '오후'"
        src="@/assets/images/sunset.webp"
        gradient="to top, rgba(0,0,0,.2), rgba(0,0,0,0.6)"
      >
        <v-container class="pa-6">
          <div class="_timeline-top">
            <div class="_timeline-select">
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
            </div>
            <div class="_btn-grp flex-nowrap">
              <v-btn @click="openRideTable()" class="font-weight-light">
                <v-icon>ri-printer-line</v-icon></v-btn
              >
              <v-btn
                @click="openAddMeetingLocationDialog(selectedRide)"
                color="accent"
                class="ml-1"
              >
                <v-icon>ri-add-line</v-icon>
              </v-btn>
            </div>
          </div>
        </v-container>
      </v-img>
    </v-card>
    <v-card-text>
      <v-timeline
        dense
        v-if="selectedRide?.meetingLocationList.length > 0"
        class="pt-0"
      >
        <v-timeline-item
          class="py-0"
          :color="selectedAmPm == '오전' ? 'tertiary' : 'info'"
          small
          v-for="(meetingLocation, index) in selectedRide?.meetingLocationList"
          :key="index"
        >
          <!-- <v-card :width="isMobile ? '100%' : '80%'"> -->
          <v-card
            :class="selectedAmPm == '오전' ? '_am-card' : '_pm-card'"
            class="_timeline-card py-4"
            flat
          >
            <v-card-title class="py-0">
              <h3>
                {{ meetingLocation.time }}
              </h3>
              <v-btn icon @click="openMeetingLocationMoreInfo(meetingLocation)">
                <v-icon>ri-edit-2-fill</v-icon>
              </v-btn>
              <p>
                {{ `${meetingLocation.name}` }}
                <small>{{
                  meetingLocation.comment == null
                    ? ''
                    : `(${meetingLocation.comment})`
                }}</small>
              </p>
            </v-card-title>
            <V-card-text class="py-0">
              <v-chip
                v-for="(childRide, j) in meetingLocation.childRideList"
                :key="j"
                @click="openParentsDialog(meetingLocation.childRideList)"
              >
                <b class="mr-1">{{ `${childRide.child.name}` }}</b>
                <span>{{ `(${childRide.child.className})` }}</span>
                <span class="_comment ml-1">{{
                  `${childRide.comment || ''}`
                }}</span>
              </v-chip>
            </V-card-text>
          </v-card>
        </v-timeline-item>
      </v-timeline>
      <v-card-title v-else style="justify-content: center; min-height: 600px">
        <v-icon>mdi-information-off</v-icon> 승하차 장소의 정보가
        없습니다</v-card-title
      >
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
      if (
        selectedRide == null ||
        selectedRide.id == undefined ||
        selectedRide.id == null ||
        selectedRide.id == ''
      ) {
        this.$showMessage({
          type: 'warning',
          message: '차량을 먼저 선택해주세요.',
        })
        return
      }
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
