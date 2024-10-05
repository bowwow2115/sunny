<template>
  <v-dialog
    v-model="visible"
    :fullscreen="isMobile"
    :hide-overlay="isMobile"
    :scrollable="false"
  >
    <v-card class="pa-2">
      <v-card-title class="title">
        {{ `${this.form.name} 정보 수정` }}
      </v-card-title>
      <!-- <v-toolbar color="primary" dark>
        <v-toolbar-title>
          {{ `${this.form.name} 정보 수정` }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="cancel">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar> -->
      <v-list class="pa-0">
        <v-list-group
          :value="true"
          prepend-icon="ri-map-pin-fill"
          :no-action="true"
        >
          <template v-slot:activator>
            <v-list-item-title>승하차 장소</v-list-item-title>
          </template>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="_list-title-with-sub"
                >{{ form.name }} <span>{{ form.time }}</span></v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="py-2">
            <v-btn block depressed @click="openMeetingLoactionDialog(form)">
              정보 수정
              <v-icon color="success" class="ml-2 font-weight-light"
                >ri-edit-2-fill</v-icon
              >
            </v-btn>
          </v-list-item>
        </v-list-group>
      </v-list>
      <v-list class="pa-0">
        <v-list-group
          :value="true"
          prepend-icon="ri-user-5-fill"
          :no-action="true"
        >
          <template v-slot:activator>
            <v-list-item-title>등록된 원아</v-list-item-title>
          </template>
          <div v-if="form.childRideList.length != 0">
            <v-list-item-group
              v-for="(childRide, index) in form.childRideList"
              :key="index"
              class="ml-14"
            >
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="_list-title-with-sub"
                    >{{ childRide.child.name }}
                    <span>{{ childRide.child.className }}</span>
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon color="gray" @click="deleteChildRide(childRide)">
                    <v-icon>ri-close-circle-fill</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
              <v-divider v-if="index != childRide.length - 1"></v-divider>
            </v-list-item-group>
          </div>
          <v-list-item v-else>
            <v-list-item-icon>
              <v-icon>mdi-information-off</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                등록된 원아의 정보가 없습니다.
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="py-2">
            <v-btn @click="openAddChildRideDialog()" block depressed
              >원아 추가<v-icon color="success" class="ml-2 font-weight-light"
                >ri-add-fill</v-icon
              ></v-btn
            >
          </v-list-item>
        </v-list-group>
      </v-list>
      <v-card-actions class="flex-wrap justify-end py-4 px-6">
        <v-btn color="gray" text @click="cancel" large>닫기</v-btn>
        <v-btn color="error" text large @click="deleteMeetingLocation()">
          {{ `${this.form.name} 삭제` }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  deleteChildRide,
  getAttendingChildren,
  deleteMeetingLocation,
} from '@/api/api'
import ManageMeetingLocationDialog from '@/components/dialog/ManageMeetingLocationDialog.vue'
import SearchChildDialog from '@/components/dialog/SearchChildDialog.vue'
export default {
  mounted() {
    this.checkIfMobile()
  },
  data() {
    return {
      visible: false,
      resolve: null,
      reject: null,
      form: {
        id: '',
        name: '',
        time: '',
        childRideList: [],
      },
      isEdit: false,
      isMobile: false,
    }
  },
  methods: {
    open(item) {
      this.visible = true
      this.form.id = item.id
      this.form.name = item.name
      this.form.time = item.time
      this.form.childRideList = item.childRideList
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    cancel() {
      this.visible = false
      this.resolve(true)
    },
    async openMeetingLoactionDialog(meetingLocation) {
      meetingLocation.isEdit = true
      const result = await this.$dialog(
        ManageMeetingLocationDialog,
        meetingLocation
      )
      if (result != null) {
        this.form.name = result.name
        this.form.time = result.time
      }
    },
    async deleteChildRide(childRide) {
      const result = await this.$confirm({
        message: `${childRide.child.name}을 정말 ${this.form.name}에서 제외시키겠습니까?`,
      })
      if (result) {
        this.$withLoading(
          deleteChildRide(childRide.id)
            .then((response) => {
              if (response.code == '0') {
                this.$showMessage({
                  type: 'success',
                  message: '성공적으로 삭제했습니다.',
                })
                let index = this.form.childRideList.findIndex(
                  (item) => item.id === childRide.id
                )
                if (index !== 1) {
                  this.$delete(this.form.childRideList, index)
                }
              }
            })
            .catch((e) => {
              this.$showError(e)
            })
        )
      }
    },
    async deleteMeetingLocation() {
      const result = await this.$confirm({
        message: `주의: ${this.form.name}을 정말 삭제하시겠습니까?`,
      })
      if (result) {
        this.$withLoading(
          deleteMeetingLocation(this.form.id)
            .then((response) => {
              if (response.code == '0') {
                this.$showMessage({
                  type: 'success',
                  message: '성공적으로 삭제했습니다.',
                })
                this.cancel()
              }
            })
            .catch((e) => {
              this.$showError(e)
            })
        )
      }
    },
    async openAddChildRideDialog() {
      //원아정보 전달 시 현재 코스에 등록되어있는 원아 필터링 후 넘김(여기서 검색)
      let item = {}
      item.meetingLocationName = this.form.name
      item.meetingLocationId = this.form.id
      item.childList = await this.getAttendingChildren()
      const result = await this.$dialog(SearchChildDialog, item)

      if (result != null) {
        this.$showMessage({
          type: 'success',
          message: '성공적으로 추가했습니다.',
        })
        for (let item of result) {
          this.$set(
            this.form.childRideList,
            this.form.childRideList.length,
            item
          )
        }
      }
    },
    async getAttendingChildren() {
      let childList = []
      await this.$withLoading(
        getAttendingChildren()
          .then((response) => {
            if (response.code == '0') {
              childList = response.data.filter((child) => {
                for (let childRide of this.form.childRideList) {
                  if (childRide.child.id === child.id) return false
                }
                return true
              })
            }
          })
          .catch((e) => {
            this.$showError(e)
          })
      )
      return childList
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
