<template>
  <!-- fluid(100%) 없으면 자동 반응형 container 설정너비 -->
  <!-- <v-container fluid></v-container> -->
  <v-form v-model="isValid" ref="formRef">
    <!-- ---------- 원아 정보 ---------- -->
    <v-card class="my-4 pa-2 rounded-xl">
      <div class="d-flex justify-space-between align-center flex-wrap">
        <div>
          <v-card-title class="_card-title">원아정보</v-card-title>
          <v-card-subtitle>원아정보를 입력해 주세요.</v-card-subtitle>
        </div>
        <div class="_btn-grp px-6">
          <v-btn
            type="button"
            text
            class="_excel-download"
            href="/sunny/app/file/sunny_regist_children.xlsx"
            >양식 다운로드</v-btn
          >
          <v-btn
            type="button"
            text
            class="_excel-upload"
            @click="openUploadChildDialog"
            >원아 엑셀 등록</v-btn
          >
        </div>
      </div>
      <v-card-text class="pt-6">
        <v-row>
          <v-col cols="6" md="3">
            <v-combobox
              v-if="form.status == '기타' ? (form.status = '') : true"
              v-model="form.status"
              :items="['재원', '졸업', '퇴소', '기타']"
              :rules="statusRules"
              label="재원여부"
              hide-details="auto"
              outlined
              :menu-props="{ offsetY: true }"
            ></v-combobox>
          </v-col>
          <v-col cols="6" md="3">
            <v-text-field
              v-model="form.name"
              label="원아이름"
              :rules="nameRules"
              hide-details="auto"
              required
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="8" md="4">
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
          <v-col cols="4" md="2">
            <v-btn
              type="button"
              class="text-body-1 font-weight-bold label-with-btn"
              color="primary"
              outlined
              block
              @click="checkChild"
            >
              중복 검색
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="6">
            <v-menu
              ref="menuRef"
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
                  append-icon="ri-calendar-2-fill"
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
                @change="menuRef?.save((addmisionDateWrap = false))"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" sm="6">
            <v-menu
              ref="menuRef"
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
                  append-icon="ri-calendar-2-fill"
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
                min="2015-01-01"
                :weekday-format="getDay"
                :month-format="getMonth"
                :header-date-format="changeHeader"
                width="100%"
                @change="menuRef?.save((birthdayWrap = false))"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="8" md="4">
            <v-text-field
              v-model="form.address.zipCode"
              label="우편번호"
              hide-details="auto"
              outlined
              readonly
            ></v-text-field>
          </v-col>
          <v-col cols="4" md="2">
            <v-btn
              type="button"
              class="text-body-1 font-weight-bold label-with-btn"
              color="primary"
              outlined
              block
              @click="openPostcode"
            >
              주소 검색
            </v-btn>

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
              ref="detailAddressRef"
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
      <v-card-title class="_card-title">학부모 정보</v-card-title>
      <v-card-subtitle
        >학부모 정보는 버튼을 이용하여 추가할 수 있습니다.</v-card-subtitle
      >
      <v-card-text class="pt-6">
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
              <v-col cols="7">
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
          <v-col cols="10" md="5">
            <v-text-field
              v-model="parentBox.telephone"
              :rules="numRules"
              label="연락처"
              hide-details="auto"
              required
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="2" md="1" class="text-right pa-2">
            <v-btn @click="addParentBox" icon color="primary">
              <v-icon>ri-add-line</v-icon>
            </v-btn>
            <v-btn
              @click="removeParentBox(index)"
              v-if="form.parentList.length > 1"
              icon
              color="error"
            >
              <v-icon>ri-subtract-line</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- ---------- 탑승차량 정보 ---------- -->
    <v-card class="my-4 pa-2 rounded-xl">
      <v-card-title class="_card-title">탑승차량 정보 </v-card-title>
      <v-card-subtitle
        >차량 사용 시 사용여부를 체크한 후 입력해주세요.
      </v-card-subtitle>
      <v-card-text class="pt-6">
        <v-row>
          <v-col>
            <input
              type="checkbox"
              v-model="hasRide"
              @click="form.childRideList = []"
              class="custom-chkbox"
              id="hasRideChk"
            /><label for="hasRideChk"
              ><v-icon class="ri-checkbox-circle-fill"></v-icon>차량 사용
              여부</label
            >
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <div class="pickup" v-if="hasRide">
              <v-row>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="amPm"
                    :items="['오전', '오후']"
                    label="시간대를 선택하세요"
                    outlined
                    :menu-props="{ offsetY: true }"
                    hide-details="auto"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="6">
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
                    hide-details="auto"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="selectedMeetingLocation"
                    :items="selectedRide.meetingLocationList"
                    item-text="name"
                    return-object
                    :label="'승하차 장소를 선택해주세요'"
                    outlined
                    :menu-props="{ offsetY: true }"
                    hide-details="auto"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="8" md="4">
                  <v-text-field
                    v-model="childRideComment"
                    label="비고"
                    outlined
                    clearable
                    clear-icon="ri-close-circle-fill"
                    hide-details="auto"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="2">
                  <v-btn
                    @click="pushChildRideList()"
                    type="button"
                    color="primary"
                    outlined
                    block
                    class="text-body-1 font-weight-bold label-with-btn"
                    >추가하기</v-btn
                  >
                </v-col>
              </v-row>
            </div>
          </v-col>
          <v-row justify="start">
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
        </v-row>
      </v-card-text>
    </v-card>

    <v-row class="justify-center">
      <v-col cols="12" md="6">
        <v-btn @click="addChild" depressed block x-large color="primary"
          >등록</v-btn
        >
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import {
  addChild as apiAddChild,
  getClassList as apiGetClassList,
  getRideList as apiGetRideList,
  checkChild as apiCheckChild,
} from '@/api/api'
import UploadChildDialog from '@/components/dialog/UploadChildDialog.vue'
import { useGlobal } from '@/composables/useGlobal'

