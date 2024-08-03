<template>
  <v-dialog v-model="visible" max-width="400px">
    <v-card>
      <v-card-title color="primary" class="headline">{{
        this.form.name + '정보 수정'
      }}</v-card-title>
      <v-card-text>
        <v-text-field
          prepend-icon="mdi-account"
          v-model="form.name"
          label="승하차 장소의 이름을 입력해주세요."
          clearable
        ></v-text-field>
        <v-row>
          <v-col cols="6">
            <v-select
              prepend-icon="mdi-clock-time-twelve"
              v-model="hour"
              :items="[...Array(24).keys()]"
              label="시간을 입력해주세요"
              clearable
            ></v-select>
          </v-col>
          <v-col cols="6">
            <v-select
              prepend-icon="mdi-clock-time-eight"
              v-model="minute"
              :items="[...Array(60).keys()]"
              label="분을 입력해주세요."
              clearable
            ></v-select>
          </v-col>
        </v-row>
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
import { updateParents, addParents } from '@/api/api'
export default {
  mounted() {},
  data() {
    return {
      visible: false,
      resolve: null,
      reject: null,
      form: {
        id: '',
        name: '',
        time: '',
      },
      isEdit: false,
    }
  },
  methods: {
    open(item) {
      this.visible = true
      this.form.id = item.id
      this.form.name = item.name
      this.form.time = item.time
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    cancel() {
      this.visible = false
    },
    confirm() {
      this.$withLoading(
        updateParents(this.form)
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
    },
  },
}
</script>

<style scoped>
/* 원하는 스타일 추가 */
</style>
