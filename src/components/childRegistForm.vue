<template>
  <v-container>1</v-container>
</template>

<script>
export default {
  name: 'childRegistForm',

  data: () => ({
    valid: false,
    name: '',
    nameRules: [
      (v) => !!v || '이름을 10자 이내로 입력해 주세요.',
      (v) => v.length <= 10 || 'Name must be less than 10 characters',
    ],
    email: '',
    emailRules: [
      (v) => !!v || 'E-mail is required',
      (v) => /.+@.+/.test(v) || 'E-mail must be valid',
    ],

    form: {
      birthdate: null,
      className: '',
      name: '',
    },
    menu: false, //생년월일 필드와 picker를 묶는 역할
    activePicker: null,
    items: [], //셀렉트박스 옵션
  }),

  mounted() {},

  methods: {},
}
</script>
