<template>
  <div class="_print-paper">
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
        <v-btn
          onClick="window.print()"
          color="black"
          class="ml-4 font-weight-regular"
          ><v-icon color="#fff">ri-printer-line</v-icon></v-btn
        >
      </v-card-title>
      <v-simple-table dense fixed-header class="_print-ride-table">
        <template v-slot:default>
          <thead>
            <tr>
              <th>장소</th>
              <th>시간</th>
              <th>비고</th>
              <th>원아</th>
              <th>보호자1</th>
              <th>보호자2</th>
              <th>요일</th>
            </tr>
          </thead>
          <tbody
            v-for="(meetingLocation, j) in selectedRide.meetingLocationList"
            :key="j"
          >
            <tr
              v-for="(childRide, k) in meetingLocation.childRideList"
              :key="k"
            >
              <!-- 첫 번째 childRide에만 부모 데이터 출력 -->
              <template v-if="k === 0">
                <td
                  :rowspan="meetingLocation.childRideList.length"
                  class="_rt-lo"
                >
                  <v-icon>ri-map-pin-fill</v-icon>
                  {{ meetingLocation.name }}
                </td>
                <td
                  :rowspan="meetingLocation.childRideList.length"
                  class="_rt-da"
                >
                  {{ meetingLocation.time }}
                </td>
                <td
                  :rowspan="meetingLocation.childRideList.length"
                  class="_rt-co"
                >
                  {{ meetingLocation.comment }}
                </td>
              </template>
              <td class="py-2">
                {{ `${childRide.child.name} (${childRide.child.className})` }}
              </td>
              <td class="py-2">
                {{
                  `${childRide.child.parentList[0].telephone} (${childRide.child.parentList[0].relation})`
                }}
              </td>
              <td class="py-2">
                {{
                  childRide.child.parentList.length >= 2
                    ? `${childRide.child.parentList[1].telephone} (${childRide.child.parentList[1].relation})`
                    : ''
                }}
              </td>
              <td class="py-2">
                <div class="_rt-day">
                  <span>월</span><span>화</span><span>수</span><span>목</span
                  ><span>금</span>
                </div>
              </td>
            </tr>
          </tbody>
          <tr>
            <td colspan="7" class="_rt-total">
              <strong>{{ `총 인원: ${selectedRide.count}` }}</strong>
            </td>
          </tr>
        </template>
      </v-simple-table>
    </v-card>
  </div>
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
/* ********** print 인쇄 스타일 ********** */
._print-paper {
  display: block;
  margin: 1rem 10%;
}
._print-ride-table {
  tbody:nth-child(even) {
    background-color: #f5f5f5;
  }
  tr {
    transition: 0.2s;
  }
  tr:hover {
    background-color: var(--v-secondary-lighten5) !important;
  }
  ._rt-lo,
  ._rt-da,
  ._rt-co {
    border-bottom: none !important;
  }
  ._rt-lo {
    font-weight: 600;
    word-break: auto-phrase;
  }
  ._rt-day {
    display: flex;
    align-items: center;
    gap: 0.5em;
    span {
      display: flex;
      align-items: center;
      justify-content: center;
      border: thin solid rgba(0, 0, 0, 0.12);
      font-size: 0.8em;
      width: 25px;
      height: 25px;
      border-radius: 100%;
    }
  }
  .v-icon.v-icon {
    font-size: 1.2em;
    opacity: 0.8;
  }
  ._rt-total {
    background: none;
    color: unset;
    border-top: thin solid rgba(0, 0, 0, 0.87);
    text-align: center;
    padding: 10px;
  }
}

/* 인쇄 시 A4 크기로 설정 */
@media print {
  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  @page {
    size: A4; /* A4 크기 설정 */
    margin: 5mm; /* 용지 여백 설정 (20mm 권장) */
  }

  /* 페이지에 맞게 레이아웃 설정 */
  html,
  body {
    margin: 0;
    padding: 0;
    background-color: #fff;
  }
  ._print-paper {
    width: 210mm;
    height: 297mm;
    margin: 0 auto;
    padding: 0;
    box-sizing: border-box;
  }
  ._print-ride-table {
    tr {
      page-break-inside: avoid;
      page-break-after: auto;
    }
    td {
      font-size: 12px !important;
    }
  }
  .v-btn {
    display: none !important;
  }
}
</style>
