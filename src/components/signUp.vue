<template>
  <v-app>
    <v-main>
      <v-container>
        <div class="id-form">
          <h2 class="id-tit">회원가입</h2>
          <v-form v-model="valid" @submit.prevent="join">
            <!-- 아이디 -->
            <div class="input-caption">
              <div class="input-btn-wrap">
                <v-text-field
                  v-model="form.joinId"
                  label="아이디 입력"
                  prepend-inner-icon="ri-user-line"
                  required
                  outlined
                  clearable
                ></v-text-field>
                <v-btn type="button" @click="duplicateId" depressed>
                  중복확인
                </v-btn>
              </div>
              <p class="cap">
                <i class="ri-asterisk ricon"></i>
                영문, 숫자 혼용 6자리~10자리 이하 등록(특수문자 사용불가)
              </p>
            </div>
            <!-- 비밀번호 -->
            <div class="input-caption">
              <v-text-field
                v-model="form.joinPw"
                type="password"
                label="비밀번호 입력"
                prepend-inner-icon="ri-lock-line"
                required
                outlined
                clearable
              ></v-text-field>
              <p class="cap">
                <i class="ri-asterisk ricon"></i>
                영문, 숫자 혼용 6자리~10자리 이하 등록(특수문자 사용불가)
              </p>
            </div>
            <!-- 이름 -->
            <v-text-field
              v-model="form.userName"
              label="이름"
              prepend-inner-icon="ri-user-line"
              required
              outlined
              clearable
            ></v-text-field>
            <!-- 전화번호 -->
            <div class="input-caption">
              <v-text-field
                v-model="form.userPhoneNum"
                :rules="phoneRules"
                label="전화번호"
                prepend-inner-icon="ri-smartphone-line"
                required
                outlined
                clearable
              ></v-text-field>
              <p class="cap">
                <i class="ri-asterisk ricon"></i> 하이픈(-)을 제외하고 숫자만
                입력하세요.
              </p>
            </div>
            <!-- 이메일 : 선택사항으로 required 제외 -->
            <v-text-field
              v-model="form.userEmail"
              type="email"
              label="이메일주소(본인확인용 선택사항)"
              prepend-inner-icon="ri-mail-line"
              outlined
              clearable
            ></v-text-field>
            <v-btn
              type="submit"
              block
              depressed
              color="primary"
              class="btn-submit"
            >
              가입하기
            </v-btn>
          </v-form>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'signUp',
  components: {},
  components: {},

  data() {
    return {
      valid: true,
      form: {
        joinId: '',
        joinPw: '',
        userName: '',
        userPhoneNum: '',
        userEmail: '',
        joinId: '',
        joinPw: '',
        userName: '',
        userPhoneNum: '',
        userEmail: '',
      },
      // errorRules: [
      //   v => !!v || '필수 항목입니다',
      // ],
      phoneRules: [
        //v => !!v || '필수 항목입니다', //숫자만 입력가능하게 해줭
      ],
      //idpwHint: "* 영문, 숫자 혼용 6자리~10자리 이하 등록(특수문자 사용불가)",
      //phoneHint: "하이픈(-)을 제외하고 숫자만 입력하세요.",
      methods: {
        duplicateId() {
          //아이디 중복확인
          const joinId = this.form.joinId
          if (joinId) {
            alert(`${joinId}는 사용할 수 있습니다.`)
        duplicateId() {
          //아이디 중복확인
          const joinId = this.form.joinId
          if (joinId) {
            alert(`${joinId}는 사용할 수 있습니다.`)
          } else {
            alert(`아이디를 입력하세요.`)
            alert(`아이디를 입력하세요.`)
          }
        },
        join() {
          //회원가입 폼 submit
        },
      },
        join() {
          //회원가입 폼 submit
        },
      },
    }
  },
}
}
</script>
