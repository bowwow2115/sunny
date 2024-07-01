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
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState({
      errorMsgBox: (state) => state.errorMsgBox,
    }),
  },
  methods: {
    ...mapActions(['closeError']),
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
