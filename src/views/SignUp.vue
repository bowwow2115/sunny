<template>
  <v-main>
    <v-container>
      <v-row class="justify-center">
        <v-col cols="12" sm="8" md="6">
          <h2 class="text-h4 font-weight-bold text-center mb-6">회원가입</h2>

          <v-card class="pa-6 rounded-xl" elevation="2">
            <v-form
              ref="formRef"
              v-model="isValid"
              @submit.prevent="handleJoin"
            >
              <!-- 아이디 + 중복확인 -->
              <div class="d-flex align-start">
                <v-text-field
                  v-model="form.userId"
                  label="아이디 입력"
                  prepend-inner-icon="ri-user-5-fill"
                  :rules="userIdRules"
                  required
                  variant="outlined"
                  clearable
                  hide-details="auto"
                  density="comfortable"
                  class="flex-grow-1"
                ></v-text-field>
                <v-btn
                  type="button"
                  variant="outlined"
                  class="text-body-2 label-with-btn ms-3"
                  :loading="checkingId"
                  :disabled="!form.userId || checkingId"
                  @click="checkDuplicateId"
                >
                  중복확인
                </v-btn>
              </div>
              <p class="mt-2 text-body-2 text-grey">
                <i class="ri-asterisk text-error me-1"></i>
                최소 4자 이상 영문과 숫자만 사용 가능합니다. (특수문자 불가)
              </p>

              <!-- 비밀번호 -->
              <v-text-field
                v-model="form.password"
                type="password"
                label="비밀번호 입력"
                prepend-inner-icon="ri-lock-password-fill"
                :rules="passwordRules"
                required
                variant="outlined"
                clearable
                hide-details="auto"
                density="comfortable"
                class="mt-4"
              ></v-text-field>

              <v-text-field
                v-model="form.passwordCheck"
                type="password"
                label="비밀번호 확인"
                prepend-inner-icon="ri-lock-password-fill"
                :rules="passwordCheckRules"
                required
                variant="outlined"
                clearable
                hide-details="auto"
                density="comfortable"
              ></v-text-field>

              <p class="mt-2 text-body-2 text-grey">
                <i class="ri-asterisk text-error me-1"></i>
                4~10자 영문과 숫자만 사용 가능합니다. (특수문자 불가)
              </p>

              <!-- 이름 -->
              <v-text-field
                v-model="form.name"
                label="이름"
                prepend-inner-icon="ri-user-smile-fill"
                :rules="nameRules"
                required
                variant="outlined"
                clearable
                density="comfortable"
                class="mt-4"
              ></v-text-field>

              <!-- 전화번호 -->
              <v-text-field
                v-model="form.telephone"
                label="전화번호"
                prepend-inner-icon="ri-smartphone-line"
                :rules="phoneRules"
                required
                variant="outlined"
                clearable
                hide-details="auto"
                density="comfortable"
                maxlength="11"
                @input="formatPhoneInput"
              ></v-text-field>
              <p class="mt-2 text-body-2 text-grey">
                <i class="ri-asterisk text-error me-1"></i>
                하이픈(-) 제외 숫자만 입력하세요. (예: 01012345678)
              </p>

              <!-- 이메일 (선택) -->
              <v-text-field
                v-model="form.email"
                type="email"
                label="이메일주소 (본인확인용 선택사항)"
                prepend-inner-icon="ri-mail-fill"
                :rules="emailRules"
                variant="outlined"
                clearable
                density="comfortable"
                class="mt-4"
              ></v-text-field>

              <!-- 회원가입 버튼 -->
              <v-btn
                type="submit"
                block
                variant="flat"
                size="x-large"
                color="primary"
                class="mt-6"
                :loading="loading"
                :disabled="!isValid || idChecked !== true"
              >
                회원가입 하기
              </v-btn>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { addUser, checkDuplicateUserId } from '@/api/api'
import { useGlobal } from '@/composables/useGlobal'

const router = useRouter()
const { $showMessage, $showError, $withLoading } = useGlobal()

// ✅ 상태 관리
const formRef = ref<any>(null)
const isValid = ref<boolean>(false)
const loading = ref<boolean>(false)
const checkingId = ref<boolean>(false)
const idChecked = ref<boolean>(false) // 중복확인 완료 여부

// ✅ 폼 데이터
interface SignUpForm {
  userId: string
  password: string
  passwordCheck: string
  name: string
  telephone: string
  email: string
}

const form = ref<SignUpForm>({
  userId: '',
  password: '',
  passwordCheck: '',
  name: '',
  telephone: '',
  email: '',
})

// ✅ 검증 규칙
const userIdRules = [
  (v: string) => !!v || '아이디는 필수 항목입니다.',
  (v: string) => /^[a-zA-Z0-9]+$/.test(v) || '영문과 숫자만 사용 가능합니다.',
  (v: string) => (v && v.length >= 4) || '최소 4자 이상 입력해주세요.',
  (v: string) => (v && v.length <= 20) || '최대 20자 이하로 입력해주세요.',
]

