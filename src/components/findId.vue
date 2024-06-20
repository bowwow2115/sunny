<template>
  <v-container>
    <div class="id-form">
      <h2 class="id-tit">아이디/비밀번호 찾기</h2>
      <v-form v-model="valid" @submit.prevent="findId">
        <!-- 아이디 -->
        <v-text-field
          v-model="form.userId"
          label="아이디 입력"
          prepend-inner-icon="ri-user-line"
          required
          outlined
          clearable
        ></v-text-field>
        <!-- 이메일 -->
        <v-text-field
          v-model="form.userEmail"
          type="email"
          label="이메일주소(본인 확인용)"
          prepend-inner-icon="ri-mail-line"
          outlined
          clearable
        ></v-text-field>
        <v-btn
          @click="sendEmailCode"
          :disabled="waiting"
          block
          depressed
          class="send-code-btn"
        >
          <span v-if="waiting">{{ countdown }} 초 후 재전송</span>
          <span v-else>인증코드 전송</span>
        </v-btn>
        <div class="after-check">
          <div class="input-caption">
            <v-text-field
              v-model="form.newPw"
              type="password"
              label="새 비밀번호 입력"
              prepend-inner-icon="ri-lock-line"
              required
              outlined
              clearable
            ></v-text-field>
            <p class="cap">
              <i class="ri-asterisk ricon"></i> 영문, 숫자 혼용 6자리~10자리
              이하 등록(특수문자 사용불가)
            </p>
          </div>
        </div>
        <v-btn type="submit" block depressed color="primary" class="btn-submit"
          >비밀번호 변경하기</v-btn
        >
      </v-form>
    </div>
  </v-container>
</template>

<script>
import { methods } from 'babel-plugin-transform-runtime/lib/definitions'

export default {
  name: 'findId',
  components: {},

  data() {
    return {
      valid: true,
      form: {
        userId: '',
        userEmail: '',
        newPw: '',
      },
      wation: false,
      countdown: 3, // 이메일 인증코드 재전송 타임 예시
      methods: {
        findId() {
          // 로그인 폼 submit
        },
        sendEmailCode() {}, // 시간이 카운트다운되면 좋겠습니당..
      },
    }
  },
}
</script>
