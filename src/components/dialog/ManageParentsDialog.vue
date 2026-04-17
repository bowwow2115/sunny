<template>
  <v-dialog
    v-model="dialogModel"
    persistent
    max-width="600px"
    teleport="body"
    @click:outside="handleCancel"
  >
    <v-card class="pa-2">
      <v-card-title class="d-flex align-center justify-space-between">
        <span class="text-h6 font-weight-bold">
          {{ isEdit ? '보호자 정보 수정' : '보호자 정보 추가' }}
        </span>
        <v-btn icon size="small" variant="text" @click="handleCancel">
          <v-icon icon="ri-close-line"></v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="mt-4">
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="form.name"
              label="보호자의 이름을 입력해주세요."
              variant="outlined"
              clearable
              clear-icon="ri-close-circle-fill"
              density="comfortable"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="form.relation"
              :items="parentTypeList"
              label="보호자와의 관계를 입력해주세요."
              variant="outlined"
              clearable
              clear-icon="ri-close-circle-fill"
              density="comfortable"
            ></v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="form.telephone"
              prepend-inner-icon="ri-phone-fill"
              label="보호자의 전화번호를 입력해주세요."
              variant="outlined"
              clearable
              clear-icon="ri-close-circle-fill"
              density="comfortable"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="flex-wrap justify-end py-4 px-6">
        <v-btn variant="text" color="grey" size="large" @click="handleCancel">
          닫기
        </v-btn>
        <v-btn
          variant="text"
          color="accent"
          size="large"
          :loading="loading"
          @click="handleConfirm"
        >
          {{ isEdit ? '수정' : '추가' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { updateParents, addParents } from '@/api/api'
import { useGlobal } from '@/composables/useGlobal'

const { $showError, $withLoading } = useGlobal()

const props = defineProps({
  id: { type: [String, Number], default: '' },
  childId: { type: [String, Number], default: '' },
  name: { type: String, default: '' },
  telephone: { type: String, default: '' },
  relation: { type: String, default: '' },
  isEdit: { type: Boolean, default: false },
  onClose: { type: Function, default: () => {} },
  onError: { type: Function, default: () => {} },
})

const dialogModel = ref(true)
const loading = ref(false)
const form = ref<any>({
  id: props.id,
  childId: props.childId,
  name: props.name,
  telephone: props.telephone,
  relation: props.relation,
})

const isEdit = ref(props.isEdit)
const parentTypeList: string[] = ['부', '모', '조부', '조모', '그 외']

const handleCancel = () => {
  dialogModel.value = false
  setTimeout(() => {
    props.onClose(null)
  }, 150)
}

const handleConfirm = async () => {
  loading.value = true

  try {
    const apiCall = isEdit.value
      ? () => updateParents(form.value)
      : () => addParents(form.value)

    const response: any = await ($withLoading?.(apiCall()) ?? apiCall())

    if (response?.code === '0' || response?.code === 0) {
      dialogModel.value = false
      setTimeout(() => {
        props.onClose(response.data)
      }, 150)
    }
  } catch (error) {
    console.error('Save parent error:', error)
    props.onError?.(error)
    $showError?.(error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel()
      document.removeEventListener('keydown', onKeydown)
    }
  }
  document.addEventListener('keydown', onKeydown)
})
</script>

<style scoped>
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
