<template>
  <!-- fluid(100%) 없으면 자동 반응형 container 설정너비 -->
  <!-- <v-container fluid></v-container> -->

  <div class="id-form">
    <h2 class="id-tit">원아등록</h2>
    <v-form v-model="valid">
      <!-- ---------- 원아 정보 ---------- -->
      <v-card>
        <v-card-title>원아정보</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.childCode"
                label="원아코드"
                required
                outlined
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.name"
                label="원아이름"
                required
                outlined
                clearable
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
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
                    new Date(
                      Date.now() - new Date().getTimezoneOffset() * 60000
                    )
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
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.className"
                :items="classNameList"
                label="반명"
                hide-details="auto"
                outlined
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="form.zipCode"
                label="우편번호"
                hide-details="auto"
                outlined
                readonly
              ></v-text-field>
            </v-col>
            <v-col>
              <v-btn type="button" depressed class="input-h"> 주소 검색 </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="form.address"
                label="주소"
                hide-details="auto"
                outlined
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="form.detailAddress"
                label="상세주소 입력"
                hide-details="auto"
                outlined
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- ---------- 학부모 정보 ---------- -->
      <v-card>
        <v-card-title>학부모 정보</v-card-title>
        <v-card-text>
          <v-row
            class="parent-box"
            v-for="(parentBox, index) in parentBoxes"
            :key="index"
          >
            <v-col cols="12" md="6">
              <v-row>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="parentBox.parenType"
                    :items="parentTypeList"
                    label="관계"
                    hide-details="auto"
                    outlined
                  >
                  </v-select>
                </v-col>
                <v-col cols="12" md="8">
                  <v-text-field
                    v-model="parentBox.parant"
                    label="학부모 이름"
                    hide-details="auto"
                    required
                    outlined
                    clearable
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="parentBox.parentPhone"
                label="연락처1"
                required
                outlined
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="2">
              <v-btn @click="addParentBox" class="btn-pb">
                <v-icon>ri-add-line</v-icon>
              </v-btn>
              <v-btn
                @click="removeParentBox(index)"
                v-if="parentBoxes.length > 1"
                class="btn-pb"
              >
                <v-icon>ri-subtract-line</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- ---------- 차량 정보 ---------- -->
      <v-card>
        <v-card-title>탑승 차량 정보</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="2">
              <v-subheader>오전</v-subheader>
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="form.amRide.time"
                :items="amRideTimeList"
                label="승차 시간"
                outlined
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.amRide.name"
                :items="amRideNameList"
                label="오전 코스를 선택하세요"
                outlined
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="2">
              <v-subheader>오후</v-subheader>
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="form.pmRide.time"
                :items="pmRideTimeList"
                label="하차 시간"
                outlined
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.pmRide.name"
                :items="pmRideNameList"
                label="코스를 선택하세요."
                outlined
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card-actions>
        <v-btn @click="addChild" color="primary">등록</v-btn>
      </v-card-actions>
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
        parentType: '',
        parentPhone: '',
        amRide: { name: 'name', time: 'time', comment: 'comment' },
        pmRide: { name: 'name', time: 'time', comment: 'comment' },
        name: 'test',
      },
      classNameList: ['1반', '2반'],
      parentBoxes: [
        {
          parentType: '',
          parent: '',
          parentPhone: '',
        },
      ],
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
      this.parentBoxes.push({
        parentType: '',
        parent: '',
        parentPhone: '',
      })
    },
    removeParentBox(index) {
      if (this.parentBoxes.length > 1) {
        this.parentBoxes.splice(index, 1)
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
