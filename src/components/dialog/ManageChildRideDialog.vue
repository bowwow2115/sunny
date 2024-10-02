<template>
  <v-dialog v-model="visible">
    <v-card class="pa-2">
      <v-card-title class="title">{{
        (am ? '오전' : '오후') + (isEdit ? '차량 정보 수정' : '차량 정보 추가')
      }}</v-card-title>
      <v-form v-model="isValid" ref="form" lazy-validation>
        <v-card-text class="mt-4">
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="selectedSunnyRide"
                :items="am ? amRideNameList : pmRideNameList"
                item-text="name"
                return-object
                :rules="rideRule"
                :label="(am ? '오전' : '오후') + '코스를 선택해주세요'"
                @input="resetMeetingLocation()"
                outlined
                hide-details="auto"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.meetingLocation.id"
                :label="'승하차 장소를 선택해주세요.'"
                :rules="meetingLocationRule"
                item-text="name"
                item-value="id"
                :items="selectedSunnyRide.meetingLocationList"
                outlined
                hide-details="auto"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-text-field
                prepend-inner-icon="ri-message-2-fill"
                v-model="form.comment"
                label="비고"
                outlined
                clearable
                clear-icon="ri-close-circle-fill"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-form>
      <v-card-actions class="flex-wrap justify-end py-4 px-6">
        <v-btn color="gray" text large @click="cancel">닫기</v-btn>
        <v-btn color="accent" text large @click="confirm">{{
          isEdit ? '수정' : '추가'
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { getRideList, addChildRide, updateChildRide } from '@/api/api'
export default {
  mounted() {
    this.getRideList()
  },
  data() {
    return {
      isValid: false,
      visible: false,
      resolve: null,
      reject: null,
      form: {
        id: '',
        comment: '',
        meetingLocation: {
          id: '',
          name: '',
          sunnyRide: {
            am: false,
            comment: '',
            name: '',
            time: '',
            id: '',
            meetingLocationList: [],
          },
        },
        child: { id: '' },
      },
      isEdit: false,
      am: false,
      amRideNameList: [],
      pmRideNameList: [],
      selectedSunnyRide: { meetingLocationList: [] },
      rideRule: [(v) => !!v || '필수 항목입니다.'],
      meetingLocationRule: [(v) => !!v || '필수 항목입니다.'],
    }
  },
  methods: {
    getRideList() {
      getRideList()
        .then((response) => {
          if (response.data != null) {
            response.data.forEach((ride) => {
              if (ride.meetingLocationList != null)
                ride.meetingLocationList.forEach((meetingLocation) => {
                  meetingLocation.name = `${meetingLocation.name}(${meetingLocation.time})`
                })
              if (ride.am) this.amRideNameList.push(ride)
              else this.pmRideNameList.push(ride)
            })
            if (this.isEdit) {
              this.selectedSunnyRide = this.am
                ? this.amRideNameList.find(
                    (item) => item.id == this.form.meetingLocation.sunnyRide.id
                  )
                : this.pmRideNameList.find(
                    (item) => item.id == this.form.meetingLocation.sunnyRide.id
                  )
            }
          }
        })
        .catch((error) => {
          console.log(error)
          this.$showError(error)
        })
    },
    open(item) {
      this.visible = true
      this.form.id = item.id
      this.form.comment = item.comment
      if (item.isEdit) this.form.meetingLocation = item.meetingLocation
      this.form.child = item.child
      this.isEdit = item.isEdit
      this.am = item.am
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    cancel() {
      this.visible = false
    },
    confirm() {
      if (this.$refs.form.validate())
        if (this.isEdit) {
          this.$withLoading(
            updateChildRide(this.form)
              .then((response) => {
                if (response.code == '0') {
                  this.visible = false
                  this.resolve(response.data)
                }
              })
              .catch((e) => {
                this.$showError(e)
              })
          )
        } else {
          this.$withLoading(
            addChildRide(this.form)
              .then((response) => {
                if (response.code == '0') {
                  this.visible = false
                  this.resolve(response.data)
                }
              })
              .catch((e) => {
                this.$showError(e)
              })
          )
        }
    },
    resetMeetingLocation() {
      this.form.meetingLocation.id = ''
    },
  },
}
</script>

<style scoped>
/* 원하는 스타일 추가 */
</style>
