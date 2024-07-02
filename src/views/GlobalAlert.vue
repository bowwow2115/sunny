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
import { mapState, mapActions } from 'vuex'

export default {
  name: 'GlobalAlert',
  computed: {
    ...mapState({
      alertMsgBox: (state) => state.alertMsgBox,
    }),
  },
  methods: {
    ...mapActions(['closeAlert']),
  },
}
</script>

<style></style>
