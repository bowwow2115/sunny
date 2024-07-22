<template>
  <v-dialog v-model="visible" max-width="400px">
    <v-card>
      <v-card-title class="headline">{{
        (am ? '오전' : '오후') + (isEdit ? '차량 정보 수정' : '차량 정보 추가')
      }}</v-card-title>
      <v-form v-model="isValid" ref="form" lazy-validation>
        <v-card-text>
          <v-select
            prepend-icon="mdi-bus"
            v-model="selectedSunnyRide"
            :items="am ? amRideNameList : pmRideNameList"
            item-text="name"
            return-object
            :rules="rideRule"
            :label="(am ? '오전' : '오후') + '코스를 선택해주세요'"
          ></v-select>
          <v-select
            prepend-icon="mdi-human-male-child"
            v-model="form.meetingLocation"
            :label="'승하차 장소를 선택해주세요.'"
            :rules="meetingLocationRule"
            item-text="name"
            return-object
            :items="selectedSunnyRide.meetingLocationList"
          ></v-select>
          <v-text-field
            prepend-icon="mdi-comment"
            v-model="form.comment"
            label="비고"
            clearable
          ></v-text-field>
        </v-card-text>
      </v-form>
      <v-card-actions>
        <v-btn color="accent" text @click="confirm">{{
          isEdit ? '수정' : '추가'
        }}</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="red lighten-2" text @click="cancel">닫기</v-btn>
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
      selectedSunnyRide: {},
      rideRule: [(v) => !!v || '필수 항목입니다.'],
      meetingLocationRule: [(v) => !!v || '필수 항목입니다.'],
    }
  },
  methods: {
    getRideList() {
      getRideList()
        .then((response) => {
          if (response.data != null) {
            response.data.forEach((element) => {
              if (element.meetingLocationList != null)
                element.meetingLocationList.forEach((meetingLocation) => {
                  meetingLocation.name = `${meetingLocation.name}(${meetingLocation.time})`
                })
              if (element.am) this.amRideNameList.push(element)
              else this.pmRideNameList.push(element)
            })
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
      this.form.meetingLocation = item.meetingLocation
      this.form.time = item.time
      this.form.child = item.child
      this.isEdit = item.isEdit
      this.am = item.am
      if (
        item.meetingLocation != null &&
        item.meetingLocation.sunnyRide != null
      )
        this.selectedSunnyRide = item.meetingLocation.sunnyRide
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
  },
}
</script>

<style scoped>
/* 원하는 스타일 추가 */
</style>
