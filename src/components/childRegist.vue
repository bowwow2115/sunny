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
            label="원아코드"
            hide-details="auto"
            required
            outlined
            clearable
          ></v-text-field>
          <v-text-field
            v-model="form.name"
            label="원아이름"
            hide-details="auto"
            required
            outlined
            clearable
          ></v-text-field>
          <v-menu
            ref="menu"
            v-model="birthdayWrap"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            ><!-- 열려있는 동안 콘텐츠 클릭으로 메뉴 닫히지 않게 false -->
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="form.birthday"
                label="원아 생년월일"
                append-icon="mdi-calendar"
                hide-details="auto"
                readonly
                v-bind="attrs"
                v-on="on"
                outlined
              ></v-text-field
              ><!-- v-bind="attrs" 및 v-on="on": 부모 요소(v-menu)에서 받은 속성과 이벤트를 v-text-field에 전달 - 양방향 바인딩을 위해 v-model 명 동일해야 함 -->
            </template>
            <v-date-picker
              v-model="form.birthday"
              :active-picker.sync="activePicker"
              class="calendar"
              no-title
              :max="
                new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                  .toISOString()
                  .substr(0, 10)
              "
              min="2000-01-01"
              :weekday-format="getDay"
              :month-format="getMonth"
              :header-date-format="changeHeader"
              width="100%"
              @change="$refs.menu.save((birthdayWrap = false))"
            ></v-date-picker>
          </v-menu>
          <v-combobox
            v-model="form.className"
            :items="classNameList"
            label="반명"
            hide-details="auto"
            outlined
          ></v-combobox>
          <div class="address-wrap">
            <div class="input-btn-wrap">
              <v-text-field
                v-model="form.address.zipCode"
                label="우편번호"
                hide-details="auto"
                outlined
                readonly
              ></v-text-field>
              <v-btn type="button" depressed class="input-h"> 주소 검색 </v-btn>
            </div>
            <!-- 검색해서 선택한 우편번호 여기 입력됨 -->
            <v-text-field
              v-model="form.address.address"
              label="주소"
              hide-details="auto"
              outlined
              readonly
            ></v-text-field>
            <v-text-field
              v-model="form.address.detailAddress"
              label="상세주소 입력"
              hide-details="auto"
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
          <div
            class="parent-box"
            v-for="(parentBox, index) in form.parentList"
            :key="index"
          >
            <div class="layout">
              <v-combobox
                v-model="parentBox.relation"
                :items="parentTypeList"
                label="관계"
                hide-details="auto"
                outlined
              >
              </v-combobox>
              <v-text-field
                v-model="parentBox.name"
                label="학부모 이름"
                hide-details="auto"
                required
                outlined
                clearable
              ></v-text-field>
            </div>
            <v-text-field
              v-model="parentBox.telephone"
              label="연락처"
              required
              outlined
              clearable
            ></v-text-field>
            <v-btn @click="addParentBox" class="btn-pb">
              <v-icon>ri-add-line</v-icon>
            </v-btn>
            <v-btn
              @click="removeParentBox(index)"
              v-if="form.parentList.length > 1"
              class="btn-pb"
            >
              <v-icon>ri-subtract-line</v-icon>
            </v-btn>
          </div>
        </div>
      </div>
      <div class="area">
        <h3 class="area-title">탑승 차량 정보</h3>
        <div class="area-cont">
          <div class="pickup">
            <div class="input-type2">
              오전
              <v-combobox
                v-model="form.amRide.time"
                :items="amRideTimeList"
                label="승차 시간"
                outlined
              ></v-combobox>
            </div>
            <v-combobox
              v-model="form.amRide.name"
              :items="amRideNameList"
              label="오전 코스를 선택하세요"
              outlined
            ></v-combobox>
            <v-input> </v-input>
          </div>
          <div class="drop">
            <div class="input-type2">
              오후
              <v-combobox
                v-model="form.pmRide.time"
                :items="pmRideTimeList"
                label="하차 시간"
                outlined
              ></v-combobox>
            </div>
            <v-combobox
              v-model="form.pmRide.name"
              :items="pmRideNameList"
              label="코스를 선택하세요."
              outlined
            ></v-combobox>
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
      birthdayWrap: false, //생년월일 필드와 picker를 묶는 역할
      activePicker: null,
      form: {
        childCode: 'test',
        birthday: '',
        admissionDate: '2024-01-01',
        className: 'test',
        address: { detailAddress: 'test', zipCode: 'test', address: 'test' },
        status: true,
        parentList: [
          {
            relation: '',
            name: '',
            telephone: '',
          },
        ],
        amRide: { name: 'name', time: 'time', comment: 'comment' },
        pmRide: { name: 'name', time: 'time', comment: 'comment' },
        name: 'test',
      },
      classNameList: ['1반', '2반'],
      // parentBoxes: [
      //   {
      //     relation: '',
      //     name: '',
      //     telephone: '',
      //   },
      // ],
      parentTypeList: ['부', '모', '조부', '조모', '그 외'],
      amRideTimeList: ['11:00', ''],
      amRideNameList: ['알수없음', ''],
      pmRideTimeList: ['11:00', ''],
      pmRideNameList: ['알수없음', ''],
      // nameRules: [
      //   (v) => !!v || '필수 항목입니다',
      //   (v) => v.length <= 10 || 'Name must be less than 10 characters',
      // ],
    }
  },
  methods: {
    getDay(date) {
      const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토']
      let week = new Date(date).getDay(date)
      return daysOfWeek[week]
    },
    getMonth(date) {
      const monthName = [
        '1월',
        '2월',
        '3월',
        '4월',
        '5월',
        '6월',
        '7월',
        '8월',
        '9월',
        '10월',
        '11월',
        '12월',
      ]
      let month = new Date(date).getMonth(date)
      return monthName[month]
    },
    changeHeader(date) {
      const year = new Date(date).getFullYear()
      const month = new Date(date).getMonth() + 1
      return `${year}년 ${month}월`
    },
    addParentBox() {
      this.form.parentList.push({
        parentType: '',
        parent: '',
        parentPhone: '',
      })
    },
    removeParentBox(index) {
      if (this.form.parentList.length > 1) {
        this.form.parentList.splice(index, 1)
      }
    },
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
