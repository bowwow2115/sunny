<template>
  <!-- fluid(100%) 없으면 자동 반응형 container 설정너비 -->
  <!-- <v-container fluid></v-container> -->
  <div class="id-form">
    <h2 class="id-tit">원아등록</h2>
    <v-form v-model="valid">
      <div class="area">
        <h3 class="area-title">원아 정보</h3>
        <div class="area-cont">
          <v-text-field
            v-model="form.childCode"
            :counter="10"
            label="원아코드"
            required
            outlined
            clearable
          ></v-text-field>
          <!-- :rules="nameRules" -->
          <v-text-field
            v-model="form.name"
            :counter="10"
            label="원아이름"
            required
            outlined
            clearable
          ></v-text-field>
          <!-- 생년월일 -->
          <v-menu
            ref="menu"
            v-model="birthdateWrap"
            :close-on-content-click="true"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="form.birthdate"
                label="원아 생년월일"
                append-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                outlined
              ></v-text-field
              ><!-- v-bind="attrs" 및 v-on="on": 부모 요소(v-menu)에서 받은 속성과 이벤트를 v-text-field에 전달 -->
            </template>
            <v-date-picker
              v-model="form.birthdate"
              :active-picker.sync="activePicker"
              :max="
                new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                  .toISOString()
                  .substring(0, 10)
              "
              min="2018-01-01"
              no-title
              locale="ko"
              @input="menu = false"
            ></v-date-picker
            ><!-- @input="menu = false" 날짜 입력시 menu 사라짐 -->
          </v-menu>
          <v-select
            v-model="form.className"
            :items="classNameList"
            label="반명"
            outlined
          ></v-select>
          <!-- 주소 -->
          <div class="address-wrap">
            <div class="input-btn-wrap">
              <v-text-field
                v-model="form.zipCode"
                label="우편번호"
                outlined
                readonly
              ></v-text-field>
              <v-btn type="button" depressed> 주소 검색 </v-btn>
            </div>
            <!-- 검색해서 선택한 우편번호 여기 입력됨 -->
            <v-text-field
              v-model="form.address"
              label="주소"
              outlined
              readonly
            ></v-text-field>
            <v-text-field
              v-model="form.detailAddress"
              label="상세주소 입력"
              outlined
              readonly
            ></v-text-field>
          </div>
        </div>
      </div>
      <div class="area">
        <!-- TODO: 버튼으로 학부모 추가 가능하게 수정(학부모 정보 입력 옆에 '+'버튼이 있게?) -->
        <h3 class="area-title">학부모 정보</h3>
        <div class="area-cont">
          <v-radio-group v-model="form.parentList" row>
            <v-radio label="부" value="부"></v-radio>
            <v-radio label="모" value="모"></v-radio>
            <v-radio label="조부" value="조부"></v-radio>
            <v-radio label="조모" value="조모"></v-radio>
            <v-radio label="그 외" value="그 외"></v-radio>
          </v-radio-group>
          <v-text-field
            v-model="form.parant"
            :counter="10"
            label="학부모 이름"
            required
            outlined
            clearable
          ></v-text-field>
          <v-text-field
            v-model="form.phoneNum1"
            label="연락처1"
            required
            outlined
            clearable
          ></v-text-field>
          <v-text-field
            v-model="form.phoneNum2"
            label="연락처2"
            required
            outlined
            clearable
          ></v-text-field>
        </div>
      </div>
      <div class="area">
        <div class="area-title">탑승 차량 정보</div>
        <div class="area-cont">
          <div class="pickup">
            <div class="input-type2">
              오전
              <v-select
                v-model="form.amRide.time"
                :items="amRideTimeList"
                label="승차 시간"
                outlined
              ></v-select>
            </div>
            <v-select
              v-model="form.amRide.name"
              :items="amRideNameList"
              label="오전 코스를 선택하세요"
              outlined
            ></v-select>
            <v-input> </v-input>
          </div>
          <div class="drop">
            <div class="input-type2">
              오후
              <v-select
                v-model="form.pmRide.time"
                :items="pmRideTimeList"
                label="하차 시간"
                outlined
              ></v-select>
            </div>
            <v-select
              v-model="form.pmRide.name"
              :items="pmRideNameList"
              label="코스를 선택하세요."
              outlined
            ></v-select>
          </div>
        </div>
      </div>
      <v-btn @click="addChild">등록</v-btn>
    </v-form>
  </div>
</template>

<script>
import { addChild } from '@/api/api'

export default {
  name: 'childRegist',
  components: {
    //childRegistForm, // childRegistForm 컴포넌트 등록
  },
  data() {
    return {
      items: [
        { tab: '원아등록', content: '/childRegistForm' },
        { tab: '학부모등록', content: '/parentRegistForm' },
      ],
      tab: null,
      valid: true,
      birthdateWrap: null, //생년월일 필드와 picker를 묶는 역할
      activePicker: null,
      form: {
        childCode: 'test',
        birthday: '2023-01-01',
        admissionDate: '2024-01-01',
        className: 'test',
        address: { detailAddress: 'test', zipCode: 'test', address: 'test' },
        status: true,
        amRide: { name: 'name', time: 'time', comment: 'comment' },
        pmRide: { name: 'name', time: 'time', comment: 'comment' },
        name: 'test',
      },
      amRideTimeList: ['11:00', ''],
      amRideNameList: ['알수없음', ''],
      pmRideTimeList: ['11:00', ''],
      pmRideNameList: ['알수없음', ''],
      classNameList: [],
      // nameRules: [
      //   (v) => !!v || '필수 항목입니다',
      //   (v) => v.length <= 10 || 'Name must be less than 10 characters',
      // ],
    }
  },
  methods: {
    addChild() {
      let param = this.form
      addChild(param)
        .then((response) => {
          if (response.code == '0') {
            console.log('성공')
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
  },
}
</script>

<style scoped></style>
