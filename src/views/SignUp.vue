<template>
  <v-main>
    <v-container>
      <v-row class="justify-center">
        <v-col cols="12" sm="8" md="6">
          <h2 class="headline font-weight-bold text-center">회원가입</h2>
          <v-card class="my-6 pa-6 rounded-xl">
            <v-form v-model="valid" @submit.prevent="join">
              <!-- 아이디 -->
              <div class="d-flex">
                <v-text-field
                  v-model="form.joinId"
                  label="아이디 입력"
                  prepend-inner-icon="ri-user-5-fill"
                  required
                  outlined
                  clearable
                  hide-details="auto"
                ></v-text-field>
                <v-btn
                  type="button"
                  @click="duplicateId"
                  depressed
                  outlined
                  class="text-body-1 label-with-btn ml-2"
                  >중복확인
                </v-btn>
              </div>
              <p class="mt-2 text-body-2 grey--text">
                <i class="ri-asterisk"></i>최소 4자이상 영문과 숫자로만 혼용
                가능합니다.(특수문자 불가)
              </p>
              <!-- 비밀번호 -->
              <v-text-field
                v-model="form.joinPw"
                type="password"
                label="비밀번호 입력"
                prepend-inner-icon="ri-lock-password-fill"
                required
                outlined
                clearable
                hide-details="auto"
              ></v-text-field>
              <p class="mt-2 text-body-2 grey--text">
                <i class="ri-asterisk"></i>최소 4자이상 최대 10자이하 영문과
                숫자로만 혼용 가능합니다.(특수문자 불가)
              </p>
              <!-- 이름 -->
              <v-text-field
                v-model="form.userName"
                label="이름"
                prepend-inner-icon="ri-user-smile-fill"
                required
                outlined
                clearable
              ></v-text-field>
              <!-- 전화번호 -->
              <v-text-field
                v-model="form.userPhoneNum"
                :rules="phoneRules"
                label="전화번호"
                prepend-inner-icon="ri-smartphone-line"
                required
                outlined
                clearable
                hide-details="auto"
              ></v-text-field>
              <p class="mt-2 text-body-2 grey--text">
                <i class="ri-asterisk"></i>하이픈(-)을 제외하고 숫자만
                입력하세요.
              </p>
              <!-- 이메일 : 선택사항으로 required 제외 -->
              <v-text-field
                v-model="form.userEmail"
                type="email"
                label="이메일주소(본인확인용 선택사항)"
                prepend-inner-icon="ri-mail-fill"
                outlined
                clearable
              ></v-text-field>
              <v-btn
                type="submit"
                block
                depressed
                outlined
                x-large
                color="primary"
              >
                회원가입 하기
              </v-btn>ㅞ
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
export default {
  name: 'SignUp',
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

      errorRules: [(v) => !!v || '필수 항목입니다'],
      phoneRules: [
        (v) => !!v || '필수 항목입니다', //숫자만 입력가능하게 해줭
      ],
      idpwHint: '* 영문, 숫자 혼용 6자리~10자리 이하 등록(특수문자 사용불가)',
      phoneHint: '하이픈(-)을 제외하고 숫자만 입력하세요.',
    }
  },
  methods: {
    //   duplicateId() {
    //     //아이디 중복확인
    //     const joinId = this.form.joinId
    //     if (joinId) {
    //       alert(`${joinId}는 사용할 수 있습니다.`)
    //   duplicateId() {
    //     //아이디 중복확인
    //     const joinId = this.form.joinId
    //     if (joinId) {
    //       alert(`${joinId}는 사용할 수 있습니다.`)
    //     } else {
    //       alert(`아이디를 입력하세요.`)
    //       alert(`아이디를 입력하세요.`)
    //     }
    //   },
    //   join() {
    //     //회원가입 폼 submit
    //   },
    // },
    //   join() {
    //     //회원가입 폼 submit
    //   },
    // },
    // }
    // },
  },
}
</script>
