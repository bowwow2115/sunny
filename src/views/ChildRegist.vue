<template>
  <!-- fluid(100%) 없으면 자동 반응형 container 설정너비 -->
  <!-- <v-container fluid></v-container> -->
  <div>
    <h2 class="page-title">원아등록</h2>
    <v-form v-model="valid">
      <!-- ---------- 원아 정보 ---------- -->
      <v-card class="my-4 pa-2 rounded-xl">
        <v-card-title>원아정보</v-card-title>
        <v-card-subtitle>원아정보를 입력해 주세요.</v-card-subtitle>
        <v-card-text class="mt-6">
          <v-row>
            <v-col>
              <input
                type="checkbox"
                v-model="form.status"
                checked
                class="custom-chkbox"
                id="statusChk"
              /><label for="statusChk"
                ><v-icon class="ri-checkbox-circle-fill"></v-icon>재원 중이라면
                눌러주세요</label
              >
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="5">
              <v-text-field
                v-model="form.childCode"
                label="원아코드"
                :rules="numRules"
                hide-details="auto"
                required
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="7" class="ps-0">
              <v-text-field
                v-model="form.name"
                label="원아이름"
                :rules="nameRules"
                hide-details="auto"
                required
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-menu
                ref="menu"
                v-model="addmisionDateWrap"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                ><!-- 열려있는 동안 콘텐츠 클릭으로 메뉴 닫히지 않게 false -->
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="form.admissionDate"
                    label="원아 입학일"
                    hide-details="auto"
                    append-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    outlined
                  ></v-text-field
                  ><!-- v-bind="attrs" 및 v-on="on": 부모 요소(v-menu)에서 받은 속성과 이벤트를 v-text-field에 전달 - 양방향 바인딩을 위해 v-model 명 동일해야 함 -->
                </template>
                <v-date-picker
                  v-model="form.admissionDate"
                  :active-picker.sync="activePicker"
                  class="calendar"
                  no-title
                  min="2015-01-01"
                  :weekday-format="getDay"
                  :month-format="getMonth"
                  :header-date-format="changeHeader"
                  width="100%"
                  @change="$refs.menu.save((addmisionDateWrap = false))"
                ></v-date-picker>
              </v-menu>
            </v-col>
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
                    :rules="datePicRules"
                    label="원아 생년월일"
                    hide-details="auto"
                    append-icon="mdi-calendar"
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
                  min="2015-01-01"
                  :weekday-format="getDay"
                  :month-format="getMonth"
                  :header-date-format="changeHeader"
                  width="100%"
                  @change="$refs.menu.save((birthdayWrap = false))"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-select
                v-model="form.className"
                :items="classNameList"
                :rules="classNameRules"
                label="반명"
                hide-details="auto"
                outlined
                :menu-props="{ offsetY: true }"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="8">
              <v-text-field
                v-model="form.address.zipCode"
                label="우편번호"
                hide-details="auto"
                outlined
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="4" class="ps-0">
              <v-btn
                type="button"
                color="primary"
                class="btn label-with-btn"
                depressed
                block
              >
                주소 검색
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.address.address"
                label="주소"
                hide-details="auto"
                outlined
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.address.detailAddress"
                label="상세주소 입력"
                hide-details="auto"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- ---------- 학부모 정보 ---------- -->
      <v-card class="my-4 pa-2 rounded-xl">
        <v-card-title>학부모 정보</v-card-title>
        <v-card-subtitle
          >학부모 정보는 버튼을 이용하여 추가할 수 있습니다.</v-card-subtitle
        >
        <v-card-text class="mt-6">
          <v-row
            class="parent-box"
            v-for="(parentBox, index) in form.parentList"
            :key="index"
          >
            <v-col cols="12" md="6">
              <v-row>
                <v-col cols="5">
                  <v-select
                    v-model="parentBox.relation"
                    :items="parentTypeList"
                    :rules="pbRelationRules"
                    label="관계"
                    hide-details="auto"
                    outlined
                    :menu-props="{ offsetY: true }"
                  ></v-select>
                </v-col>
                <v-col cols="7" class="ps-0">
                  <v-text-field
                    v-model="parentBox.name"
                    :rules="nameRules"
                    label="학부모 이름"
                    hide-details="auto"
                    required
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="parentBox.telephone"
                :rules="numRules"
                label="연락처"
                hide-details="auto"
                required
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="2">
              <v-btn @click="addParentBox" class="btn-add">
                <v-icon>ri-add-line</v-icon>
              </v-btn>
              <v-btn
                @click="removeParentBox(index)"
                v-if="form.parentList.length > 1"
                class="btn-add"
              >
                <v-icon>ri-subtract-line</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- ---------- 탑승차량 정보 ---------- -->
      <v-card class="my-4 pa-2 rounded-xl">
        <v-card-title>탑승차량 정보</v-card-title>
        <v-card-subtitle>라라라</v-card-subtitle>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-checkbox
                v-model="hasAmRide"
                label="오전차량 사용여부"
              ></v-checkbox>
              <div class="pickup" v-if="hasAmRide">
                <v-subheader>오전</v-subheader>
                <v-select
                  v-model="form.amRide.sunnyRide.id"
                  :items="amRideNameList"
                  item-text="name"
                  item-value="id"
                  label="코스를 선택하세요"
                  outlined
                  :menu-props="{ offsetY: true }"
                ></v-select>
                <v-select
                  v-model="form.amRide.time"
                  :items="amRideTimeList"
                  label="승차 시간"
                  outlined
                  :menu-props="{ offsetY: true }"
                ></v-select>
                <v-text-field
                  v-model="form.amRide.comment"
                  label="비고"
                  outlined
                  clearable
                >
                </v-text-field>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <v-checkbox
                v-model="hasPmRide"
                label="오후차량 사용여부"
              ></v-checkbox>
              <div class="pickup" v-if="hasPmRide">
                <v-subheader>오후</v-subheader>
                <v-select
                  v-model="form.pmRide.sunnyRide.id"
                  :items="pmRideNameList"
                  label="코스를 선택하세요."
                  item-text="name"
                  item-value="id"
                  outlined
                  :menu-props="{ offsetY: true }"
                ></v-select>
                <v-select
                  v-model="form.pmRide.time"
                  :items="pmRideTimeList"
                  label="하차 시간"
                  outlined
                  :menu-props="{ offsetY: true }"
                ></v-select>
                <v-text-field
                  v-model="form.pmRide.comment"
                  label="비고"
                  outlined
                  clearable
                >
                </v-text-field>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-row class="justify-center">
        <v-col cols="12" md="6">
          <v-btn @click="addChild" depressed block x-large class="btn btn-main"
            >등록</v-btn
          >
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import { addChild, getClassList, getRideList } from '@/api/api'

