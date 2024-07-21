<template>
  <!-- fluid(100%) 없으면 자동 반응형 container 설정너비 -->
  <!-- <v-container fluid></v-container> -->
  <div>
    <!-- <h2 class="page-title">원아등록</h2> -->
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
                class="font-weight-bold btn label-with-btn"
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
            <v-col cols="12" md="2" class="text-right">
              <v-btn @click="addParentBox" icon color="primary" class="btn-add">
                <v-icon>ri-add-line</v-icon>
              </v-btn>
              <v-btn
                @click="removeParentBox(index)"
                v-if="form.parentList.length > 1"
                icon
                color="primary"
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
        <v-card-title
          >탑승차량 정보
          <v-spacer></v-spacer>
          <v-checkbox
            v-model="hasRide"
            @click="form.childRideList = []"
            label="차량 사용여부"
          ></v-checkbox>
        </v-card-title>
        <v-card-subtitle>
          <v-row align="center" justify="start">
            <v-col
              v-for="(childRide, i) in form.childRideList"
              :key="i"
              class="shrink"
            >
              <v-menu
                v-model="form.childRideList[i].menuOpen"
                bottom
                right
                transition="scale-transition"
                origin="top left"
              >
                <template v-slot:activator="{ on }">
                  <v-chip
                    close
                    v-on="on"
                    :dark="childRide.amPm == '오후'"
                    @click:close="form.childRideList.splice(i, 1)"
                  >
                    <v-icon left>{{
                      childRide.amPm == '오전'
                        ? 'mdi-white-balance-sunny'
                        : 'mdi-moon-waning-crescent'
                    }}</v-icon>
                    <!-- // `${childRide.rideName}, ${childRide.meetingLocation.name}, ${childRide.comment}` -->
                    {{ truncateString(childRide.meetingLocation.name, 18) }}
                  </v-chip>
                </template>

                <v-card width="300" dark>
                  <v-list>
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon>mdi-bus</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>{{
                          childRide.rideName
                        }}</v-list-item-title>
                        <v-list-item-subtitle>{{
                          childRide.amPm
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-btn
                          icon
                          @click="form.childRideList[i].menuOpen = false"
                        >
                          <v-icon>mdi-close-circle</v-icon>
                        </v-btn>
                      </v-list-item-action>
                    </v-list-item>
                  </v-list>
                  <v-list>
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon>mdi-map-marker</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>
                          {{ childRide.meetingLocation.name }}
                        </v-list-item-title>
                        <v-list-item-subtitle>{{
                          childRide.comment
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-menu>
            </v-col>
          </v-row>
        </v-card-subtitle>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <div class="pickup" v-if="hasRide">
                <v-select
                  v-model="amPm"
                  :items="['오전', '오후']"
                  label="시간대를 선택하세요"
                  outlined
                  :menu-props="{ offsetY: true }"
                ></v-select>
                <v-select
                  v-model="selectedRide"
                  :items="amPm == '오전' ? amRideNameList : pmRideNameList"
                  item-text="name"
                  return-object
                  :label="
                    (amPm == '오전' ? '등원' : '하원') + '코스를 선택해주세요'
                  "
                  outlined
                  :menu-props="{ offsetY: true }"
                ></v-select>
                <v-select
                  v-model="selectedMeetingLocation"
                  :items="selectedRide.meetingLocationList"
                  item-text="name"
                  return-object
                  :label="'승하차 장소를 선택해주세요'"
                  outlined
                  :menu-props="{ offsetY: true }"
                ></v-select>
                <v-text-field
                  v-model="childRideComment"
                  label="비고"
                  outlined
                  clearable
                >
                </v-text-field>
                <v-btn @click="pushChildRideList()">추가</v-btn>
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
      valid: false,
      birthdayWrap: false, //생년월일 필드와 picker를 묶는 역할
      addmisionDateWrap: false,
      activePicker: null,
      hasRide: false,
      amPm: '오전',
      selectedRide: { meetingLocationList: [] },
      selectedMeetingLocation: {},
      childRideComment: '',
      form: {
        id: '',
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
        childRideList: [
          // { comment: '', meetingLocation: { name: '', time: '' } },
        ],
        // amRide: { sunnyRide: { id: '', name: '' }, comment: '', time: '' },
        // pmRide: { sunnyRide: { id: '', name: '' }, comment: '', time: '' },
      },
      classNameList: [],
      birthday: '',
      // parentBoxes: [
      //   {
      //     relation: '',
      //     name: '',
      //     telephone: '',
      //   },
      // ],
      parentTypeList: ['부', '모', '조부', '조모', '그 외'],
      amRideNameList: [],
      pmRideNameList: [],
      numRules: [
        (v) => !!v || '필수 항목입니다.',
        (v) => /^\d+$/.test(v) || '하이픈(-) 없이 숫자만 입력해 주세요.',
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
      let param = this.form
      if (
        this.form.childRideList == null ||
        this.form.childRideList.length == 0
      )
        this.form.childRideList = null

      this.$withLoading(
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
      )
    },
    pushChildRideList() {
      if (
        this.selectedMeetingLocation.name == null ||
        this.selectedRide.name == null
      ) {
        this.$showMessage({
          type: 'warning',
          message: '차량코스와 승하차 장소를 선택해주세요',
        })
        return
      }
      let childRide = {}
      childRide.comment = this.childRideComment
      childRide.meetingLocation = this.selectedMeetingLocation
      childRide.rideName = this.selectedRide.name
      childRide.amPm = this.amPm
      childRide.menuOpen = false
      this.form.childRideList.push(childRide)
      //입력값 초기화
      this.childRideComment = ''
      this.selectedMeetingLocation = {}
      this.selectedRide = { meetingLocationList: [] }
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
              if (element.meetingLocationList != null)
                element.meetingLocationList.forEach((meetingLocation) => {
                  meetingLocation.name = `${meetingLocation.name}(${meetingLocation.time})`
                })
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
    truncateString(str, maxLength) {
      if (str.length <= maxLength) {
        return str
      }
      return str.slice(0, maxLength) + '...'
    },
  },
}
</script>

<style lang="scss" scoped></style>
