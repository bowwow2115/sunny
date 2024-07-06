<template>
  <v-snackbar
    v-model="snackbarBox.snackbar"
    :timeout="timeout"
    :color="snackbarBox.color"
  >
    {{ snackbarBox.message }}

    <template v-slot:action="{ attrs }">
      <v-btn
        color="red"
        text
        v-bind="attrs"
        @click="snackbarBox.snackbar = false"
      >
        <v-icon small>close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  data() {
    return {
      snackbarBox: {
        snackbar: false,
        color: 'red',
        message: '',
      },
      timeout: 2000,
    }
  },
  methods: {
    showMessage(payload) {
      this.snackbarBox.snackbar = true
      this.snackbarBox.color = payload.color
      this.snackbarBox.message = payload.message
    },
    closeMessage() {
      this.snackbarBox.snackbar = false
      this.snackbarBox.color = 'red'
      this.snackbarBox.message = ''
    },
  },
}
</script>

<style></style>
