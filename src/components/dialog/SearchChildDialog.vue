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
        <span class="text-h6 font-weight-bold">승하차등록</span>
        <v-btn icon size="small" variant="text" @click="handleCancel">
          <v-icon icon="ri-close-line"></v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-row no-gutters class="align-center">
          <v-col>
            <v-text-field
              v-model="searchTerm"
              clearable
              variant="solo"
              bg-color="grey-lighten-4"
              hide-details
              prepend-inner-icon="ri-search-line"
              @update:model-value="searchList"
              label="이름 또는 반을 입력하세요."
              density="compact"
            ></v-text-field>
          </v-col>
          <v-col cols="auto" class="pl-4">
            <div class="d-flex gap-2">
              <v-btn
                variant="text"
                color="grey"
                size="large"
                @click="handleCancel"
              >
                닫기
              </v-btn>
              <v-btn
                variant="text"
                color="accent"
                size="large"
                :disabled="selectedChild.length === 0"
                @click="handleConfirm"
              >
                추가
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card-text>

      <v-list select-strategy="classic" class="pa-0">
        <template v-if="filteredList?.length">
          <v-list-item
            v-for="(child, index) in filteredList"
            :key="child.id || index"
            :value="child.id"
            @click="toggleSelection(child.id)"
          >
            <v-list-item-title>{{ child.name }}</v-list-item-title>
            <v-list-item-subtitle class="text-grey">
              {{ child.className }}
            </v-list-item-subtitle>
            <template v-slot:append>
              <v-checkbox-btn
                :model-value="selectedChild.includes(child.id)"
                @click.stop="toggleSelection(child.id)"
              ></v-checkbox-btn>
            </template>
          </v-list-item>
          <v-divider v-if="index < filteredList.length - 1" />
        </template>

        <v-list-item v-else>
          <v-list-item-icon>
            <v-icon icon="mdi-information-off"></v-icon>
          </v-list-item-icon>
          <v-list-item-title>
            등록된 원아의 정보가 없습니다.
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Hangul from 'hangul-js'
import { addChildRideList } from '@/api/api.js'
import { useGlobal } from '@/composables/useGlobal'

const { $showError, $withLoading } = useGlobal()

const props = defineProps({
  childList: { type: Array, default: () => [] },
  meetingLocationName: { type: String, default: '' },
  meetingLocationId: { type: [String, Number], default: '' },
  onClose: { type: Function, default: () => {} },
  onError: { type: Function, default: () => {} },
})

const dialogModel = ref(true)
const searchTerm = ref('')
const selectedChild = ref([])
const childList = ref([...props.childList])
const meetingLocationId = ref(props.meetingLocationId)

const filteredList = computed(() => {
  if (!searchTerm.value) return childList.value

  const input = searchTerm.value.trim()
  if (!input) return childList.value

  return childList.value.filter(
    (item) =>
      Hangul.search(item.name, input) !== -1 ||
      Hangul.search(item.className, input) !== -1
  )
})

const handleCancel = () => {
  dialogModel.value = false
  setTimeout(() => {
    props.onClose(null)
  }, 150)
}

const toggleSelection = (childId) => {
  const idx = selectedChild.value.indexOf(childId)
  if (idx === -1) {
    selectedChild.value.push(childId)
  } else {
    selectedChild.value.splice(idx, 1)
  }
}

const makeForm = () => {
  return selectedChild.value.map((childId) => ({
    meetingLocation: { id: meetingLocationId.value },
    child: { id: childId },
  }))
}

const handleConfirm = async () => {
  if (selectedChild.value.length === 0) return

  const form = makeForm()

  try {
    const response = await ($withLoading?.(addChildRideList(form)) ??
      addChildRideList(form))

    if (response?.code === '0' || response?.code === 0) {
      dialogModel.value = false
      setTimeout(() => {
        props.onClose(response.data)
      }, 150)
    }
  } catch (error) {
    console.error('Add ride list error:', error)
    props.onError?.(error)
    $showError?.(error)
  }
}

const searchList = () => {
  // computed property handles filtering, no action needed
}

onMounted(() => {
  const onKeydown = (e) => {
    if (e.key === 'Escape') {
      handleCancel()
      document.removeEventListener('keydown', onKeydown)
    }
  }
  document.addEventListener('keydown', onKeydown)
})
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}

:deep(.v-list-item--active) {
  background-color: rgba(29, 118, 210, 0.08);
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
