<template>
  <!-- ✅ teleport="body" 로 오버레이 컨텍스트 보장 -->
  <v-dialog
    v-model="dialogModel"
    persistent
    max-width="720px"
    teleport="body"
    @click:outside="handleCancel"
  >
    <v-card class="pa-2">
      <v-card-title class="d-flex align-center justify-space-between">
        <span class="text-h6 font-weight-bold">원아정보 수정</span>
        <v-btn icon size="small" variant="text" @click="handleCancel">
          <v-icon icon="ri-close-line"></v-icon>
        </v-btn>
      </v-card-title>

      <v-form ref="formRef" v-model="isValid">
        <v-list class="pa-0 _list-half">
          <!-- 원아 이름 -->
          <v-list-item class="pl-0">
            <v-list-item-icon class="my-4 mx-3">
              <span class="_list-icon">이름</span>
            </v-list-item-icon>
            <!-- ✅ v-list-item-content 제거, title 직속 사용 -->
            <v-text-field
              v-model="form.name"
              label="원아의 이름을 입력해주세요."
              :rules="nameRules"
              variant="outlined"
              clearable
              clear-icon="ri-close-circle-fill"
            ></v-text-field>
          </v-list-item>

          <!-- 재원여부 -->
          <v-list-item class="pl-0">
            <v-list-item-icon class="my-4 mx-3">
              <span class="_list-icon">상태</span>
            </v-list-item-icon>
            <v-combobox
              v-model="form.status"
              :items="['재원', '졸업', '퇴소', '기타']"
              :rules="statusRules"
              label="원아의 재원여부를 입력해주세요."
              variant="outlined"
              clearable
              clear-icon="ri-close-circle-fill"
            ></v-combobox>
          </v-list-item>

          <!-- 반 -->
          <v-list-item class="pl-0">
            <v-list-item-icon class="my-4 mx-3">
              <span class="_list-icon">반</span>
            </v-list-item-icon>
            <v-select
              v-model="form.className"
              :items="classNameList"
              :rules="classNameRules"
              label="원아의 반을 입력해주세요."
              variant="outlined"
              clearable
              clear-icon="ri-close-circle-fill"
            ></v-select>
          </v-list-item>

          <!-- 입학일 (데이트 피커) -->
          <v-list-item class="pl-0">
            <v-list-item-icon class="my-4 mx-3">
              <span class="_list-icon">입학</span>
            </v-list-item-icon>
            <v-menu
              v-model="admissionDateMenu"
              :close-on-content-click="false"
              transition="scale-transition"
            >
              <template #activator="{ props: menuProps }">
                <v-text-field
                  v-model="form.admissionDate"
                  label="원아의 입학일을 입력해주세요."
                  :rules="datePicRules"
                  readonly
                  variant="outlined"
                  v-bind="menuProps"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.admissionDate"
                v-model:active-picker="activePicker"
                class="calendar"
                no-title
                min="2015-01-01"
                @update:model-value="admissionDateMenu = false"
              ></v-date-picker>
            </v-menu>
          </v-list-item>

          <!-- 생일 (데이트 피커) -->
          <v-list-item class="pl-0">
            <v-list-item-icon class="my-4 mx-3">
              <span class="_list-icon">생일</span>
            </v-list-item-icon>
            <v-menu
              v-model="birthdayMenu"
              :close-on-content-click="false"
              transition="scale-transition"
            >
              <template #activator="{ props: menuProps }">
                <v-text-field
                  v-model="form.birthday"
                  :rules="datePicRules"
                  label="원아의 생년월일을 입력해주세요."
                  readonly
                  variant="outlined"
                  v-bind="menuProps"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.birthday"
                v-model:active-picker="activePicker"
                class="calendar"
                no-title
                :max="maxDate"
                min="2015-01-01"
                @update:model-value="birthdayMenu = false"
              ></v-date-picker>
            </v-menu>
          </v-list-item>

          <!-- 주소 섹션 -->
          <v-list-item class="pl-0 _list-half-not">
            <v-list-item-icon class="my-4 mx-3">
              <span class="_list-icon">주소</span>
            </v-list-item-icon>
          </v-list-item>

          <!-- 우편번호 + 검색 -->
          <v-list-item class="pl-0">
            <v-row no-gutters class="w-100">
              <v-col cols="6">
                <v-text-field
                  v-model="form.address.zipCode"
                  label="우편번호"
                  readonly
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>
              </v-col>
              <v-col cols="6" class="pl-4">
                <v-btn
                  variant="outlined"
                  color="primary"
                  block
                  size="large"
                  @click="openPostcode"
                >
                  주소 검색
                </v-btn>
              </v-col>
            </v-row>
          </v-list-item>

          <!-- 주소 + 상세주소 -->
          <v-list-item class="_list-half-not">
            <v-row no-gutters class="w-100">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.address.address"
                  label="주소"
                  readonly
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="pl-0 pl-md-4">
                <v-text-field
                  v-model="form.address.detailAddress"
                  ref="detailAddressRef"
                  label="상세주소 입력"
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-list-item>
        </v-list>

        <!-- 주소 검색 다이얼로그 (중첩) -->
        <v-dialog v-model="postcodeDialog" max-width="600" teleport="body">
          <v-card>
            <v-card-title class="d-flex align-center justify-space-between">
              <span class="text-subtitle-1 font-weight-bold">주소 검색</span>
              <v-btn
                variant="outlined"
                size="small"
                @click="postcodeDialog = false"
              >
                닫기
              </v-btn>
            </v-card-title>
            <v-card-text>
              <div id="postcode" style="width: 100%; height: 500px"></div>
            </v-card-text>
          </v-card>
        </v-dialog>

        <!-- 하단 액션 -->
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
            수정
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { getClassList, updateChild } from '@/api/api'

