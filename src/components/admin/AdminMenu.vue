<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn @click="openManageClassDialog()">반 관리</v-btn>
      </v-col>
      <v-col>
        <v-btn @click="openManageUserDialog()">사용자 관리</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ManageClassDialog from '@/components/admin/ManageClassDialog.vue'
import ManageUserDialog from '@/components/admin/ManageUserDialog.vue'
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
  },
}
</script>

<style></style>
