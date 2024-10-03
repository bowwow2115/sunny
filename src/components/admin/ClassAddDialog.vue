<template>
  <v-dialog v-model="visible">
    <v-card class="pa-2 _pop-small-card">
      <v-card-title class="title">반 추가</v-card-title>
      <v-card-text class="mt-4">
        <v-text-field
          v-model="form.name"
          label="반 이름을 입력해주세요."
          outlined
          clearable
          clear-icon="ri-close-circle-fill"
        ></v-text-field>
      </v-card-text>
      <v-card-actions class="flex-wrap justify-end py-4 px-6">
        <v-btn color="gray" text large @click="cancel">닫기</v-btn>
        <v-btn color="accent" text large @click="confirm">추가</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { addClass } from '@/api/api'
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
      },
      isEdit: false,
    }
  },
  methods: {
    open() {
      this.visible = true
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
        addClass(this.form)
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