const { $showMessage, $showError, $withLoading, $dialog } = useGlobal()

// ✅ 템플릿 refs
const formRef = ref<any>(null)
const menuRef = ref<any>(null)
const detailAddressRef = ref<any>(null)

// ✅ 상태
const isValid = ref<boolean>(false)
const birthdayWrap = ref<boolean>(false) // 생년월일 필드와 picker를 묶는 역할
const addmisionDateWrap = ref<boolean>(false)
const activePicker = ref<any>(null)
const hasRide = ref<boolean>(false)
const amPm = ref<string>('오전')
const selectedRide = ref<any>({ meetingLocationList: [] })
const selectedMeetingLocation = ref<any>({})
const childRideComment = ref<string>('')

const form = ref<any>({
  id: '',
  name: '',
  birthday: '',
  admissionDate: '',
  // admissionDate: `${moment().format('YYYY-MM-DD')}`,
  className: '',
  address: { detailAddress: '', zipCode: '', address: '' },
  status: '재원',
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
})

const classNameList = ref<string[]>([])
const birthday = ref<string>('')
const parentTypeList: string[] = ['부', '모', '조부', '조모', '그 외']
const amRideNameList = ref<any[]>([])
const pmRideNameList = ref<any[]>([])

const numRules = [
  (v: string) => !!v || '필수 항목입니다.',
  (v: string) =>
    /^\d+$/.test(v) || '하이픈(-) 없이 숫자만 입력해 주세요.',
  (v: string) => /^.{8,11}$/.test(v) || '8~11자 이내로 입력해주세요.',
]
const nameRules = [
  (v: string) => !!v || '필수 항목입니다.',
  (v: string) =>
    /^[가-힣ㄱ-ㅎㅏ-ㅣ]*$/.test(v) || '한글만 입력해 주세요.',
  (v: string) => /^.{0,16}$/.test(v) || '16자 이내로 입력해주세요.',
]
const statusRules = [
  (v: string) => !!v || '필수 항목입니다.',
  (v: string) =>
    /^[가-힣ㄱ-ㅎㅏ-ㅣ]*$/.test(v) || '한글만 입력해 주세요.',
  (v: string) => /^.{0,8}$/.test(v) || '8자 이내로 입력해주세요.',
]
const datePicRules = [(v: string) => !!v || '날짜를 선택해 주세요.']
const classNameRules = [(v: string) => !!v || '반을 선택해 주세요.']
const pbRelationRules = [(v: string) => !!v || '관계를 선택해 주세요.']

const postcodeDialog = ref<boolean>(false)

// ✅ 메서드
const openUploadChildDialog = async () => {
  await $dialog?.(UploadChildDialog)
}

const getDay = (date: string | Date): string => {
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토']
  const week = new Date(date).getDay()
  return daysOfWeek[week]
}

const getMonth = (date: string | Date): string => {
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
  const month = new Date(date).getMonth()
  return monthName[month]
}

const changeHeader = (date: string | Date): string => {
  const year = new Date(date).getFullYear()
  const month = new Date(date).getMonth() + 1
  return `${year}년 ${month}월`
}

const addParentBox = () => {
  form.value.parentList.push({
    parentType: '',
    parent: '',
    parentPhone: '',
  })
}

const removeParentBox = (index: any) => {
  if (form.value.parentList.length > 1) {
    form.value.parentList.splice(Number(index), 1)
  }
}

