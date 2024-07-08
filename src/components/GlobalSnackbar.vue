<template>
  <v-snackbar v-model="snackbarBox.snackbar" :timeout="timeout">
    <v-icon :color="typeIcon.color">{{ typeIcon.name }}</v-icon>
    {{ snackbarBox.message }}

    <template v-slot:action="{ attrs }">
      <v-btn
        type="red"
        text
        v-bind="attrs"
        @click="snackbarBox.snackbar = false"
      >
        <v-icon small>mdi-close</v-icon>
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
        type: 'info',
        message: '',
      },
      timeout: 2000,
    }
  },
  computed: {
    typeIcon() {
      let typeIcon
      switch (this.snackbarBox.type) {
        case 'success':
          typeIcon = { name: 'mdi-check-circle', color: 'green' }
          break
        case 'warning':
          typeIcon = { name: 'mdi-alert', color: 'red' }
          break
        case 'info':
          typeIcon = { name: 'mdi-information', color: 'info' }
          break
      }
      return typeIcon
    },
  },
  methods: {
    showMessage(payload) {
      this.snackbarBox.snackbar = true
      this.snackbarBox.type = payload.type
      this.snackbarBox.message = payload.message
    },
    closeMessage() {
      this.snackbarBox.snackbar = false
      this.snackbarBox.type = 'red'
      this.snackbarBox.message = ''
    },
  },
}
</script>

<style></style>
