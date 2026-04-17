<template>
  <v-dialog
    v-model="dialogModel"
    persistent
    max-width="720px"
    teleport="body"
    @click:outside="handleCancel"
  >
    <v-card class="pa-2">
      <v-card-title class="d-flex align-center justify-space-between">
        <span class="text-h6 font-weight-bold">보호자 정보</span>
        <v-btn icon size="small" variant="text" @click="handleCancel">
          <v-icon icon="ri-close-line"></v-icon>
        </v-btn>
      </v-card-title>

      <v-list class="pa-0">
        <template v-if="form.childRideList?.length">
          <v-list-group
            v-for="(childRide, index) in form.childRideList"
            :key="childRide.id || index"
            v-model="groups[index]"
            :value="index"
          >
            <template #activator="{ props: activatorProps }">
              <v-list-item
                v-bind="activatorProps"
                prepend-icon="ri-parent-fill"
              >
                <v-list-item-title>
                  {{ `${childRide.child?.name || '원아'}의 보호자 정보` }}
                </v-list-item-title>
              </v-list-item>
            </template>

            <template v-if="childRide.child?.parentList?.length">
              <v-list-item
                v-for="(parents, j) in childRide.child.parentList"
                :key="parents.id || j"
                class="ml-14"
              >
                <v-list-item-icon start>
                  <span class="_list-icon _list-icon-ko">{{
                    parents.relation
                  }}</span>
                </v-list-item-icon>
                <v-list-item-title class="_list-title-with-sub">
                  {{ parents.name }}
                  <span class="ml-2">
                    <v-btn
                      icon
                      size="x-small"
                      variant="text"
                      @click="copyToClipboard(parents.telephone)"
                    >
                      <v-icon icon="ri-phone-fill" color="grey"></v-icon>
                    </v-btn>
                    {{ parents.telephone }}
                  </span>
                </v-list-item-title>
              </v-list-item>
            </template>

            <v-list-item v-else>
              <v-list-item-icon>
                <v-icon icon="mdi-information-off"></v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                등록된 부모의 정보가 없습니다.
              </v-list-item-title>
            </v-list-item>
          </v-list-group>
        </template>

        <v-list-item v-else>
          <v-list-item-icon>
            <v-icon icon="mdi-information-off"></v-icon>
          </v-list-item-icon>
          <v-list-item-title>
            등록된 부모의 정보가 없습니다.
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <v-card-actions class="flex-wrap justify-end py-4 px-6">
        <v-btn variant="text" color="grey" size="large" @click="handleCancel">
          닫기
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useClipboard } from '@vueuse/core'
import { useGlobal } from '@/composables/useGlobal'
import type { ChildRide } from '@/types'

const { $showMessage } = useGlobal()
const { copy, copied } = useClipboard()

const props = defineProps({
  childRideList: { type: Array, default: () => [] },
  onClose: { type: Function, default: () => {} },
})

const dialogModel = ref(true)
const form = ref<{ childRideList: ChildRide[] }>({
  childRideList: [...(props.childRideList as ChildRide[])],
})

const groups = ref<Record<number, boolean>>({})

// Initialize groups state
onMounted(() => {
  form.value.childRideList.forEach((_, index) => {
    groups.value[index] = index === 0 // First group open by default
  })
})

const handleCancel = () => {
  dialogModel.value = false
  setTimeout(() => {
    props.onClose(null)
  }, 150)
}

const copyToClipboard = async (text: string) => {
  if (!text) return

  try {
    if (typeof (window as any).$clipboard === 'function') {
      await (window as any).$clipboard(text)
    } else if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
    } else {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }

    $showMessage?.({
      type: 'success',
      message: '전화번호를 클립보드에 저장했습니다.',
    })
  } catch (e) {
    console.error('Clipboard error:', e)
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
._list-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  background: #e3f2fd;
  color: #1976d2;
}

._list-icon-ko {
  background: #e3f2fd;
  color: #1976d2;
}

._list-title-with-sub {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

:deep(.v-list-group__items) {
  padding-left: 8px;
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
