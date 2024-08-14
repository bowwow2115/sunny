<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn @click="openManageClassDialog()">반 설정</v-btn>
      </v-col>
      <v-col>
        <v-btn @click="openManageRideDialog()">차량 설정</v-btn>
      </v-col>
      <v-col>
        <v-btn>유저 설정</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ManageClassDialog from '@/components/dialog/ManageClassDialog.vue'
import ManageRideDialog from '@/components/dialog/ManageRideDialog.vue'
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
    async openManageRideDialog() {
      await this.$dialog(ManageRideDialog, null)
    },
  },
}
</script>

<style></style>
