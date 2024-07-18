<template>
  <v-dialog v-model="visible" max-width="400px">
    <v-card>
      <v-toolbar color="primary">{{
        isEdit
          ? form.child.name + ' 차량 정보 수정'
          : form.sunnyRide.name + ' 원아 추가'
      }}</v-toolbar>
      <v-card-text>
        <v-select
          v-if="!isEdit"
          prepend-icon="mdi-bus"
          v-model="form.sunnyRide.id"
          :items="form.sunnyRide.am ? amChildList : pmChildList"
          item-text="name"
          item-value="id"
          :label="form.sunnyRide.name + '에 탑승할 원아을 선택해주세요'"
          clearable
        ></v-select>
        <v-select
          prepend-icon="mdi-human-male-child"
          v-model="form.time"
          :label="
            (form.sunnyRide.am ? '승차' : '하차') + '차량시간을 선택해주세요.'
          "
          :items="form.sunnyRide.am ? amRideTimeList : pmRideTimeList"
          clearable
        ></v-select>
        <v-text-field
          prepend-icon="mdi-comment"
          v-model="form.comment"
          label="비고"
          clearable
        ></v-text-field>
      </v-card-text>
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
import { getUnRidedChildren, addChildRide, updateChildRide } from '@/api/api'
export default {
  mounted() {
    if (!this.isEdit) this.getUnRidedChildren()
  },
  data() {
    return {
      visible: false,
      resolve: null,
      reject: null,
      form: {
        id: '',
        comment: '',
        time: '',
        sunnyRide: { id: '', am: false, comment: '', name: '' },
        child: { id: '' },
      },
      isEdit: false,
      amChildList: [],
      pmChildList: [],
      amRideTimeList: Utils.getTimeIntervals('07:00', '10:00'),
      pmRideTimeList: Utils.getTimeIntervals('15:00', '19:00'),
    }
  },
  methods: {
    getUnRidedChildren() {
      getUnRidedChildren()
        .then((response) => {
          if (response.data != null && response.code == '0') {
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
      this.form.sunnyRide = item.sunnyRide
      this.form.time = item.time
      this.form.child = item.child
      this.isEdit = item.isEdit
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    cancel() {
      this.visible = false
    },
    confirm() {
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
