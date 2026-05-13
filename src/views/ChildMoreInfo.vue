<template>
  <!-- ✅ Vuetify 3: hide-overlay → scrim, fullscreen 유지 -->
  <v-dialog
    v-model="dialogModel"
    :fullscreen="isMobile"
    :scrim="!isMobile"
    persistent
    teleport="body"
    @click:outside="handleCancel"
  >
    <v-card class="popup">
      <!-- 헤더 -->
      <div class="popup-title-wrap">
        <v-card-title class="popup-title">원아정보 더보기</v-card-title>
        <v-btn
          @click="handleCancel"
          :icon="ICONS.close"
        ></v-btn>
      </div>
      <div class="popup-content">
        <!-- 원아 정보 헤더 -->
        <h2>
          {{ form.name }}
          <small>{{ form.status }}</small>
        </h2>

        <!-- 1. 원아 정보 섹션 -->
        <v-list>
          <v-list-group v-model="groups.childInfo" value="childInfo">
            <template #activator="{ props }">
              <v-list-item
                v-bind="props"
                :prepend-icon="ICONS.user"
                :append-icon="ICONS.expand"
                ><v-list-item-title>원아 정보</v-list-item-title>
              </v-list-item>
            </template>

            <!-- ✅ v-list-item-content 제거, 직접 v-list-item-title 사용 -->
            <v-list-item>
              <template v-slot:prepend>
                <span class="list-icon">반</span>
              </template>
              <v-list-item-title>{{ form.className }}</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <template v-slot:prepend>
                <span class="list-icon">입학</span>
              </template>
              <v-list-item-title>{{ form.admissionDate }}</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <template v-slot:prepend>
                <span class="list-icon">생일</span>
              </template>
              <v-list-item-title>{{ form.birthday }}</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <template v-slot:prepend>
                <span class="list-icon">주소</span>
              </template>
              <v-list-item-title>{{ fullAddress }}</v-list-item-title>
            </v-list-item>

            <v-list-item>
              <v-btn
                block
                variant="outlined"
                @click="openChildDialog"
                :append-icon="ICONS.edit"
              >정보 수정</v-btn>
            </v-list-item>
          </v-list-group>
        </v-list>

        <!-- 2. 보호자 정보 섹션 -->
        <v-list>
          <v-list-group v-model="groups.parentInfo" value="parentInfo">
            <template #activator="{ props }">
              <v-list-item
                v-bind="props"
                :prepend-icon="ICONS.parents"
                :append-icon="ICONS.expand"
                ><v-list-item-title>보호자 정보</v-list-item-title>
              </v-list-item>
            </template>

            <template v-if="form.parentList?.length">
              <template
                v-for="(item, index) in form.parentList"
                :key="item.id || index"
              >
                <v-list-item>
                  <template v-slot:prepend>
                    <span class="list-icon">{{item.relation}}</span>
                  </template>
                  <v-list-item-title class="input-group">
                    {{ item.name }}
                    <span>
                      <v-btn
                        color="info"
                        size="x-small"
                        variant="text"
                        @click="copyToClipboard(item.telephone)"
                        :icon="ICONS.phone"
                      >
                      </v-btn>
                      {{ item.telephone }}
                    </span>
                    <div class="list-item-actions">
                      <v-btn
                        size="small"
                        variant="text"
                        color="gray"
                        @click="deleteParents(item)"
                        :icon="ICONS.delete"
                      ></v-btn>
                      <v-btn
                        size="small"
                        variant="text"
                        color="success"
                        @click="openParentsDialog(true, item)"
                        :icon="ICONS.edit"
                      >
                        <v-icon icon="ri-edit-2-fill"></v-icon>
                      </v-btn>
                    </div>
                  </v-list-item-title>
                </v-list-item>
              </template>
            </template>

            <v-list-item v-else>
              <v-list-item-icon>
                <v-icon icon="mdi-information-off"></v-icon>
              </v-list-item-icon>
              <v-list-item-title
                >등록된 부모의 정보가 없습니다.</v-list-item-title
              >
            </v-list-item>

            <v-list-item>
              <v-btn
                block
                variant="outlined"
                @click="openParentsDialog(false)"
                :append-icon="ICONS.plus"
              >보호자 정보 추가</v-btn>
            </v-list-item>
          </v-list-group>
        </v-list>

        <!-- 3. 오전 차량 정보 섹션 -->
        <v-list>
          <v-list-group v-model="groups.amRide" value="amRide">
            <template #activator="{ props }">
              <v-list-item
                v-bind="props"
                :prepend-icon="ICONS.bus"
                :append-icon="ICONS.expand"
                ><v-list-item-title>오전 차량 정보</v-list-item-title>
              </v-list-item>
            </template>

            <template v-if="form.amChildRideList?.length">
              <template
                v-for="(childRide, index) in form.amChildRideList"
                :key="childRide.id || index"
              >
                <v-list-item>
                  <template v-slot:prepend>
                    <span class="list-icon-am">오전</span>
                  </template>
                  <div class="input-group">
                    <div>
                      <v-list-item-title class="mb-1">
                        {{ formatRideTitle(childRide) }}
                        <small class="ml-1 text-grey">{{
                          formatRideSubtitle(childRide)
                        }}</small>
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{
                          `${childRide.meetingLocation?.name || ''}(${
                            childRide.meetingLocation?.time || ''
                          })`
                        }}
                        <span class="ml-1">{{ childRide.comment || '' }}</span>
                      </v-list-item-subtitle>
                    </div>
                    <div class="list-item-actions">
                      <v-btn
                        size="small"
                        variant="text"
                        color="grey"
                        @click="deleteChildRide(childRide)"
                        :icon="ICONS.delete"
                      ></v-btn>
                      <v-btn
                        size="small"
                        variant="text"
                        color="success"
                        @click="openChildRideDialog(true, childRide, true)"
                        :icon="ICONS.edit"
                      ></v-btn>
                    </div>
                  </div>
                </v-list-item>
              </template>
            </template>

            <v-list-item v-else>
              <v-list-item-icon>
                <v-icon icon="mdi-information-off"></v-icon>
              </v-list-item-icon>
              <v-list-item-title
                >등록된 오전차량의 정보가 없습니다.</v-list-item-title
              >
            </v-list-item>

            <v-list-item>
              <v-btn
                block
                variant="outlined"
                @click="openChildRideDialog(false, {}, true)"
                :append-icon="ICONS.plus"
              >오전 차량 정보 추가</v-btn>
            </v-list-item>
          </v-list-group>
        </v-list>

        <!-- 4. 오후 차량 정보 섹션 -->
        <v-list>
          <v-list-group v-model="groups.pmRide" value="pmRide">
            <template #activator="{ props }">
              <v-list-item
                v-bind="props"
                :prepend-icon="ICONS.bus"
                :append-icon="ICONS.expand"
              ><v-list-item-title>오후 차량 정보</v-list-item-title>
              </v-list-item>
            </template>

            <template v-if="form.pmChildRideList?.length">
              <template
                v-for="(childRide, index) in form.pmChildRideList"
                :key="childRide.id || index"
              >
                <v-list-item>
                  <template v-slot:prepend>
                    <span class="list-icon-pm">오후</span>
                  </template>
                  <div class="input-group">
                    <div>
                      <v-list-item-title class="mb-1">
                        {{ formatRideTitle(childRide) }}
                        <small class="ml-1 text-grey">{{
                          formatRideSubtitle(childRide)
                        }}</small>
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{
                          `${childRide.meetingLocation?.name || ''}(${
                            childRide.meetingLocation?.time || ''
                          })`
                        }}
                        <span class="ml-1">{{ childRide.comment || '' }}</span>
                      </v-list-item-subtitle>
                    </div>
                    <div class="list-item-actions">
                      <v-btn
                        size="small"
                        variant="text"
                        color="grey"
                        @click="deleteChildRide(childRide)"
                        :icon="ICONS.delete"
                      ></v-btn>
                      <v-btn
                        size="small"
                        variant="text"
                        color="success"
                        @click="openChildRideDialog(true, childRide, false)"
                        :icon="ICONS.edit"
                      ></v-btn>
                    </div>
                  </div>
                </v-list-item>
              </template>
            </template>

            <v-list-item v-else>
              <v-list-item-icon>
                <v-icon icon="mdi-information-off"></v-icon>
              </v-list-item-icon>
              <v-list-item-title
                >등록된 오후차량의 정보가 없습니다.</v-list-item-title
              >
            </v-list-item>

            <v-list-item>
              <v-btn
                block
                variant="outlined"
                @click="openChildRideDialog(false, {}, false)"
                :append-icon="ICONS.plus"
              >오후 차량 정보 추가</v-btn>
            </v-list-item>
          </v-list-group>
        </v-list>
      </div>

      <!-- 하단 액션 버튼 -->
      <v-card-actions>
        <v-btn
          variant="flat"
          color="grey"
          size="large"
          @click="handleCancel"
        >닫기
        </v-btn>
        <v-btn
          variant="flat"
          color="error"
          size="large"
          @click="handleDeleteChild"
        >
          {{ `${form.name} 삭제` }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useClipboard } from '@vueuse/core' // ✅ 클립보드 유틸 (vue-clipboard3 대체)
