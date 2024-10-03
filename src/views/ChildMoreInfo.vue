<template>
  <v-dialog
    v-model="show"
    :fullscreen="isMobile"
    :hide-overlay="isMobile"
    @click:outside="cancel()"
  >
    <v-card class="pa-2">
      <v-card-title class="title">원아정보 더보기</v-card-title>
      <!-- 원아정보 -->
      <h2 class="_child-more-head ma-4 py-3 px-4">
        {{ form.name }}<small class="ml-2">{{ `${form.status}` }}</small>
      </h2>
      <v-list class="pa-0">
        <v-list-group
          :value="true"
          prepend-icon="ri-user-5-fill"
          :no-action="true"
        >
          <template v-slot:activator>
            <v-list-item-title>원아 정보</v-list-item-title>
          </template>
          <v-list-item-group class="ml-14 _list-half">
            <!-- 반 -->
            <v-list-item>
              <v-list-item-icon>
                <span class="_list-icon _list-icon-ko">반</span>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ form.className }} </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <!-- 입학일 -->
            <v-list-item>
              <v-list-item-icon>
                <span class="_list-icon _list-icon-ko">입학</span>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ form.admissionDate }} </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <!-- 생일 -->
            <v-list-item>
              <v-list-item-icon>
                <span class="_list-icon _list-icon-ko">생일</span>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ form.birthday }} </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <!-- 주소 -->
            <v-list-item>
              <v-list-item-icon>
                <span class="_list-icon _list-icon-ko">주소</span>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title
                  >{{
                    (form.address.address || '') +
                    (form.address.detailAddress || '')
                  }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
          <v-list-item class="py-2">
            <v-btn block depressed @click="openChildDialog()"
              >정보 수정<v-icon color="success" class="ml-2 font-weight-light"
                >ri-edit-2-fill</v-icon
              ></v-btn
            >
          </v-list-item>
        </v-list-group>
      </v-list>
      <!-- 보호자 정보 -->
      <v-list class="pa-0">
        <v-list-group
          :value="true"
          prepend-icon="ri-parent-fill"
          :no-action="true"
        >
          <template v-slot:activator>
            <v-list-item-title>보호자 정보</v-list-item-title>
          </template>
          <div v-if="form.parentList.length != 0">
            <v-list-item-group
              v-for="(item, index) in form.parentList"
              :key="index"
              class="ml-14"
            >
              <v-list-item>
                <v-list-item-icon>
                  <span class="_list-icon _list-icon-ko">{{
                    item.relation
                  }}</span>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="_list-title-with-sub">
                    {{ item.name }}
                    <span>
                      <v-icon
                        color="gray"
                        v-clipboard:copy="item.telephone"
                        v-clipboard:success="phoneCall"
                        >ri-phone-fill</v-icon
                      >
                      {{ item.telephone }}
                    </span>
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-action class="d-flex flex-row">
                  <v-btn
                    icon
                    color="gray"
                    class="font-weight-light"
                    @click="deleteParents(item)"
                    ><v-icon>ri-close-circle-fill</v-icon></v-btn
                  >
                  <v-btn
                    icon
                    @click="openParentsDialog(true, item)"
                    color="success"
                    class="font-weight-light ml-2"
                    ><v-icon>ri-edit-2-fill</v-icon></v-btn
                  >
                </v-list-item-action>
              </v-list-item>
              <v-divider v-if="index != form.parentList.length - 1"></v-divider>
            </v-list-item-group>
          </div>
          <v-list-item v-else>
            <v-list-item-icon>
              <v-icon>mdi-information-off</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                등록된 부모의 정보가 없습니다.
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="py-2">
            <v-btn @click="openParentsDialog(false)" block depressed
              >보호자 정보 추가<v-icon
                color="success"
                class="ml-2 font-weight-light"
                >ri-add-fill</v-icon
              ></v-btn
            >
          </v-list-item>
        </v-list-group>
      </v-list>
      <!-- 오전차량 리스트 -->
      <v-list class="pa-0">
        <v-list-group :value="true" prepend-icon="ri-bus-2-fill">
          <template v-slot:activator>
            <v-list-item-title>오전차량 정보</v-list-item-title>
          </template>

          <v-list-item-group
            v-if="
              form.amChildRideList != null && form.amChildRideList.length !== 0
            "
            class="ml-14"
          >
            <div
              v-for="(childRide, index) in form.amChildRideList"
              :key="index"
            >
              <v-list-item>
                <v-list-item-icon>
                  <span class="_list-icon _list-icon-am">오전</span>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="_list-title-with-sub"
                    >{{
                      childRide.meetingLocation.sunnyRide.name +
                      (childRide.meetingLocation.sunnyRide.time != null
                        ? `(${childRide.meetingLocation.sunnyRide.time})`
                        : '')
                    }}
                    <span>{{
                      childRide.meetingLocation.sunnyRide.time ||
                      '' + ' ' + childRide.meetingLocation.sunnyRide.comment
                    }}</span>
                  </v-list-item-title>
                  <v-list-item-subtitle class="_list-title-with-sub subtitle-1">
                    {{
                      `${childRide.meetingLocation.name}(${childRide.meetingLocation.time})`
                    }}
                    <span>
                      {{ childRide.comment || '' }}
                    </span>
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action class="d-flex flex-row">
                  <v-btn
                    icon
                    color="gray"
                    class="font-weight-light"
                    @click="deleteChildRide(childRide)"
                    ><v-icon>ri-close-circle-fill</v-icon></v-btn
                  >
                  <v-btn
                    icon
                    color="success"
                    class="font-weight-light ml-2"
                    @click="openChildRideDialog(true, childRide, true)"
                    ><v-icon>ri-edit-2-fill</v-icon></v-btn
                  >
                </v-list-item-action>
              </v-list-item>
            </div>
          </v-list-item-group>
          <div v-else>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-information-off</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  등록된 오전챠량의 정보가 없습니다.
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </div>
          <v-list-item class="ml-14 py-2">
            <v-btn @click="openChildRideDialog(false, {}, true)" block depressed
              >오전차량 정보 추가<v-icon
                color="success"
                class="ml-2 font-weight-light"
                >ri-add-fill</v-icon
              ></v-btn
            >
          </v-list-item>
        </v-list-group>
      </v-list>
      <!-- 오후차량 리스트 -->
      <v-list class="pa-0">
        <v-list-group :value="true" prepend-icon="ri-bus-2-fill">
          <template v-slot:activator>
            <v-list-item-title>오후차량 정보</v-list-item-title>
          </template>
          <v-list-item-group
            v-if="
              form.pmChildRideList != null && form.pmChildRideList.length !== 0
            "
            class="ml-14"
          >
            <div
              v-for="(childRide, index) in form.pmChildRideList"
              :key="index"
            >
              <v-list-item>
                <v-list-item-icon>
                  <span class="_list-icon _list-icon-pm">오후</span>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="_list-title-with-sub"
                    >{{
                      childRide.meetingLocation.sunnyRide.name +
                      (childRide.meetingLocation.sunnyRide.time != null
                        ? `(${childRide.meetingLocation.sunnyRide.time})`
                        : '')
                    }}
                    <span>
                      {{
                        childRide.meetingLocation.sunnyRide.time ||
                        '' + ' ' + childRide.meetingLocation.sunnyRide.comment
                      }}
                    </span>
                  </v-list-item-title>
                  <v-list-item-subtitle class="_list-title-with-sub subtitle-1">
                    {{
                      `${childRide.meetingLocation.name}(${childRide.meetingLocation.time})`
                    }}
                    <span>
                      {{ childRide.comment || '' }}
                    </span>
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action class="d-flex flex-row">
                  <v-btn
                    icon
                    color="gray"
                    class="font-weight-light"
                    @click="deleteChildRide(childRide)"
                    ><v-icon>ri-close-circle-fill</v-icon></v-btn
                  >
                  <v-btn
                    icon
                    color="success"
                    class="font-weight-light ml-2"
                    @click="openChildRideDialog(true, childRide, false)"
                    ><v-icon>ri-edit-2-fill</v-icon></v-btn
                  >
                </v-list-item-action>
              </v-list-item>
            </div>
          </v-list-item-group>
          <div v-else>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-information-off</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  등록된 오후차량의 정보가 없습니다.
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </div>
          <v-list-item class="ml-14 py-2">
            <v-btn
              @click="openChildRideDialog(false, {}, false)"
              block
              depressed
              >오후차량 정보 추가<v-icon
                color="success"
                class="ml-2 font-weight-light"
                >ri-add-fill</v-icon
              ></v-btn
            >
          </v-list-item>
        </v-list-group>
      </v-list>
      <v-card-actions class="flex-wrap justify-end py-4 px-6">
        <v-btn color="gray" text @click="cancel" large>닫기</v-btn>
        <v-btn color="error" text large @click="deleteChild()">
          {{ `${this.form.name} 삭제` }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ParentsDialog from '@/components/dialog/ManageParentsDialog.vue'
import ChildRideDialog from '@/components/dialog/ManageChildRideDialog'
import ChildDialog from '@/components/dialog/ManageChildDialog.vue'
import {
  getChildById,
  deleteParents,
  deleteChildRide,
  deleteChild,
} from '@/api/api.js'
export default {
  components: {},
  name: 'childMoreInfo',
  mounted() {
    this.checkIfMobile()
  },
  data() {
    return {
      show: false,
      resolve: null,
      reject: null,
      form: {
        id: '',
        admissionDate: '',
        className: '',
        address: {},
        birthday: '',
        parentList: [],
        status: '',
        amChildRideList: [],
        pmChildRideList: [],
        name: '',
      },
      isMobile: false,
    }
  },
  methods: {
    open(info) {
      this.show = true
      this.form.id = info.id
      this.form.admissionDate = info.admissionDate
      this.form.className = info.className
      this.form.address = info.address
      this.form.birthday = info.birthday
      this.form.parentList = info.parentList
      this.form.status = info.status
      this.form.amChildRideList = info.amChildRideList
      this.form.pmChildRideList = info.pmChildRideList
      this.form.name = info.name
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    cancel() {
      this.show = false
      this.resolve(false)
    },
    confirm(data) {
      this.show = false
      this.resolve(data)
    },
    async openChildDialog() {
      const result = await this.$dialog(ChildDialog, this.form)
      if (result) {
        this.$showMessage({
          type: 'success',
          message: '수정이 완료되었습니다.',
        })
        this.form.admissionDate = result.admissionDate
        this.form.className = result.className
        this.form.address = result.address
        this.form.birthday = result.birthday
        this.form.status = result.status
        this.form.name = result.name
      }
    },
    async openParentsDialog(isEdit, item = {}) {
      item.isEdit = isEdit
      item.childId = this.form.id
      const result = await this.$dialog(ParentsDialog, item)
      if (result) {
        if (isEdit) {
          this.$showMessage({
            type: 'success',
            message: '수정이 완료되었습니다.',
          })
          let index = this.form.parentList.findIndex(
            (item) => item.id == result.id
          )
          if (index !== -1) {
            this.$set(this.form.parentList, index, result)
          }
        } else {
          this.$showMessage({
            type: 'success',
            message: '추가가 완료되었습니다.',
          })
          this.$set(this.form.parentList, this.form.parentList.length, result)
        }
      }
    },
    async openChildRideDialog(isEdit, item = {}, am) {
      item.isEdit = isEdit
      item.child = {}
      item.child.id = this.form.id
      item.am = am
      const result = await this.$dialog(ChildRideDialog, item)
      if (result) {
        if (isEdit) {
          this.$showMessage({
            type: 'success',
            message: '수정이 완료되었습니다.',
          })
          if (am) {
            let index = this.form.amChildRideList.findIndex(
              (item) => item.id == result.id
            )
            if (index !== -1) {
              this.$set(this.form.amChildRideList, index, result)
            }
          } else {
            let index = this.form.pmChildRideList.findIndex(
              (item) => item.id == result.id
            )
            if (index !== -1) {
              this.$set(this.form.pmChildRideList, index, result)
            }
          }
        } else {
          this.$showMessage({
            type: 'success',
            message: '추가가 완료되었습니다.',
          })
          if (am) {
            this.$set(
              this.form.amChildRideList,
              this.form.amChildRideList.length,
              result
            )
          } else {
            this.$set(
              this.form.pmChildRideList,
              this.form.pmChildRideList.length,
              result
            )
          }
        }
      }
    },
    async deleteParents(parents) {
      const result = await this.$confirm({
        message: `${parents.name}님의 정보를 정말 삭제하시겠습니까?`,
      })
      if (result) {
        deleteParents(parents.id)
          .then((response) => {
            if (response.code == '0') {
              this.$showMessage({
                type: 'success',
                message: '성공적으로 삭제했습니다.',
              })
              let index = this.form.parentList.findIndex(
                (item) => item.id == parents.id
              )
              if (index !== -1) {
                this.$delete(this.form.parentList, index)
              }
            }
          })
          .catch((e) => {
            this.$showError(e)
          })
      }
    },
    async deleteChildRide(childRide) {
      const result = await this.$confirm({
        message: `${childRide.meetingLocation.sunnyRide.name}를 정말 삭제하시겠습니까?`,
      })
      if (result) {
        deleteChildRide(childRide.id)
          .then((response) => {
            if (response.code == '0') {
              this.$showMessage({
                type: 'success',
                message: '성공적으로 삭제했습니다.',
              })
              if (childRide.meetingLocation.sunnyRide.am) {
                let index = this.form.amChildRideList.findIndex(
                  (item) => item.id == childRide.id
                )
                if (index !== -1) {
                  this.$delete(this.form.amChildRideList, index)
                }
              } else {
                let index = this.form.pmChildRideList.findIndex(
                  (item) => item.id == childRide.id
                )
                if (index !== -1) {
                  this.$delete(this.form.pmChildRideList, index)
                }
              }
              // childRide.meetingLocation.sunnyRide.am
              //   ? (this.childRide = null)
              //   : (this.form.pmRide = null)
            }
          })
          .catch((e) => {
            this.$showError(e)
          })
      }
    },
    getChildMoreInfo() {
      this.$withLoading(
        getChildById(this.form.id)
          .then((response) => {
            if (response.code == '0') {
              console.log(response.data)
            }
          })
          .catch((e) => {
            this.$showError(e)
          })
      )
    },
    phoneCall() {
      this.$showMessage({
        type: 'success',
        message: '전화번호를 클립보드에 저장했습니다.',
      })
    },
    async deleteChild() {
      const result = await this.$confirm({
        message: `주의: ${this.form.name}을 정말 삭제하시겠습니까?`,
      })
      if (result) {
        this.$withLoading(
          deleteChild(this.form.id)
            .then((response) => {
              if (response.code == '0') {
                this.confirm(true)
              }
            })
            .catch((e) => {
              this.$showError(e)
            })
        )
      }
    },
    checkIfMobile() {
      // 사용자 에이전트 문자열에서 모바일 기기를 확인
      const userAgent = navigator.userAgent || navigator.vendor || window.opera

      // 모바일 기기 감지 (iOS, Android, 기타 모바일 기기들)
      if (
        /android/i.test(userAgent) ||
        (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream)
      ) {
        this.isMobile = true
      } else {
        this.isMobile = false
      }
    },
  },
}
</script>

<style scoped>
/* 원하는 스타일 추가 */
</style>