const formatPhoneNumber = (phoneNumber: string): string | null => {
  // 숫자만 추출
  const cleaned = phoneNumber.replace(/\D/g, '')

  // 전화번호가 10자리일 경우 (예: 02-1234-5678) 또는 11자리일 경우 (예: 010-1234-5678)
  const match = cleaned.match(/^(\d{2,3})(\d{3,4})(\d{4})$/)

  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`
  }

  return null // 잘못된 형식의 전화번호일 경우 null 반환
}

const addChildFn = () => {
  if (formRef.value?.validate()) {
    const param = form.value
    if (
      form.value.childRideList == null ||
      form.value.childRideList.length == 0
    )
      form.value.childRideList = null

    form.value.parentList.forEach((parents: any) => {
      parents.telephone = formatPhoneNumber(parents.telephone)
    })

    $withLoading?.(
      apiAddChild(param)
        .then((response: any) => {
          if (response.code == '0') {
            $showMessage?.({
              type: 'success',
              message: '원아 등록이 성공적으로 완료되었습니다.',
            })
            formRef.value?.reset()
            //TODO: 화면이동 or 인풋값 초기화
          }
        })
        .catch((e: any) => {
          $showError?.(e)
        })
    )
  }
}
// Template 호환성 유지 (template에서 addChild 호출)
const addChild = addChildFn

const pushChildRideList = () => {
  if (
    selectedMeetingLocation.value.name == null ||
    selectedRide.value.name == null
  ) {
    $showMessage?.({
      type: 'warning',
      message: '차량코스와 승하차 장소를 선택해주세요',
    })
    return
  }
  const childRide: any = {}
  childRide.comment = childRideComment.value
  childRide.meetingLocation = selectedMeetingLocation.value
  childRide.rideName = selectedRide.value.name
  childRide.amPm = amPm.value
  childRide.menuOpen = false
  form.value.childRideList.push(childRide)
  //입력값 초기화
  childRideComment.value = ''
  selectedMeetingLocation.value = {}
  selectedRide.value = { meetingLocationList: [] }
}

const getClassList = () => {
  apiGetClassList()
    .then((response: any) => {
      if (response.data != null) {
        const array: string[] = []
        response.data.forEach((element: any) => {
          array.push(element.name)
        })
        classNameList.value = array
      }
    })
    .catch((error: any) => {
      console.log(error)
      $showError?.(error)
    })
}

const getRideList = () => {
  apiGetRideList()
    .then((response: any) => {
      if (response.data != null) {
        response.data.forEach((element: any) => {
          if (element.meetingLocationList != null)
            element.meetingLocationList.forEach((meetingLocation: any) => {
              meetingLocation.name = `${meetingLocation.name}(${meetingLocation.time})`
            })
          if (element.am) amRideNameList.value.push(element)
          else pmRideNameList.value.push(element)
        })
      }
    })
    .catch((error: any) => {
      console.log(error)
      $showError?.(error)
    })
}

const truncateString = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) {
    return str
  }
  return str.slice(0, maxLength) + '...'
}

const openPostcode = () => {
  postcodeDialog.value = true

  // Daum 주소 검색 팝업 열기
  nextTick(() => {
    new (window as any).daum.Postcode({
      oncomplete: (data: any) => {
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
        form.value.address.zipCode = data.zonecode // 우편번호
        form.value.address.address = addr // 주소
        form.value.address.detailAddress = extraAddr // 상세주소

        // 다이얼로그 닫기
        postcodeDialog.value = false

        // 상세주소 입력칸에 포커스
        nextTick(() => {
          detailAddressRef.value?.focus()
        })
      },
      width: '100%',
      height: '100%',
    }).embed(document.getElementById('postcode'))
  })
}

const checkChildFn = () => {
  if (form.value.className == '' || form.value.name == '') {
    $showMessage?.({
      type: 'warning',
      message: `원아와 반이름 모두 입력해주세요.`,
    })
    return
  }
  const param: any = {}
  param.className = form.value.className
  param.name = form.value.name
  apiCheckChild(param)
    .then((response: any) => {
      if (response.data != null) {
        $showMessage?.({
          type: 'warning',
          message: `${form.value.className}에 ${form.value.name} 원아가 이미 존재합니다.`,
        })
      } else {
        $showMessage?.({
          type: 'success',
          message: '해당원아는 등록 가능합니다.',
        })
      }
    })
    .catch((e: any) => {
      $showError?.(e)
    })
}
// Template 호환성 유지 (template에서 checkChild 호출)
const checkChild = checkChildFn

const init = () => {
  getClassList()
  getRideList()
}

onMounted(() => {
  init()
})
</script>

<style lang="scss" scoped>
._btn-grp {
  gap: 0.5rem;
  flex-wrap: nowrap;
}
</style>