import { useGlobal } from '@/composables/useGlobal'
import { deleteChild as deleteChildApi } from '@/api/api'
import type { Parent, ChildRide } from '@/types'
import { ICONS } from '@/constants/icon.ts' // 아이콘

const { $showMessage, $showError, $withLoading, $dialog, $confirm } =
  useGlobal()

/** API가 배열이 아닌 null/객체 등으로 줄 때 spread 오류 방지 */
function asArray<T>(v: unknown): T[] {
  if (v == null) return []
  if (Array.isArray(v)) return [...v] as T[]
  return []
}

// ✅ 플러그인 연동용 props (필수)
const props = defineProps({
  // 데이터 props
  id: { type: [String, Number], required: true },
  name: { type: String, default: '' },
  admissionDate: { type: String, default: '' },
  className: { type: String, default: '' },
  birthday: { type: String, default: '' },
  status: { type: String, default: '' },
  address: { type: Object, default: () => ({}) },
  parentList: { type: Array, default: () => [] },
  amChildRideList: { type: Array, default: () => [] },
  pmChildRideList: { type: Array, default: () => [] },

  // ✅ 플러그인 콜백 (필수)
  onClose: { type: Function, default: () => {} },
  onError: { type: Function, default: () => {} },

  // 옵션
  closable: { type: Boolean, default: true },
})

