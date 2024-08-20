<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn @click="openManageClassDialog()">반 관리</v-btn>
      </v-col>
      <v-col>
        <v-btn @click="openManageUserDialog()">사용자 관리</v-btn>
      </v-col>
      <v-col>
        <v-btn @click="openManageRideDialog()">차량 관리</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ManageClassDialog from '@/components/admin/ClassDialog.vue'
import ManageUserDialog from '@/components/admin/UserDialog.vue'
import ManageRideDialog from '@/components/admin/RideDialog.vue'
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
    async openManageUserDialog() {
      await this.$dialog(ManageUserDialog, null)
    },
    async openManageRideDialog() {
      await this.$dialog(ManageRideDialog, null)
    },
  },
}
</script>

<style></style>
