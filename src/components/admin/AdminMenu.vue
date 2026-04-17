<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="4">
        <v-btn
          block
          variant="tonal"
          color="primary"
          size="large"
          @click="openManageClassDialog"
        >
          <v-icon icon="ri-book-read-fill" start></v-icon>
          반 관리
        </v-btn>
      </v-col>
      <v-col cols="12" sm="4">
        <v-btn
          block
          variant="tonal"
          color="primary"
          size="large"
          @click="openManageUserDialog"
        >
          <v-icon icon="ri-user-fill" start></v-icon>
          사용자 관리
        </v-btn>
      </v-col>
      <v-col cols="12" sm="4">
        <v-btn
          block
          variant="tonal"
          color="primary"
          size="large"
          @click="openManageRideDialog"
        >
          <v-icon icon="ri-bus-2-fill" start></v-icon>
          차량 관리
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useGlobal } from '@/composables/useGlobal'
import ManageClassDialog from '@/components/admin/ClassDialog.vue'
import ManageUserDialog from '@/components/admin/UserDialog.vue'
import ManageRideDialog from '@/components/admin/RideDialog.vue'

const { $dialog, $showError } = useGlobal()

// ✅ 반 관리 다이얼로그
const openManageClassDialog = async (): Promise<void> => {
  try {
    await $dialog?.(ManageClassDialog, null)
  } catch (error) {
    console.error('ManageClassDialog error:', error)
    $showError?.(error)
  }
}

// ✅ 사용자 관리 다이얼로그
const openManageUserDialog = async (): Promise<void> => {
  try {
    await $dialog?.(ManageUserDialog, null)
  } catch (error) {
    console.error('ManageUserDialog error:', error)
    $showError?.(error)
  }
}

// ✅ 차량 관리 다이얼로그
const openManageRideDialog = async (): Promise<void> => {
  try {
    await $dialog?.(ManageRideDialog, null)
  } catch (error) {
    console.error('ManageRideDialog error:', error)
    $showError?.(error)
  }
}
</script>

<style scoped>
/* 모바일에서 버튼 간격 조정 */
@media (max-width: 600px) {
  .v-row {
    gap: 12px;
  }
}

/* 버튼 호버 효과 강화 */
:deep(.v-btn--variant-tonal:hover) {
  transform: translateY(-2px);
  transition: transform 0.2s ease;
}
</style>
