<template>
  <v-dialog v-model="visible" max-width="400px">
    <v-card>
      <v-card-title color="primary" class="headline">{{
        isEdit ? '승하차 장소 정보 수정' : '승하차 장소 정보 추가'
      }}</v-card-title>
      <v-form v-model="isValid" ref="form" lazy-validation>
        <v-card-text>
          <v-text-field
            prepend-icon="mdi-map-marker-radius"
            v-model="form.name"
            label="차량의 이름을 입력해주세요."
            :rules="nameRule"
            clearable
          ></v-text-field>

          <v-radio-group row v-model="form.isAm">
            <v-radio label="오전" :value="true"></v-radio>
            <v-radio label="오후" :value="false"></v-radio>
          </v-radio-group>

          <v-text-field
            prepend-icon="mdi-clock-time-eight"
            v-model="form.timeInput"
            label="차량시간을 입력해주세요.(예:1630)"
            :rules="timeRule"
            clearable
          ></v-text-field>
          <v-text-field
            prepend-icon="mdi-map-marker-radius"
            v-model="form.comment"
            label="비고사항을 입력해주세요."
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
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { updateRide, addRide } from '@/api/api'
export default {
  mounted() {},
  data() {
    return {
      isValid: false,
      visible: false,
      resolve: null,
      reject: null,
      form: {
        id: '',
        name: '',
        time: '',
        timeInput: '',
        comment: '',
        isAm: true,
      },
      isEdit: false,
      nameRule: [(v) => !!v || '필수 항목입니다.'],
      timeRule: [
        (v) => !!v || '필수 항목입니다.',
        (v) => /^\d+$/.test(v) || '숫자만 입력해 주세요.',
        (v) => /^\d{4}$/.test(v) || '4자리로 입력해 주세요',
      ],
    }
  },
  methods: {
    open(item) {
      console.log(item)
      this.visible = true
      this.isEdit = item.isEdit
      if (item.isEdit) {
        this.form.sunnyRide = item.sunnyRide
        if (item.time != null) this.form.timeInput = item.time.replace(':', '')
        this.form.time = item.time
        this.form.id = item.id
        this.form.name = item.name
        this.form.comment = item.comment
        this.form.isAm = item.am
      }
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    cancel() {
      this.visible = false
    },
    confirm() {
      if (this.$refs.form.validate()) {
        this.form.time =
          this.form.timeInput.slice(0, 2) + ':' + this.form.timeInput.slice(2)
        if (this.isEdit) {
          this.$withLoading(
            updateRide(this.form)
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
            addRide(this.form)
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
      }
    },
  },
}
</script>

<style scoped>
/* 원하는 스타일 추가 */
</style>
