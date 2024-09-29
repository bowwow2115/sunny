<template>
  <v-dialog v-model="visible" @input="onDialogInput" max-width="400px">
    <v-card>
      <v-card-title class="headline">원아 엑셀 등록</v-card-title>
      <v-card-text>
        <v-form v-model="isValid" ref="form">
          <v-file-input
            accept=".xlsx"
            label="파일을 등록해주세요."
            v-model="form.file"
            :rules="fileRules"
          ></v-file-input>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="green lighten-2" text @click="confirm">등록</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="red lighten-2" text @click="cancel">닫기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { registChildAsExcel } from '@/api/api.js'
export default {
  data() {
    return {
      visible: false,
      form: {
        file: null,
      },
      fileRules: [(v) => !!v || '필수 항목입니다.'],
    }
  },
  methods: {
    open(code, message) {
      console.log(code, message)
      this.visible = true
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
      console.log(this.form.file)

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
