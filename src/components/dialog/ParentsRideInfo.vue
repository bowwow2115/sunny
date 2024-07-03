<template>
  <v-dialog v-model="errorMsgBox.show" @input="onDialogInput" max-width="400px">
    <v-card>
      <v-card-title class="headline">{{ errorMsgBox.code }}</v-card-title>
      <v-card-text>{{ errorMsgBox.message }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red lighten-2" text @click="closeError">닫기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      errorMsgBox: {
        show: false,
        code: '',
        message: '',
      },
    }
  },
  methods: {
    showError(payload) {
      this.errorMsgBox.show = true
      this.errorMsgBox.code = payload.code || '정의되지 않은 에러입니다.'
      this.errorMsgBox.message = payload.message || '관리자에게 문의하세요'
    },
    closeError() {
      this.errorMsgBox.show = false
      this.errorMsgBox.code = ''
      this.errorMsgBox.message = ''
    },
    onDialogInput(value) {
      if (!value) {
        this.closeError()
      }
    },
  },
}
</script>

<style scoped>
/* 원하는 스타일 추가 */
</style>