// ✅ 다이얼로그 상태
const dialogModel = ref<boolean>(true)
const isMobile = ref<boolean>(false)

// ✅ 폼 데이터 (반응형)
const form = ref<any>({
  id: props.id,
  name: props.name,
  admissionDate: props.admissionDate,
  className: props.className,
  birthday: props.birthday,
  status: props.status,
  address: props.address,
  parentList: asArray<Parent>(props.parentList),
  amChildRideList: asArray<ChildRide>(props.amChildRideList),
  pmChildRideList: asArray<ChildRide>(props.pmChildRideList),
})

// ✅ 리스트 그룹 열림 상태
const groups = ref({
  childInfo: true,
  parentInfo: true,
  amRide: true,
  pmRide: true,
})

// ✅ 클립보드 훅
const { copy, copied } = useClipboard()

// ✅ 계산된 속성: 전체 주소
const fullAddress = computed(() => {
  const addr = form.value.address || {}
  return `${addr.address || ''} ${addr.detailAddress || ''}`.trim()
})

// ✅ 모바일 감지
const checkIfMobile = () => {
  const ua = navigator.userAgent || navigator.vendor || (window as any).opera
  isMobile.value =
    /android/i.test(ua) ||
    (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream)
}

// ✅ 차량 정보 포맷팅 헬퍼
const formatRideTitle = (ride: any) => {
  const sunny = ride?.meetingLocation?.sunnyRide || {}
  const timeStr = sunny.time ? `(${sunny.time})` : ''
  return `${sunny.name || ''}${timeStr}`
}

