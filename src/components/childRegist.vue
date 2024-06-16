<template>
  <!-- fluid(100%) 없으면 자동 반응형 container 설정너비 -->
  <!-- <v-container fluid></v-container> -->
  <v-container>
    <v-card>
      <v-card-title>
        <h2>BASiL</h2>
      </v-card-title>
      <v-form v-model="valid">
        <v-container>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.childCode"
                :rules="nameRules"
                :counter="10"
                label="코드"
                required outlined clearable
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.name"
                :rules="nameRules"
                :counter="10"
                label="이름"
                required outlined clearable
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.className"
                :items="items"
                label="반명" outlined
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <!-- 생년월일 -->
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="form.birthdate"
                    label="생년월일"
                    append-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on" outlined
                  ></v-text-field><!-- v-bind="attrs" 및 v-on="on": 부모 요소(v-menu)에서 받은 속성과 이벤트를 v-text-field에 전달 -->
                </template>
                <v-date-picker
                  v-model="form.birthdate"
                  :active-picker.sync="activePicker"
                  :max="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substring(0, 10)"
                  min="1950-01-01"
                  no-title
                  locale="ko"
                  @input="menu = false"
                ></v-date-picker><!-- @input="menu = false" 날짜 입력시 menu 사라짐 -->
              </v-menu>
            </v-col>
          </v-row>
          <v-row>
            <v-col></v-col>
          </v-row>
        </v-container>
      </v-form>

      <!-- <v-tabs v-model="tab" background-color="transparent" color="basil" grow >
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

    </v-card>
  </v-container>
</template>

<script>
//import childRegistForm from './childRegistForm.vue';
export default {
  name: 'childRegist',
  components: {
    //childRegistForm, // childRegistForm 컴포넌트 등록
  },
  data () {
      return {
        // tab: null,
        // items: [
        //   { tab: '원아등록', content: '/childRegistForm' },
        //   { tab: '학부모등록', content: '/parentRegistForm' },
        // ],

        valid: true,
        menu: false, //생년월일 필드와 picker를 묶는 역할
        activePicker: null,

        form: {
          childCode: "",
          name: "",
          className: "",
          birthdate: null,
        },

        items: [], //셀렉트박스 옵션
        nameRules: [
          v => !!v || '필수 항목입니다',
          v => v.length <= 10 || 'Name must be less than 10 characters',
        ],
      }
    },
}
</script>

<style scoped></style>