const passwordRules = [
  (v: string) => !!v || '비밀번호는 필수 항목입니다.',
  (v: string) => /^[a-zA-Z0-9]+$/.test(v) || '영문과 숫자만 사용 가능합니다.',
  (v: string) => (v && v.length >= 4) || '최소 4자 이상 입력해주세요.',
  (v: string) => (v && v.length <= 10) || '최대 10자 이하로 입력해주세요.',
]

const passwordCheckRules = [
  (v: string) => !!v || '비밀번호 확인은 필수 항목입니다.',
  (v: string) =>
    (v && v === form.value.password) || '비밀번호가 일치하지 않습니다.',
]

const nameRules = [
  (v: string) => !!v || '이름은 필수 항목입니다.',
  (v: string) => /^[가-힣ㄱ-ㅎㅏ-ㅣ]+$/.test(v) || '한글만 입력 가능합니다.',
  (v: string) => (v && v.length <= 20) || '20자 이하로 입력해주세요.',
]

const phoneRules = [
  (v: string) => !!v || '전화번호는 필수 항목입니다.',
  (v: string) => /^\d{10,11}$/.test(v) || '올바른 전화번호 형식이 아닙니다.',
]

const emailRules = [
  (v: string) =>
    !v ||
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ||
    '올바른 이메일 형식이 아닙니다.',
]

// ✅ 전화번호 입력 포맷팅 (숫자만 허용)
const formatPhoneInput = () => {
  form.value.telephone = form.value.telephone
    .replace(/[^0-9]/g, '')
    .slice(0, 11)
}

// ✅ 아이디 중복확인
const checkDuplicateId = async () => {
  if (!form.value.userId) {
    $showMessage?.({ type: 'warning', message: '아이디를 입력해주세요.' })
    return
  }

  // ✅ 아이디 형식 검증
  if (!/^[a-zA-Z0-9]{4,20}$/.test(form.value.userId)) {
    $showMessage?.({
      type: 'warning',
      message: '아이디는 4~20자 영문/숫자만 사용 가능합니다.',
    })
    return
  }

  checkingId.value = true

  try {
    // ✅ 실제 API 호출 (예시)
    // const response = await checkDuplicateUserId(form.value.userId)
    // if (response?.code === '0' || response?.code === 0) {
    //   idChecked.value = true
    //   $showMessage?.({ type: 'success', message: '사용 가능한 아이디입니다.' })
    // }

    // ✅ 테스트용: 무조건 성공 (실제 구현 시 주석 해제)
    await new Promise((resolve) => setTimeout(resolve, 500))
    idChecked.value = true
    $showMessage?.({
      type: 'success',
      message: `'${form.value.userId}'는 사용 가능한 아이디입니다.`,
    })
  } catch (error: any) {
    console.error('Duplicate check error:', error)
    $showError?.(error)
    idChecked.value = false
  } finally {
    checkingId.value = false
  }
}

// ✅ 회원가입 실행
const handleJoin = async () => {
  // ✅ 폼 전체 검증
  const { valid } = (await formRef.value?.validate?.()) || {
    valid: isValid.value,
  }

  if (!valid) {
    $showMessage?.({ type: 'warning', message: '입력값을 확인해주세요.' })
    return
  }

  // ✅ 아이디 중복확인 필수
  if (!idChecked.value) {
    $showMessage?.({ type: 'warning', message: '아이디 중복확인을 해주세요.' })
    return
  }

  // ✅ 비밀번호 일치 재확인
  if (form.value.password !== form.value.passwordCheck) {
    $showMessage?.({ type: 'error', message: '비밀번호가 일치하지 않습니다.' })
    return
  }

  loading.value = true

  try {
    // ✅ 회원가입 데이터 준비 (passwordCheck 제외)
    const submitData = {
      userId: form.value.userId,
      password: form.value.password,
      name: form.value.name,
      telephone: form.value.telephone,
      email: form.value.email || null,
    }

    // ✅ API 호출
    const response: any = await ($withLoading?.(addUser(submitData)) ??
      addUser(submitData))

    if (response?.code === '0' || response?.code === 0) {
      $showMessage?.({ type: 'success', message: '회원가입이 완료되었습니다.' })

      // ✅ 로그인 페이지로 이동
      await router.push({ path: '/SignIn' })
    }
  } catch (error: any) {
    console.error('Signup error:', error)
    $showError?.(error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.label-with-btn {
  min-width: 80px;
  height: 40px;
}

/* Vue 3 deep selector */
:deep(.v-text-field .v-field__input) {
  min-height: 40px;
}

/* 모바일 대응 */
@media (max-width: 600px) {
  .d-flex {
    flex-direction: column;
  }

  .label-with-btn {
    width: 100%;
    margin-left: 0 !important;
    margin-top: 8px;
  }
}
</style>
