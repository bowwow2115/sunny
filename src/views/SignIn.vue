<template>
  <v-main>
    <v-container>
      <v-row class="justify-center">
        <v-col cols="12" sm="8" md="6">
          <h2 class="headline font-weight-bold text-center">로그인</h2>
          <v-card class="my-6 pa-6 rounded-xl">
            <v-form v-model="valid" @submit.prevent="login">
              <v-text-field
                v-model="form.userId"
                :rules="userIdRules"
                label="아이디 입력"
                prepend-inner-icon="ri-user-5-fill"
                required
                outlined
                clearable
              ></v-text-field>
              <v-text-field
                v-model="form.password"
                :rules="userPwRules"
                type="password"
                label="비밀번호 입력"
                prepend-inner-icon="ri-lock-password-fill"
                required
                outlined
                clearable
              ></v-text-field>
            </v-form>
            <v-row class="justify-space-between align-center my-4">
              <v-col class="text-left">
                <input
                  type="checkbox"
                  v-model="saveLogin"
                  class="custom-chkbox"
                  id="saveLoginChk"
                /><label for="saveLoginChk" style="width: fit-content"
                  ><v-icon class="ri-checkbox-circle-fill"></v-icon>아이디
                  저장</label
                >
              </v-col>
              <v-col class="text-right">
                <router-link to="/FindId" color="black"
                  >아이디 / 비밀번호 찾기</router-link
                >
              </v-col>
            </v-row>

            <v-btn
              type="submit"
              block
              depressed
              x-large
              color="primary"
              class="my-4"
              @click="login"
              >로그인</v-btn
            >
            <v-btn
              block
              depressed
              outlined
              x-large
              color="primary"
              class="darken-2"
              :to="{ path: '/SignUp' }"
            >
              회원가입
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
//import { required } from 'vuelidate/lib/validators';
import auth from '@/api/auth'
import Utils from '@/utils/utils'

export default {
  name: 'SignIn',
  components: {},
  mounted() {
    if (Utils.getCookie('userId')) {
      this.form.userId = Utils.getCookie('userId')
      this.saveLogin = true
    }
  },
  data() {
    return {
      valid: true,
      form: {
        userId: '',
        password: '',
      },
      saveLogin: false,
      userIdRules: [
        (v) => !!v || '아이디는 필수 항목입니다.',
        (v) =>
          /^[a-zA-Z0-9]+$/.test(v) ||
          '아이디는 알파벳과 숫자만 포함할 수 있습니다.',
        (v) => v.length >= 4 || '아이디는 최소 4자 이상이어야 합니다.',
      ],
      userPwRules: [
        (v) => !!v || '비밀번호는 필수 항목입니다.',
        (v) =>
          /^[a-zA-Z0-9]+$/.test(v) ||
          '비밀번호는 알파벳과 숫자만 포함할 수 있습니다.',
        (v) => v.length >= 4 || '비밀번호는 최소 4자 이상이어야 합니다.',
        (v) => v.length <= 10 || '비밀번호는 최대 10자 이하이어야 합니다.',
      ],
    }
  },
  methods: {
    login() {
      if (this.valid) {
        this.$withLoading(
          auth
            .login(this.form)
            .then(() => {
              if (this.saveLogin) {
                Utils.setCookie(
                  'userId',
                  this.form.userId,
                  3600 * 24 * 365,
                  '/'
                )
              } else {
                Utils.deleteCookie('userId')
              }
              this.$router.push({ path: constants.DEFAULT_HOME })
            })
            .catch((error) => {
              console.log(error)
              this.$showError(error)
            })
        )
      } else {
        this.$v.$touch() // 모든 폼 필드의 유효성 검사 실행
      }
    },
  },
}
</script>