// ✅ 플러그인 연동용 props
const props = defineProps({
  // 데이터 props
  id: { type: [String, Number], required: true },
  name: { type: String, default: '' },
  status: { type: String, default: '' },
  className: { type: String, default: '' },
  admissionDate: { type: String, default: '' },
  birthday: { type: String, default: '' },
  address: { type: Object, default: () => ({}) },

  // ✅ 플러그인 콜백 (필수)
  onClose: { type: Function, default: () => {} },
  onError: { type: Function, default: () => {} },
})

// ✅ 상태 관리
const dialogModel = ref(true)
const isValid = ref(false)
const loading = ref(false)
const formRef = ref(null)
const detailAddressRef = ref(null)

// ✅ 메뉴 상태
const admissionDateMenu = ref(false)
const birthdayMenu = ref(false)
const activePicker = ref('DATE')
const postcodeDialog = ref(false)

// ✅ 폼 데이터
const form = ref({
  id: props.id,
  name: props.name,
  status: props.status,
  className: props.className,
  admissionDate: props.admissionDate,
  birthday: props.birthday,
  address: { ...props.address },
})

// ✅ 반 목록
const classNameList = ref([])

// ✅ 검증 규칙
const nameRules = [
  (v) => !!v || '필수 항목입니다.',
  (v) => /^[가-힣ㄱ-ㅎㅏ-ㅣ]*$/.test(v) || '한글만 입력해 주세요.',
  (v) => !v || v.length <= 16 || '16자 이내로 입력해주세요.',
]

const statusRules = [
  (v) => !!v || '필수 항목입니다.',
  (v) => /^[가-힣ㄱ-ㅎㅏ-ㅣ]*$/.test(v) || '한글만 입력해 주세요.',
  (v) => !v || v.length <= 8 || '8자 이내로 입력해주세요.',
]

const datePicRules = [(v) => !!v || '날짜를 선택해 주세요.']
const classNameRules = [(v) => !!v || '반을 선택해 주세요.']

// ✅ 계산된 속성: 오늘 날짜 (max date for birthday)
const maxDate = computed(() => {
  const today = new Date()
  return today.toISOString().substr(0, 10)
})

