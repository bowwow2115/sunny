<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn @click="openManageClassDialog()">반 설정</v-btn>
      </v-col>
      <v-col>
        <v-btn>승하차장소 설정</v-btn>
      </v-col>
      <v-col>
        <v-btn>유저설정</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ManageClassDialog from '@/components/dialog/ManageClassDialog.vue'

export default {
  name: 'AdminMenu',
  mounted() {},
  data() {
    return {
      show: false,
    }
  },
  methods: {
    async openManageClassDialog() {
      await this.$dialog(ManageClassDialog, null)
    },
  },
}
</script>

<style></style>
