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
            <strong class="text-h1 font-weight-regular mr-6">오전</strong>
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
        <v-timeline-item color="pink" small>
          <v-row class="pt-1">
            <v-col cols="3">
              <strong>5pm</strong>
            </v-col>
            <v-col>
              <strong>New Icon</strong>
              <div class="text-caption">Mobile App</div>
            </v-col>
          </v-row>
        </v-timeline-item>

        <v-timeline-item color="teal lighten-3" small>
          <v-row class="pt-1">
            <v-col cols="3">
              <strong>3-4pm</strong>
            </v-col>
            <v-col>
              <strong>Design Stand Up</strong>
              <div class="text-caption mb-2">Hangouts</div>
              <v-avatar>
                <v-img
                  src="https://avataaars.io/?avatarStyle=Circle&topType=LongHairFrida&accessoriesType=Kurt&hairColor=Red&facialHairType=BeardLight&facialHairColor=BrownDark&clotheType=GraphicShirt&clotheColor=Gray01&graphicType=Skull&eyeType=Wink&eyebrowType=RaisedExcitedNatural&mouthType=Disbelief&skinColor=Brown"
                ></v-img>
              </v-avatar>
              <v-avatar>
                <v-img
                  src="https://avataaars.io/?avatarStyle=Circle&topType=ShortHairFrizzle&accessoriesType=Prescription02&hairColor=Black&facialHairType=MoustacheMagnum&facialHairColor=BrownDark&clotheType=BlazerSweater&clotheColor=Black&eyeType=Default&eyebrowType=FlatNatural&mouthType=Default&skinColor=Tanned"
                ></v-img>
              </v-avatar>
              <v-avatar>
                <v-img
                  src="https://avataaars.io/?avatarStyle=Circle&topType=LongHairMiaWallace&accessoriesType=Sunglasses&hairColor=BlondeGolden&facialHairType=Blank&clotheType=BlazerSweater&eyeType=Surprised&eyebrowType=RaisedExcited&mouthType=Smile&skinColor=Pale"
                ></v-img>
              </v-avatar>
            </v-col>
          </v-row>
        </v-timeline-item>

        <v-timeline-item color="pink" small>
          <v-row class="pt-1">
            <v-col cols="3">
              <strong>12pm</strong>
            </v-col>
            <v-col>
              <strong>Lunch break</strong>
            </v-col>
          </v-row>
        </v-timeline-item>

        <v-timeline-item color="teal lighten-3" small>
          <v-row class="pt-1">
            <v-col cols="3">
              <strong>9-11am</strong>
            </v-col>
            <v-col>
              <strong>Finish Home Screen</strong>
              <div class="text-caption">Web App</div>
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
      selectedRide: null,
      selectedAmPm: '',
    }
  },
  mounted() {
    this.getRideList()
  },
  methods: {
    comment() {
      const time = new Date().toTimeString()
      this.events.push({
        id: this.nonce++,
        text: this.input,
        time: time.replace(
          /:\d{2}\sGMT-\d{4}\s\((.*)\)/,
          (match, contents, offset) => {
            return ` ${contents
              .split(' ')
              .map((v) => v.charAt(0))
              .join('')}`
          }
        ),
      })

      this.input = null
    },
    getRideList() {
      this.$withLoading(
        getRideList()
          .then((response) => {
            if (response.code == '0') {
              this.rideList = response.data
              response.data.foreach((item) => {
                if (item.am) this.amRideList.push(item)
                else this.pmRideList.push(item)
              })
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
