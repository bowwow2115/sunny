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
        <v-btn height="28" onClick="window.print()"
          ><v-icon>mdi-printer</v-icon></v-btn
        >
      </v-card-title>
      <v-simple-table dense>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">장소</th>
              <th class="text-left">시간</th>
              <th class="text-left">비고</th>
              <th class="text-left">원아</th>
              <th class="text-left">보호자1</th>
              <th class="text-left">보호자2</th>
              <th class="text-left">요일</th>
              <!-- <th class="text-left" style="padding: 0">월</th>
              <th class="text-left" style="padding: 0">화</th>
              <th class="text-left" style="padding: 0">수</th>
              <th class="text-left" style="padding: 0">목</th>
              <th class="text-left" style="padding: 0">금</th> -->
            </tr>
          </thead>
          <tbody
            v-for="(meetingLocation, j) in selectedRide.meetingLocationList"
            :key="j"
          >
            <tr>
              <td>{{ meetingLocation.name }}</td>
              <td>{{ meetingLocation.time }}</td>
              <td>{{ meetingLocation.comment }}</td>
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
              <td></td>
              <td>
                {{ `${childRide.child.name}(${childRide.child.className})` }}
              </td>
              <td>
                {{
                  `${childRide.child.parentList[0].telephone} (${childRide.child.parentList[0].relation})`
                }}
              </td>
              <td>
                {{
                  childRide.child.parentList.length >= 2
                    ? `(${childRide.child.parentList[1].telephone}, ${childRide.child.parentList[1].relation})`
                    : ''
                }}
              </td>
              <td><pre>월   화   수   목   금</pre></td>
              <!-- <td style="padding: 0">
                <v-simple-checkbox></v-simple-checkbox>
              </td>
              <td style="padding: 0">
                <v-simple-checkbox></v-simple-checkbox>
              </td>
              <td style="padding: 0">
                <v-simple-checkbox></v-simple-checkbox>
              </td>
              <td style="padding: 0">
                <v-simple-checkbox></v-simple-checkbox>
              </td>
              <td style="padding: 0">
                <v-simple-checkbox></v-simple-checkbox>
              </td> -->
            </tr>
          </tbody>
          <tr>
            <td>
              <strong>{{ `총 인원: ${selectedRide.count}` }}</strong>
            </td>
          </tr>
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
              this.rideList?.forEach((item) => {
                let count = 0
                item.meetingLocationList?.forEach((meetingLocation) => {
                  count += meetingLocation.childRideList.length
                })
                item.count = count
                if (item.am) {
                  item.name = '오전 ' + item.name
                  this.amRideList.push(item)
                } else {
                  item.name = '오후 ' + item.name
                  this.pmRideList.push(item)
                }
              })
              this.selectedRide = this.rideList.find(
                (ride) => ride.id == this.$route.query.id
              )
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

<style scoped>
body {
  margin: 0;
  padding: 0;
}

/* 인쇄 시 A4 크기로 설정 */
@media print {
  @page {
    size: A4; /* A4 크기 설정 */
    margin: 20mm; /* 용지 여백 설정 (20mm 권장) */
  }

  /* 페이지에 맞게 레이아웃 설정 */
  html,
  body {
    width: 210mm; /* A4 너비 */
    height: 297mm; /* A4 높이 */
  }

  /* 인쇄 영역에 대한 레이아웃 설정 */
  .container {
    zoom: 0.75 !important; /* 80% 크기로 축소 */
    font-size: 12px !important; /* 인쇄할 때 전체 폰트 크기 축소 */
    width: 100%;
    height: 100%;
    padding: 10mm; /* 여백 설정 */
    box-sizing: border-box;
  }

  h1 {
    font-size: 1.5rem; /* 인쇄 시 큰 제목 크기 축소 */
  }

  p {
    font-size: 0.8rem; /* 본문 폰트도 축소 */
  }
}
</style>
