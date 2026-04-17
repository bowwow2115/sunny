<template>
  <v-dialog
    v-model="dialogModel"
    persistent
    max-width="500px"
    teleport="body"
    @click:outside="handleCancel"
  >
    <v-card class="pa-2">
      <v-card-title class="d-flex align-center justify-space-between">
        <span class="text-h6 font-weight-bold">원아 엑셀 등록</span>
        <v-btn icon size="small" variant="text" @click="handleCancel">
          <v-icon icon="ri-close-line"></v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="mt-2">
        <v-form ref="formRef" v-model="isValid">
          <v-file-input
            v-model="form.file"
            accept=".xlsx,.xls"
            label="파일을 등록해주세요."
            :rules="fileRules"
            variant="outlined"
            clearable
            density="comfortable"
            prepend-icon="ri-file-excel-2-fill"
          ></v-file-input>
        </v-form>
      </v-card-text>

      <v-card-actions class="justify-end py-4 px-6">
        <v-btn variant="text" color="grey" size="large" @click="handleCancel">
          닫기
        </v-btn>
        <v-btn
          variant="text"
          color="success"
          size="large"
          :loading="loading"
          @click="handleConfirm"
        >
          등록
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { registChildAsExcel } from '@/api/api'
import { useGlobal } from '@/composables/useGlobal'

const { $showMessage, $showError, $withLoading } = useGlobal()

const props = defineProps({
  onClose: { type: Function, default: () => {} },
  onError: { type: Function, default: () => {} },
})

const dialogModel = ref(true)
const isValid = ref(false)
const loading = ref(false)
const formRef = ref<any>(null)

const form = ref<{ file: File | null }>({
  file: null,
})

const fileRules = [
  (v: any) => !!v || '필수 항목입니다.',
  (v: any) =>
    v?.type ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    v?.type === 'application/vnd.ms-excel' ||
    'xlsx 또는 xls 파일만 업로드 가능합니다.',
]

const handleCancel = () => {
  dialogModel.value = false
  form.value.file = null
  setTimeout(() => {
    props.onClose(null)
  }, 150)
}

const handleConfirm = async () => {
  const { valid } = (await formRef.value?.validate?.()) || {
    valid: isValid.value,
  }

  if (!valid || !form.value.file) {
    return
  }

  loading.value = true

  try {
    const formData = new FormData()
    formData.append('file', form.value.file)

    const response: any = await ($withLoading?.(registChildAsExcel(formData)) ??
      registChildAsExcel(formData))

    if (response?.code === '0' || response?.code === 0) {
      $showMessage?.({
        type: 'success',
        message: '성공적으로 등록했습니다.',
      })
      handleCancel()
    }
  } catch (error) {
    console.error('Excel upload error:', error)
    props.onError?.(error)
    $showError?.(error)
  } finally {
    loading.value = false
  }
}

// ESC 키로 닫기
const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    handleCancel()
    document.removeEventListener('keydown', onKeydown)
  }
}

// 컴포넌트 마운트 시 이벤트 리스너 등록
import { onMounted, onUnmounted } from 'vue'
onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
:deep(.v-file-input .v-field__input) {
  padding-block: 4px;
}

@media (max-width: 600px) {
  .v-card-actions {
    flex-direction: column-reverse;
    gap: 8px;
  }

  .v-card-actions .v-btn {
    width: 100%;
  }
}
</style>
