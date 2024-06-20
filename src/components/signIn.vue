<template>
  <v-container>
    <div class="id-form">
      <h2 class="id-tit">로그인</h2>
      <v-form v-model="valid" @submit.prevent="login">
        <!-- 아이디 -->
        <v-text-field
          v-model="form.userId"
          label="아이디 입력"
          prepend-inner-icon="ri-user-line"
          required
          outlined
          clearable
        ></v-text-field>
        <!-- 비밀번호 -->
        <v-text-field
          v-model="form.password"
          type="password"
          label="비밀번호 입력"
          prepend-inner-icon="ri-lock-line"
          required
          outlined
          clearable
        ></v-text-field>
        <v-checkbox
          v-model="form.saveLogin"
          label="로그인 상태유지"
        ></v-checkbox>
        <v-btn type="submit" block depressed color="primary" class="btn-submit"
          >로그인</v-btn
        >
        <div class="login-more">
          <router-link to="/signUp">회원가입</router-link>
          <span>|</span>
          <router-link to="/findId">아이디/비밀번호 찾기</router-link>
        </div>
      </v-form>
    </div>
  </v-container>
</template>

<script>
import { methods } from 'babel-plugin-transform-runtime/lib/definitions'
import auth from '@/api/auth'

export default {
  name: 'signIn',
  components: {},
  data() {
    return {
      valid: true,
      form: {
        userId: '',
        password: '',
        saveLogin: '',
      },
    }
  },
  methods: {
    login() {
      //로그인 폼 submit
      auth
        .login(this.form)
        .then((_) => {
          this.$router.push({ path: constants.DEFAULT_HOME })
        })
        .catch((error) => {
          console.log(error)
          // this.$message({
          //   type: "info",
          //   message: error.message,
          // });
        })
    },
  },
}
</script>