export default {
  name: 'ChildRegist',
  components: {
    //ChildRegistForm, // ChildRegistForm 컴포넌트 등록
  },
  mounted() {
    this.init()
  },
  data() {
    return {
      items: [
        { tab: '원아등록', content: '/ChildRegistForm' },
        { tab: '학부모등록', content: '/parentRegistForm' },
      ],
      tab: null,
      valid: true,
      birthdayWrap: false, //생년월일 필드와 picker를 묶는 역할
      addmisionDateWrap: false,
      activePicker: null,
      hasAmRide: false,
      hasPmRide: false,
      form: {
        id: '',
        childCode: '',
        birthday: '',
        admissionDate: `${moment().format('YYYY-MM-DD')}`,
        className: '',
        address: { detailAddress: '', zipCode: '', address: '' },
        status: true,
        parentList: [
          {
            relation: '',
            name: '',
            telephone: '',
          },
        ],
        amRide: { sunnyRide: { id: '', name: '' }, comment: '', time: '' },
        pmRide: { sunnyRide: { id: '', name: '' }, comment: '', time: '' },
      },
      classNameList: ['1반', '2반'],
      birthday: '',
      // parentBoxes: [
      //   {
      //     relation: '',
      //     name: '',
      //     telephone: '',
      //   },
      // ],
      parentTypeList: ['부', '모', '조부', '조모', '그 외'],
      amRideTimeList: Utils.getTimeIntervals('07:00', '10:00'),
      amRideNameList: [],
      pmRideTimeList: Utils.getTimeIntervals('15:00', '19:00'),
      pmRideNameList: [],
      numRules: [
        (v) => !!v || '필수 항목입니다.',
        (v) => /^\d+$/.test(v) || '숫자만 입력해 주세요.',
      ],
      nameRules: [
        (v) => !!v || '필수 항목입니다.',
        (v) => /^[가-힣ㄱ-ㅎㅏ-ㅣ]*$/.test(v) || '한글만 입력해 주세요.', // 한글자모음 정규식 // 한글정규식 /^[가-힣]*$/
      ],
      datePicRules: [(v) => !!v || '날짜를 선택해 주세요.'],
      classNameRules: [(v) => !!v || '반을 선택해 주세요.'],
      pbRelationRules: [(v) => !!v || '관계를 선택해 주세요.'],
    }
  },
  methods: {
    init() {
      this.getClassList()
      this.getRideList()
    },
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
      if (!this.hasAmRide) this.form.amRide = null
      if (!this.hasPmRide) this.form.pmRide = null
      let param = this.form
      addChild(param)
        .then((response) => {
          if (response.code == '0') {
            this.$showMessage({
              type: 'success',
              message: '원아 등록이 성공적으로 완료되었습니다.',
            })
            //TODO: 화면이동 or 인풋값 초기화
          }
        })
        .catch((e) => {
          this.$showError(e)
        })
    },
    getClassList() {
      getClassList()
        .then((response) => {
          if (response.data != null) {
            let array = []
            response.data.forEach((element) => {
              array.push(element.name)
            })
            this.classNameList = array
          }
        })
        .catch((error) => {
          console.log(error)
          this.$showError(error)
        })
    },
    getRideList() {
      getRideList()
        .then((response) => {
          if (response.data != null) {
            response.data.forEach((element) => {
              if (element.am) this.amRideNameList.push(element)
              else this.pmRideNameList.push(element)
            })
          }
        })
        .catch((error) => {
          console.log(error)
          this.$showError(error)
        })
    },
  },
}
</script>

<style lang="scss" scoped></style>
