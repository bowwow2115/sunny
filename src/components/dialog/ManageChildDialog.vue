<template>
  <v-dialog v-model="visible" max-width="400px">
    <v-form v-model="isValid" ref="form">
      <v-card>
        <v-card-title color="primary" class="headline">{{
          '원아정보 수정'
        }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-text-field
              prepend-icon="mdi-account"
              v-model="form.name"
              label="원아의 이름을 입력해주세요."
              :rules="nameRules"
              clearable
            ></v-text-field>
          </v-row>
          <v-row>
            <v-combobox
              v-if="form.status == '기타' ? (form.status = '') : true"
              prepend-icon="mdi-account-arrow-up"
              v-model="form.status"
              :items="['재원', '졸업', '퇴소', '기타']"
              :rules="statusRules"
              label="원아의 재원여부를 입력해주세요."
              clearable
            ></v-combobox>
          </v-row>
          <v-row>
            <v-select
              prepend-icon="mdi-google-classroom"
              v-model="form.className"
              :items="classNameList"
              :rules="classNameRules"
              label="원아의 반을 입력해주세요."
              clearable
            ></v-select>
          </v-row>
          <!-- 입학일 -->
          <v-row>
            <v-menu
              ref="menu"
              v-model="admissionDateWrap"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              ><!-- 열려있는 동안 콘텐츠 클릭으로 메뉴 닫히지 않게 false -->
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="form.admissionDate"
                  label="원아의 입학일을 입력해주세요."
                  hide-details="auto"
                  prepend-icon="mdi-calendar-check"
                  :rules="datePicRules"
                  readonly
                  v-bind="attrs"
                  v-on="on"
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
                @change="$refs.menu.save((admissionDateWrap = false))"
              ></v-date-picker>
            </v-menu>
          </v-row>
          <!-- 생일 -->
          <v-row>
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
                  label="원아의 생년월일을 입력해주세요."
                  hide-details="auto"
                  prepend-icon="mdi-cake"
                  readonly
                  v-bind="attrs"
                  v-on="on"
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
                min="2015-01-01"
                :weekday-format="getDay"
                :month-format="getMonth"
                :header-date-format="changeHeader"
                width="100%"
                @change="$refs.menu.save((birthdayWrap = false))"
              ></v-date-picker>
            </v-menu>
          </v-row>
          <!-- 주소 -->
          <v-row>
            <v-col cols="8">
              <v-text-field
                v-model="form.address.zipCode"
                label="우편번호"
                hide-details="auto"
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="4" style="display: flex; align-items: end">
              <v-btn type="button" color="primary" @click="openPostcode">
                주소 검색
              </v-btn>
            </v-col>
          </v-row>

          <!-- 주소 검색 다이얼로그(모달창) -->
          <v-dialog v-model="postcodeDialog" max-width="600">
            <v-card>
              <v-card-title
                class="justify-space-between text-subtitle-1 font-weight-bold mb-2"
                >주소 검색
                <v-btn text @click="postcodeDialog = false" outlined small
                  >닫기</v-btn
                ></v-card-title
              >
              <!-- 주소 검색 팝업을 표시할 div -->
              <div id="postcode" style="width: 100%; height: 500px"></div>
            </v-card>
          </v-dialog>
          <v-text-field
            v-model="form.address.address"
            label="주소"
            hide-details="auto"
            readonly
          ></v-text-field>
          <v-text-field
            v-model="form.address.detailAddress"
            ref="detailAddress"
            label="상세주소 입력"
            hide-details="auto"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="accent" text @click="confirm">{{ '수정' }}</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="red lighten-2" text @click="cancel">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { getClassList, updateChild } from '@/api/api'
export default {
  mounted() {
    this.getClassList()
  },
  data() {
    return {
      visible: false,
      resolve: null,
      reject: null,
      birthdayWrap: false, // 생년월일 필드와 picker를 묶는 역할
      admissionDateWrap: false,
      postcodeDialog: false,
      activePicker: null,
      classNameList: [],
      form: {
        id: '',
        name: '',
        status: '',
        className: '',
        admissionDate: '',
        birthday: '',
        address: {},
      },
      parentTypeList: ['부', '모', '조부', '조모', '그 외'],
      numRules: [
        (v) => !!v || '필수 항목입니다.',
        (v) => /^\d+$/.test(v) || '하이픈(-) 없이 숫자만 입력해 주세요.',
        (v) => /^.{8,11}$/.test(v) || '8~11자 이내로 입력해주세요.',
      ],
      nameRules: [
        (v) => !!v || '필수 항목입니다.',
        (v) => /^[가-힣ㄱ-ㅎㅏ-ㅣ]*$/.test(v) || '한글만 입력해 주세요.', // 한글자모음 정규식 // 한글정규식 /^[가-힣]*$/
        (v) => /^.{0,16}$/.test(v) || '16자 이내로 입력해주세요.',
      ],
      statusRules: [
        (v) => !!v || '필수 항목입니다.',
        (v) => /^[가-힣ㄱ-ㅎㅏ-ㅣ]*$/.test(v) || '한글만 입력해 주세요.', // 한글자모음 정규식 // 한글정규식 /^[가-힣]*$/
        (v) => /^.{0,8}$/.test(v) || '8자 이내로 입력해주세요.',
      ],
      datePicRules: [(v) => !!v || '날짜를 선택해 주세요.'],
      classNameRules: [(v) => !!v || '반을 선택해 주세요.'],
    }
  },
  methods: {
    open(item) {
      this.isValid = false
      this.visible = true
      this.form.id = item.id
      this.form.name = item.name
      this.form.status = item.status
      this.form.className = item.className
      this.form.admissionDate = item.admissionDate
      this.form.birthday = item.birthday
      this.form.address = item.address
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    cancel() {
      this.visible = false
    },
    confirm() {
      if (this.$refs.form.validate()) {
        this.$withLoading(
          updateChild(this.form)
            .then((response) => {
              if (response.code == '0') {
                this.visible = false
                this.resolve(response.data)
              }
            })
            .catch((e) => {
              this.$showError(e)
            })
        )
      }
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
    truncateString(str, maxLength) {
      if (str.length <= maxLength) {
        return str
      }
      return str.slice(0, maxLength) + '...'
    },
    async openPostcode() {
      this.postcodeDialog = true

      // Daum 주소 검색 팝업 열기
      this.$nextTick(() => {
        new daum.Postcode({
          oncomplete: (data) => {
            // 주소 조합하기
            let addr = '' // 주소 변수
            let extraAddr = '' // 참고항목 변수

            // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져오기
            if (data.userSelectedType === 'R') {
              addr = data.roadAddress // 도로명 주소
            } else {
              addr = data.jibunAddress // 지번 주소
            }

            // 참고항목 조합하기
            if (data.userSelectedType === 'R') {
              // 법정동명이 있을 경우 추가 (법정리는 제외)
              // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
              if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                extraAddr += data.bname
              }
              // 건물명이 있고, 공동주택일 경우 추가
              if (data.buildingName !== '' && data.apartment === 'Y') {
                extraAddr +=
                  extraAddr !== ''
                    ? ', ' + data.buildingName
                    : data.buildingName
              }
              // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
              if (extraAddr !== '') {
                extraAddr = ' (' + extraAddr + ')'
              }
            }

            // 선택한 주소 정보를 form에 반영
            this.form.address.zipCode = data.zonecode // 우편번호
            this.form.address.address = addr // 주소
            this.form.address.detailAddress = extraAddr // 상세주소

            // 다이얼로그 닫기
            this.postcodeDialog = false

            // 상세주소 입력칸에 포커스
            this.$nextTick(() => {
              this.$refs.detailAddress.focus()
            })
          },
          width: '100%',
          height: '100%',
        }).embed(document.getElementById('postcode'))
      })
    },
  },
}
</script>

<style scoped>
/* 원하는 스타일 추가 */
</style>