// ✅ 날짜 포맷팅 헬퍼
const getDay = (date) => {
  const days = ['일', '월', '화', '수', '목', '금', '토']
  return days[new Date(date).getDay()]
}

const getMonth = (date) => {
  const months = [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ]
  return months[new Date(date).getMonth()]
}

const changeHeader = (date) => {
  const y = new Date(date).getFullYear()
  const m = new Date(date).getMonth() + 1
  return `${y}년 ${m}월`
}

// ✅ 반 목록 로딩
const fetchClassList = async () => {
  try {
    const response = await getClassList()
    if (response?.data) {
      classNameList.value = response.data.map((item) => item.name)
    }
  } catch (error) {
    console.error('Failed to load class list:', error)
    // $showError?.(error)
  }
}

// ✅ 다이얼로그 닫기 (취소)
const handleCancel = () => {
  dialogModel.value = false
  // ✅ 애니메이션 완료 후 콜백 호출
  setTimeout(() => {
    props.onClose(null)
  }, 150)
}

// ✅ 수정 확인
const handleConfirm = async () => {
  // ✅ Vuetify 3 폼 검증 (비동기)
  const { valid } = (await formRef.value?.validate?.()) || {
    valid: isValid.value,
  }

  if (!valid) {
    // $showMessage?.({ type: 'warning', message: '입력값을 확인해주세요.' })
    return
  }

  loading.value = true

  try {
    const response = await updateChild(form.value)

    if (response?.code === '0') {
      // $showMessage?.({ type: 'success', message: '수정이 완료되었습니다.' })
      dialogModel.value = false
      setTimeout(() => {
        props.onClose(response.data) // ✅ 수정된 데이터 반환
      }, 150)
    }
  } catch (error) {
    console.error('Update error:', error)
    props.onError?.(error)
  } finally {
    loading.value = false
  }
}

// ✅ Daum 주소 검색
const openPostcode = async () => {
  postcodeDialog.value = true

  // ✅ 다음 틱에서 DOM 렌더링 완료 후 초기화
  await nextTick()

  // ✅ Daum Postcode 스크립트 로딩 (전역에 이미 로드되어 있다고 가정)
  if (typeof window.daum?.Postcode === 'function') {
    new window.daum.Postcode({
      oncomplete: (data) => {
        let addr =
          data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress
        let extraAddr = ''

        if (data.userSelectedType === 'R') {
          if (data.bname && /[동|로|가]$/g.test(data.bname)) {
            extraAddr += data.bname
          }
          if (data.buildingName && data.apartment === 'Y') {
            extraAddr = extraAddr
              ? `${extraAddr}, ${data.buildingName}`
              : data.buildingName
          }
          if (extraAddr) extraAddr = ` (${extraAddr})`
        }

        // ✅ 폼 업데이트
        form.value.address = {
          ...form.value.address,
          zipCode: data.zonecode,
          address: addr,
          detailAddress: extraAddr,
        }

        postcodeDialog.value = false

        // ✅ 상세주소 필드에 포커스
        nextTick(() => {
          detailAddressRef.value?.focus?.()
        })
      },
      width: '100%',
      height: '100%',
    }).embed(document.getElementById('postcode'))
  } else {
    console.error('Daum Postcode script not loaded')
    // $showError?.({ message: '주소 검색 스크립트를 불러올 수 없습니다.' })
  }
}

// ✅ 마운트 시 초기화
onMounted(() => {
  fetchClassList()

  // ✅ ESC 키로 닫기
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
._list-half {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

._list-half-not {
  grid-column: 1 / -1;
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
  background: #e3f2fd;
  color: #1976d2;
}

/* Vue 3 deep selector */
:deep(.v-list-item__prepend) {
  margin-inline-end: 12px;
}

:deep(.v-date-picker) {
  width: 100%;
}

/* 모바일 대응 */
@media (max-width: 960px) {
  ._list-half {
    grid-template-columns: 1fr;
  }
}
</style>