const formatRideSubtitle = (ride: any) => {
  const sunny = ride?.meetingLocation?.sunnyRide || {}
  return `${sunny.time || ''} ${sunny.comment || ''}`.trim()
}

// ✅ 클립보드 복사
const copyToClipboard = async (text: string) => {
  try {
    await copy(text)
    // ✅ 성공 메시지 (글로벌 훅 사용)
    $showMessage?.({
      type: 'success',
      message: '전화번호를 클립보드에 저장했습니다.',
    })
    console.log('Copied:', text)
  } catch (e) {
    console.error('Clipboard error:', e)
  }
}

// ✅ 다이얼로그 닫기 (취소)
const handleCancel = () => {
  if (props.closable) {
    dialogModel.value = false
    props.onClose(null)
  }
}

// ✅ 원아 정보 수정 다이얼로그
const openChildDialog = async () => {
  try {
    // ✅ 동적 임포트 + 플러그인 호출
    const { default: ChildDialog } = await import(
      '@/components/dialog/ManageChildDialog.vue'
    )
    const result = await $dialog?.(ChildDialog, { ...form.value })

    if (result) {
      // $showMessage?.({ type: 'success', message: '수정이 완료되었습니다.' })

      // ✅ 폼 업데이트 (Vue 3: 직접 할당)
      Object.assign(form.value, {
        admissionDate: result.admissionDate,
        className: result.className,
        address: result.address,
        birthday: result.birthday,
        status: result.status,
        name: result.name,
      })
    }
  } catch (e) {
    console.error('ChildDialog error:', e)
    props.onError?.(e)
  }
}

// ✅ 보호자 정보 다이얼로그
const openParentsDialog = async (isEdit: boolean, item: any = {}) => {
  try {
    const { default: ParentsDialog } = await import(
      '@/components/dialog/ManageParentsDialog.vue'
    )

    const dialogProps = {
      ...item,
      isEdit,
      childId: form.value.id,
    }

    const result = await $dialog?.(ParentsDialog, dialogProps)

    if (result) {
      // $showMessage?.({
      //   type: 'success',
      //   message: isEdit ? '수정이 완료되었습니다.' : '추가가 완료되었습니다.'
      // })

      if (isEdit) {
        // ✅ 수정: 기존 아이템 교체
        const idx = form.value.parentList.findIndex(
          (p: Parent) => p.id === result.id
        )
        if (idx !== -1) {
          form.value.parentList[idx] = result
        }
      } else {
        // ✅ 추가: 배열에 푸시
        form.value.parentList.push(result)
      }
    }
  } catch (e) {
    console.error('ParentsDialog error:', e)
    props.onError?.(e)
  }
}

// ✅ 차량 정보 다이얼로그 (AM/PM 공용)
const openChildRideDialog = async (
  isEdit: boolean,
  item: any = {},
  isAm: boolean
) => {
  try {
    const { default: ChildRideDialog } = await import(
      '@/components/dialog/ManageChildRideDialog.vue'
    )

    const dialogProps = {
      ...item,
      isEdit,
      am: isAm,
      child: { id: form.value.id },
    }

    const result = await $dialog?.(ChildRideDialog, dialogProps)

    if (result) {
      // $showMessage?.({
      //   type: 'success',
      //   message: isEdit ? '수정이 완료되었습니다.' : '추가가 완료되었습니다.'
      // })

      const targetList = isAm
        ? form.value.amChildRideList
        : form.value.pmChildRideList

      if (isEdit) {
        // ✅ 수정
        const idx = targetList.findIndex((r: ChildRide) => r.id === result.id)
        if (idx !== -1) {
          targetList[idx] = result
        }
      } else {
        // ✅ 추가
        targetList.push(result)
      }
    }
  } catch (e) {
    console.error('ChildRideDialog error:', e)
    props.onError?.(e)
  }
}

