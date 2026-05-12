<template>
  <v-main class="login">
    <v-container>
      <h2 class="page-title">로그인</h2>
      <v-card class="card-section">
        <v-form ref="formRef" v-model="valid" @submit.prevent="login">
          <!-- 아이디 입력 -->
          <v-text-field
            v-model="form.userId"
            @keyup.enter="login"
            :rules="userIdRules"
            label="아이디 입력"
            :prepend-inner-icon="ICONS.user"
            required
            variant="outlined"
            clearable
            hide-details="auto"
          ></v-text-field>

          <!-- 비밀번호 입력 -->
          <v-text-field
            v-model="form.password"
            @keyup.enter="login"
            :rules="userPwRules"
            type="password"
            label="비밀번호 입력"
            :prepend-inner-icon="ICONS.password"
            required
            variant="outlined"
            clearable
            hide-details="auto"
          ></v-text-field>
        </v-form>

        <!-- 하단 링크 영역 -->
        <div class="input-group">
          <v-checkbox
            v-model="saveLogin"
            id="saveLoginChk"
            label="아이디 저장"
            hide-details
          ></v-checkbox>
          <v-btn
            to="/FindId"
            variant="text"
            class="text-none text-medium-emphasis"
          >
            아이디 / 비밀번호 찾기
          </v-btn>
        </div>

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
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import auth from '@/api/auth'
import Utils from '@/utils/utils'
import { useGlobal } from '@/composables/useGlobal' // 커스텀 훅
import type { LoginForm } from '@/types'
import { ICONS } from '@/constants/icon.ts' // 아이콘

const router = useRouter()
const { $showError } = useGlobal()

// 상태 관리
const formRef = ref<any>(null)
const valid = ref<boolean>(false)
const loading = ref<boolean>(false)
const saveLogin = ref<boolean>(false)

const form = ref<LoginForm>({
  userId: '',
  password: '',
})

// 검증 규칙
const userIdRules = [
  (v: string) => !!v || '아이디는 필수 항목입니다.',
  (v: string) =>
    /^[a-zA-Z0-9]+$/.test(v) || '아이디는 알파벳과 숫자만 포함할 수 있습니다.',
  (v: string) => (v && v.length >= 4) || '아이디는 최소 4자 이상이어야 합니다.',
]

const userPwRules = [
  (v: string) => !!v || '비밀번호는 필수 항목입니다.',
  (v: string) =>
    /^[a-zA-Z0-9]+$/.test(v) ||
    '비밀번호는 알파벳과 숫자만 포함할 수 있습니다.',
  (v: string) =>
    (v && v.length >= 4) || '비밀번호는 최소 4자 이상이어야 합니다.',
  (v: string) =>
    !v || v.length <= 10 || '비밀번호는 최대 10자 이하이어야 합니다.',
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
    const defaultHome = (window as any).constants?.DEFAULT_HOME || '/'
    await router.push({ path: defaultHome })
  } catch (error: any) {
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
  font-size: 0.9rem;
}
</style>
