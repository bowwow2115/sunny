<template>
  <v-snackbar v-model="visible" :timeout="timeout">
    <v-icon :color="typeIcon.color">{{ typeIcon.name }}</v-icon>
    {{ form.message }}

    <template v-slot:action="{ attrs }">
      <v-btn type="red" text v-bind="attrs" @click="visible = false">
        <v-icon small>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      form: {
        type: 'info',
        message: '',
      },
      timeout: 2000,
    }
  },
  computed: {
    typeIcon() {
      let typeIcon
      switch (this.form.type) {
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
    open(type, message) {
      this.visible = true
      this.form.type = type
      this.form.message = message
    },
  },
}
</script>

<style></style>
