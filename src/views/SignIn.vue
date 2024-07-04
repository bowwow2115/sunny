<template>
  <v-main>
    <v-container>
      <div class="id-form">
        <h2 class="id-tit">로그인</h2>
        <v-form v-model="valid" @submit.prevent="login">
          <!-- 유효성 검사 하려면 vuelidate 설치해야해 -->
          <!-- <ValidationProvider
              v-slot="{}"
              name="userId"
              rules="required|userId"
            >
              <v-text-field
                v-model="form.userId"
                label="아이디 입력"
                prepend-inner-icon="ri-user-line"
                required
                outlined
                clearable
              ></v-text-field>
            </ValidationProvider> -->
          <v-text-field
            v-model="form.userId"
            label="아이디 입력"
            prepend-inner-icon="ri-user-line"
            required
            outlined
            clearable
          ></v-text-field>
          <v-text-field
            v-model="form.password"
            type="password"
            label="비밀번호 입력"
            prepend-inner-icon="ri-lock-line"
            required
            outlined
            clearable
          ></v-text-field>
        </v-form>
        <v-checkbox
          v-model="form.saveLogin"
          label="로그인 상태유지"
        ></v-checkbox>
        <v-btn
          type="submit"
          block
          depressed
          color="primary"
          class="btn-submit"
          @click="login"
          >로그인</v-btn
        >
        <div class="login-more">
          <router-link to="/SignUp">회원가입</router-link>
          <span>|</span>
          <router-link to="/FindId">아이디/비밀번호 찾기</router-link>
        </div>
      </div>
    </v-container>
  </v-main>
</template>

<script>
//import { required } from 'vuelidate/lib/validators';
import auth from '@/api/auth'

export default {
  name: 'SignIn',
  components: {},
  data() {
    return {
      valid: true,
      form: {
        userId: '',
        password: '',
        saveLogin: false,
      },
    }
  },
  //  validations: {
  //    form: {
  //      userId: {
  //        required,
  //      },
  //    },
  //  },
  methods: {
    showError() {
      this.$emit('show-error', { code: 'test', message: 'testmsg' })
    },
    showAlert() {
      this.$emit('show-alert', { type: 'warning', message: 'test' })
    },
    showMessage() {
      this.$emit('show-message', { color: 'warning', message: 'test' })
    },
    login() {
      // 로그인 폼 제출
      // this.$v.$touch(); // 폼 유효성 검사 실행
      //  if (this.$v.$invalid) {
      // 폼이 유효하지 않으면 처리
      //    return;
      //  }
      auth
        .login(this.form)
        .then(() => {
          this.$router.push({ path: constants.DEFAULT_HOME })
        })
        .catch((error) => {
          console.log(error)
          this.showError(error)
        })
    },
  },
}
</script>
