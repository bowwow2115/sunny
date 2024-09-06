<template>
  <v-container style="background: white !important; background-color: white">
    <v-card>
      <v-card-title>
        <v-select
          v-model="selectedRide"
          :items="rideList"
          item-text="name"
          return-object
        >
          <!-- <strong>{{
            ride.name +
            (ride.time ? `(${ride.time})` : '') +
            (ride.comment ? ` 비고사항: ${ride.comment}` : '')
          }}</strong> -->
        </v-select>
      </v-card-title>
      <v-simple-table dense>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">장소</th>
              <th class="text-left">시간</th>
              <th class="text-left">원아</th>
              <th class="text-left">보호자1</th>
              <th class="text-left">보호자2</th>
              <th class="text-left">
                <v-icon>mdi-checkbox-marked</v-icon>
              </th>
            </tr>
          </thead>
          <tbody
            v-for="(meetingLocation, j) in selectedRide.meetingLocationList"
            :key="j"
          >
            <tr>
              <td>{{ meetingLocation.name }}</td>
              <td>{{ meetingLocation.time }}</td>
              <!-- <td></td>
              <td></td>
              <td></td> -->
            </tr>
            <tr
              v-for="(childRide, k) in meetingLocation.childRideList"
              :key="k"
            >
              <td></td>
              <td></td>
              <td>
                {{ `${childRide.child.name}(${childRide.child.className})` }}
              </td>
              <td>
                {{
                  childRide.child.parentList.length >= 2
                    ? childRide.child.parentList[0].name +
                      `(${childRide.child.parentList[0].telephone}, ${childRide.child.parentList[0].relation})`
                    : ''
                }}
              </td>
              <td>
                {{
                  childRide.child.parentList.length >= 2
                    ? childRide.child.parentList[1].name +
                      `(${childRide.child.parentList[1].telephone}, ${childRide.child.parentList[1].relation})`
                    : ''
                }}
              </td>
              <td>
                <v-checkbox></v-checkbox>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </v-container>
</template>

<script>
import { getRideList } from '@/api/api'
export default {
  mounted() {
    console.log('Received data:', this.$route.query)
    // this.rideList = this.$route.query
    this.getRideList()
  },
  data() {
    return {
      rideList: [],
      selectedRide: null,
    }
  },
  methods: {
    getRideList() {
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
              this.selectedRide = this.rideList.find(
                (ride) => ride.id == this.$route.query.id
              )
              console.log(this.selectedRide)
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
