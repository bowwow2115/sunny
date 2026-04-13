<template>
  <v-main>
    <v-container>
      <v-row class="justify-center">
        <v-col cols="12" sm="8" md="6">
          <h2 class="text-h4 font-weight-bold text-center mb-6">로그인</h2>

          <v-card class="pa-6 rounded-xl" elevation="2">
            <v-form ref="formRef" v-model="valid" @submit.prevent="login">
              <!-- 아이디 입력 -->
              <v-text-field
                v-model="form.userId"
                @keyup.enter="login"
                :rules="userIdRules"
                label="아이디 입력"
                prepend-inner-icon="ri-user-5-fill"
                required
                variant="outlined"
                clearable
                class="mb-4"
              ></v-text-field>

              <!-- 비밀번호 입력 -->
              <v-text-field
                v-model="form.password"
                @keyup.enter="login"
                :rules="userPwRules"
                type="password"
                label="비밀번호 입력"
                prepend-inner-icon="ri-lock-password-fill"
                required
                variant="outlined"
                clearable
                class="mb-2"
              ></v-text-field>
            </v-form>

            <!-- 하단 링크 영역 -->
            <v-row class="justify-space-between align-center my-4">
              <v-col cols="auto" class="pa-0">
                <v-checkbox
                  v-model="saveLogin"
                  id="saveLoginChk"
                  label="아이디 저장"
                  hide-details
                  density="compact"
                  class="mt-0"
                ></v-checkbox>
              </v-col>
              <v-col cols="auto" class="pa-0">
                <router-link
                  to="/FindId"
                  class="text-decoration-none text-grey-darken-2"
                >
                  아이디 / 비밀번호 찾기
                </router-link>
              </v-col>
            </v-row>

            <!-- 로그인 버튼 -->
            <v-btn
              type="submit"
              block
              size="x-large"
              color="primary"
              class="my-4"
              @click="login"
              variant="flat"
              :loading="loading"
            >
              로그인
            </v-btn>

            <!-- 회원가입 버튼 -->
            <v-btn
              block
              size="x-large"
              color="primary"
              :to="{ path: '/SignUp' }"
              variant="outlined"
            >
              회원가입
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import auth from '@/api/auth'
import Utils from '@/utils/utils'
import { useGlobal } from '@/composables/useGlobal' // 커스텀 훅

const router = useRouter()
const { $showError } = useGlobal()

// 상태 관리
const formRef = ref(null)
const valid = ref(false)
const loading = ref(false)
const saveLogin = ref(false)

const form = ref({
  userId: '',
  password: '',
})

// 검증 규칙
const userIdRules = [
  (v) => !!v || '아이디는 필수 항목입니다.',
  (v) =>
    /^[a-zA-Z0-9]+$/.test(v) || '아이디는 알파벳과 숫자만 포함할 수 있습니다.',
  (v) => (v && v.length >= 4) || '아이디는 최소 4자 이상이어야 합니다.',
]

const userPwRules = [
  (v) => !!v || '비밀번호는 필수 항목입니다.',
  (v) =>
    /^[a-zA-Z0-9]+$/.test(v) ||
    '비밀번호는 알파벳과 숫자만 포함할 수 있습니다.',
  (v) => (v && v.length >= 4) || '비밀번호는 최소 4자 이상이어야 합니다.',
  (v) => !v || v.length <= 10 || '비밀번호는 최대 10자 이하이어야 합니다.',
]

// 마운트 시 쿠키에서 아이디 복원
onMounted(() => {
  const savedUserId = Utils.getCookie?.('userId')
  if (savedUserId) {
    form.value.userId = savedUserId
    saveLogin.value = true
  }
})

// 로그인 핸들러
const login = async () => {
  // Vuetify 3 form validate
  if (formRef.value) {
    const { valid: formValid } = await formRef.value.validate()
    if (!formValid) return
  }

  loading.value = true

  try {
    await auth.login(form.value)

    // 아이디 저장 처리
    if (saveLogin.value) {
      Utils.setCookie?.('userId', form.value.userId, 3600 * 24 * 365, '/')
    } else {
      Utils.deleteCookie?.('userId')
    }

    // 라우팅
    const defaultHome = window.constants?.DEFAULT_HOME || '/'
    await router.push({ path: defaultHome })
  } catch (error) {
    console.error('Login error:', error)
    $showError?.(error) ||
      alert(error.message || '로그인 중 오류가 발생했습니다.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
:deep(.v-checkbox .v-label) {
  font-size: 0.875rem;
}
a:hover {
  text-decoration: underline !important;
}
</style>
