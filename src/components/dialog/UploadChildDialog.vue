<template>
  <v-dialog v-model="visible" @input="onDialogInput">
    <v-card class="pa-2">
      <v-card-title class="title">원아 엑셀 등록</v-card-title>
      <v-card-text class="mt-2">
        <v-form v-model="isValid" ref="form">
          <v-file-input
            accept=".xlsx"
            label="파일을 등록해주세요."
            outlined
            v-model="form.file"
            :rules="fileRules"
          ></v-file-input>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="gray" text large @click="cancel">닫기</v-btn>
        <v-btn color="success" text large @click="confirm">등록</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { registChildAsExcel } from '@/api/api.js'
export default {
  data() {
    return {
      isValid: false,
      visible: false,
      form: {
        file: null,
      },
      resolve: null,
      reject: null,
      fileRules: [(v) => !!v || '필수 항목입니다.'],
    }
  },
  methods: {
    open(code, message) {
      this.visible = true
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    cancel() {
      this.visible = false
    },
    onDialogInput(value) {
      if (!value) {
        this.cancel()
      }
    },
    confirm() {
      if (this.$refs.form.validate()) {
        const formData = new FormData()
        formData.append('file', this.form.file)
        this.$withLoading(
          registChildAsExcel(formData)
            .then((response) => {
              if (response.code == '0') {
                this.$showMessage({
                  type: 'success',
                  message: '성공적으로 등록했습니다.',
                })
                this.cancel()
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
