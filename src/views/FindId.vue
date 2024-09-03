<template>
  <v-main>
    <v-container>
      <!-- 나중에 쓸거야 <v-tabs v-model="tab" background-color="transparent" color="basil" grow >
        <v-tab v-for="item in items" :key="item.tab">
          {{ item.tab }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item v-for="item in items" :key="item.tab">
          <v-card flat>
            <v-card-text>
              <childRegistForm v-if="item.content === '/childRegistForm'" />
              <parentRegistForm v-if="item.content === '/parentRegistForm'" />
            </v-card-text>
          </v-card>
          <test></test>
        </v-tab-item>
      </v-tabs-items> -->
      <v-row class="justify-center">
        <v-col cols="12" sm="8" md="6">
          <h2 class="headline font-weight-bold text-center">
            아이디 / 비밀번호 찾기
          </h2>
          <v-card class="my-6 pa-6 rounded-xl">
            <v-form v-model="valid" @submit.prevent="FindId">
              <!-- 아이디 -->
              <v-text-field
                v-model="form.userId"
                label="아이디 입력"
                prepend-inner-icon="ri-user-5-fill"
                required
                outlined
                clearable
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
                depressed
                x-large
                class="my-4"
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
              ></v-text-field>
              <v-btn type="submit" block depressed x-large color="primary">
                비밀번호 변경하기
              </v-btn>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import { methods } from 'babel-plugin-transform-runtime/lib/definitions'

export default {
  name: 'FindId',
  components: {},

  data() {
    return {
      valid: true,
      form: {
        userId: '',
        userEmail: '',
        newPw: '',
        userId: '',
        userEmail: '',
        newPw: '',
      },
      wation: false,
      countdown: 3, // 이메일 인증코드 재전송 타임 예시
      methods: {
        // 로그인 폼 submit
        FindId() {
          // 로그인 폼 submit
        },
        sendEmailCode() {}, // 시간이 카운트다운되면 좋겠습니당..
        // sendEmailCode() {}, // 시간이 카운트다운되면 좋겠습니당..
      },
    }
  },
}
</script>
