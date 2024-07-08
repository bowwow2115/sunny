<template>
  <v-alert
    border="left"
    v-model="alertMsgBox.show"
    dismissible
    transition="slide-y-transition"
    :type="alertMsgBox.type"
    style="position: fixed; z-index: 99"
    >{{ alertMsgBox.message }}</v-alert
  >
</template>

<script>
export default {
  name: 'GlobalAlert',
  data() {
    return {
      alertMsgBox: {
        show: false,
        type: 'success',
        message: '',
      },
    }
  },
  methods: {
    showAlert(payload) {
      this.alertMsgBox.show = true
      this.alertMsgBox.type = payload.type
      this.alertMsgBox.message = payload.message
      setTimeout(this.closeAlert, 2000)
    },
    closeAlert() {
      this.alertMsgBox.show = false
      this.alertMsgBox.type = ''
      this.alertMsgBox.message = ''
    },
  },
}
</script>

<style></style>
