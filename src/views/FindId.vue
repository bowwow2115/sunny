<template>
  <v-main class="login">
    <v-container>
      <h2 class="page-title">아이디 / 비밀번호 찾기</h2>
      <v-card class="card-section">
        <v-form v-model="valid" @submit.prevent="FindId">
          <!-- 아이디 -->
          <v-text-field
            v-model="form.userId"
            label="아이디 입력"
            prepend-inner-icon="ri-user-5-fill"
            required
            outlined
            clearable
            hide-details="auto"
            class="mb-4"
          ></v-text-field>
          <!-- 이메일 -->
          <v-text-field
            v-model="form.userEmail"
            type="email"
            label="이메일주소(본인 확인용)"
            prepend-inner-icon="ri-mail-fill"
            outlined
            clearable
            hide-details="auto"
          ></v-text-field>
          <v-btn
            @click="sendEmailCode"
            :disabled="waiting"
            block
            size="large"
            variant="outlined"
            class="mb-10"
          >
            <span v-if="waiting">{{ countdown }} 초 후 재전송</span>
            <span v-else>인증코드 전송</span>
          </v-btn>
          <v-text-field
            v-model="form.newPw"
            type="password"
            label="새 비밀번호 입력"
            prepend-inner-icon="ri-lock-password-fill"
            required
            outlined
            clearable
            hide-details="auto"
          ></v-text-field>
          <v-btn type="submit" block size="x-large" color="primary">
            비밀번호 변경하기
          </v-btn>
        </v-form>
      </v-card>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface FindIdForm {
  userId: string
  userEmail: string
  newPw: string
}

const valid = ref<boolean>(true)
const form = ref<FindIdForm>({
  userId: '',
  userEmail: '',
  newPw: '',
})
const waiting = ref<boolean>(false)
const countdown = ref<number>(3) // 이메일 인증코드 재전송 타임 예시

// 로그인 폼 submit
const FindId = () => {
  // 로그인 폼 submit
}

const sendEmailCode = () => {} // 시간이 카운트다운되면 좋겠습니당..
</script>
