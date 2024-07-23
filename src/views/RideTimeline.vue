<template>
  <v-card class="mx-auto" style="padding: 0">
    <v-card dark flat>
      <v-btn
        @click="openRideChildDialog(false, selectedRide)"
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
                  v-model="selectedRide"
                  :items="selectedAmPm == '오전' ? amRideList : pmRideList"
                  item-text="name"
                  return-object
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
          v-for="(meetingLocation, index) in selectedRide.meetingLocationList"
          :key="index"
        >
          <v-card>
            <v-card-title>
              {{ meetingLocation.time }}
              <v-spacer></v-spacer>
              <v-icon
                color="green accent-4"
                @click="openManageMeetingLocationDialog(meetingLocation)"
                >mdi-pencil</v-icon
              >
            </v-card-title>
            <v-card-subtitle>{{ meetingLocation.name }}</v-card-subtitle>
            <v-card-text
              @click="openParentsDialog(meetingLocation.childRideList)"
              style="background-color: #fafafa"
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
              <div class="text-caption">
                {{ meetingLocation.comment || '' }}
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
      selectedRide: {},
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
              this.selectedRide = this.amRideList[0]
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
    async openManageMeetingLocationDialog(meetingLocation) {
      console.log(meetingLocation)
      const result = await this.$dialog(
        ManageMeetingLocationDialog,
        meetingLocation
      )
    },
    async openRideChildDialog() {},
  },
}
</script>

<style></style>
