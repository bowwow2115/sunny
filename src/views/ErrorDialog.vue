<template>
  <v-dialog v-model="dialog.show" max-width="300px">
    <v-card>
      <v-card-title class="headline">{{ dialog.code }}</v-card-title>
      <v-card-text>{{ dialog.message }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="closeError">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState({
      dialog: (state) => state.errorMsg,
    }),
  },
  methods: {
    ...mapActions(['closeError']),
  },
}
</script>

<style scoped>
/* 원하는 스타일 추가 */
</style>