// ✅ 보호자 삭제
const deleteParents = async (parent: Parent) => {
  try {
    const confirmed = await $confirm?.({
      message: `${parent.name}님의 정보를 정말 삭제하시겠습니까?`,
    })

    if (!confirmed) return

    // ✅ API 호출 (실제 구현 시 주석 해제)
    // const response = await deleteParentsApi(parent.id)
    // if (response?.code === '0') {
    //   $showMessage?.({ type: 'success', message: '성공적으로 삭제했습니다.' })

    // ✅ 배열에서 제거 (Vue 3: splice)
    const idx = form.value.parentList.findIndex(
      (p: Parent) => p.id === parent.id
    )
    if (idx !== -1) {
      form.value.parentList.splice(idx, 1)
    }
    // }
  } catch (e) {
    console.error('Delete parent error:', e)
    props.onError?.(e)
  }
}

// ✅ 차량 정보 삭제
const deleteChildRide = async (childRide: any) => {
  try {
    const rideName = childRide?.meetingLocation?.sunnyRide?.name || '이 차량'
    const confirmed = await $confirm?.({
      message: `${rideName}를 정말 삭제하시겠습니까?`,
    })

    if (!confirmed) return

    // ✅ API 호출 (실제 구현 시 주석 해제)
    // const response = await deleteChildRideApi(childRide.id)
    // if (response?.code === '0') {
    //   $showMessage?.({ type: 'success', message: '성공적으로 삭제했습니다.' })

    const isAm = childRide?.meetingLocation?.sunnyRide?.am
    const targetList = isAm
      ? form.value.amChildRideList
      : form.value.pmChildRideList

    // ✅ 배열에서 제거
    const idx = targetList.findIndex((r: ChildRide) => r.id === childRide.id)
    if (idx !== -1) {
      targetList.splice(idx, 1)
    }
    // }
  } catch (e) {
    console.error('Delete ride error:', e)
    props.onError?.(e)
  }
}

// ✅ 원아 삭제 (최상위)
const handleDeleteChild = async () => {
  try {
    const confirmed = await $confirm?.({
      message: `주의: ${form.value.name}을 정말 삭제하시겠습니까?`,
    })

    if (!confirmed) return

    const response =
      (await $withLoading?.(deleteChildApi(form.value.id))) ??
      (await deleteChildApi(form.value.id))

    if (response?.code === '0' || response?.code === 0) {
      $showMessage?.({ type: 'success', message: '성공적으로 삭제했습니다.' })
      props.onClose({ success: true, id: form.value.id })
    }
  } catch (e) {
    console.error('Delete child error:', e)
    props.onError?.(e)
  }
}

// ✅ 마운트 시 초기화
onMounted(() => {
  console.log('[ChildMoreInfo] Mounted with props:', {
    id: props.id,
    name: props.name,
    dialogModel: dialogModel.value,
  })

  checkIfMobile()

  // ✅ props 변경 시 form 동기화 (선택사항)
  watch(
    () => props.name,
    (newVal) => {
      form.value.name = newVal
    }
  )
  // ... 기타 필드 필요시 추가

  // ✅ ESC 키로 닫기
  if (props.closable) {
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancel()
      }
    }
    document.addEventListener('keydown', onKeydown)
    // ✅ cleanup: 언마운트 시 리스너 제거
    return () => {
      document.removeEventListener('keydown', onKeydown)
    }
  }
})
</script>

<style scoped>
/* 기존 스타일 유지 + Vuetify 3 호환 보정 */
._child-more-head {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  font-size: 1.25rem;
  font-weight: 500;
}

._list-half {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

._list-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

._list-icon-ko {
  background: #e3f2fd;
  color: #1976d2;
}
._list-icon-am {
  background: #e8f5e9;
  color: #388e3c;
}
._list-icon-pm {
  background: #fff3e0;
  color: #f57c00;
}

._list-title-with-sub {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

/* Vue 3 deep selector */
:deep(.v-list-group__items) {
  padding-left: 8px;
}

:deep(.v-list-item__prepend) {
  margin-inline-end: 12px;
}

/* 모바일 최적화 */
@media (max-width: 600px) {
  ._list-half {
    grid-template-columns: 1fr;
  }
}
</style>
