<template>
  <v-dialog v-model="visible" :fullscreen="isMobile" :hide-overlay="isMobile">
    <v-card class="pa-2">
      <v-card-title>
        {{ '차량 설정' }}
      </v-card-title>
      <v-list>
        <v-list-group
          :value="true"
          prepend-icon="ri-bus-2-fill"
          :no-action="true"
        >
          <template v-slot:activator>
            <v-list-item-title>차량</v-list-item-title>
          </template>
          <div v-if="form.rideList.length != 0">
            <v-list-item-group
              v-for="(ride, index) in form.rideList"
              :key="index"
              class="ml-14"
            >
              <v-list-item>
                <v-list-item-icon class="my-4 mx-3">
                  <span
                    :class="{
                      '_list-icon-am': ride.am,
                      '_list-icon-pm': !ride.am,
                    }"
                    class="_list-icon"
                    >{{ ride.am ? '오전' : '오후' }}</span
                  >
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="_list-title-with-sub">
                    {{ ride.name + (ride.time ? `(${ride.time})` : '') }}
                    <span>
                      {{ ride.comment }}
                    </span>
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-actions>
                  <v-btn icon color="gray" @click="deleteRide(ride)">
                    <v-icon>ri-close-circle-fill</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    color="success"
                    @click="openRideAddDialog(true, ride)"
                    class="ml-2"
                    ><v-icon>ri-edit-2-fill</v-icon>
                  </v-btn>
                </v-list-item-actions>
              </v-list-item>
              <v-divider v-if="index != form.rideList.length - 1"></v-divider>
            </v-list-item-group>
          </div>
          <v-list-item v-else>
            <v-list-item-icon>
              <v-icon>mdi-information-off</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                등록된 차량의 정보가 없습니다.
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="py-2">
            <v-btn @click="openRideAddDialog(false)" block depressed
              >차량 추가<v-icon color="success" class="ml-2 font-weight-light"
                >ri-add-fill</v-icon
              ></v-btn
            >
          </v-list-item>
        </v-list-group>
      </v-list>
      <v-card-actions class="flex-wrap justify-end py-4 px-6">
        <v-btn color="gray" text @click="cancel" large>닫기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { getRideList, deleteRide } from '@/api/api'
import RideAddDialog from './RideAddDialog.vue'

export default {
  mounted() {
    this.getRideList()
    this.checkIfMobile()
  },
  data() {
    return {
      visible: false,
      resolve: null,
      reject: null,
      form: {
        rideList: [],
      },
      isEdit: false,
      isMobile: false,
    }
  },
  methods: {
    open() {
      this.visible = true
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    cancel() {
      this.visible = false
      this.resolve(true)
    },
    async deleteRide(ride) {
      const result = await this.$confirm({
        message: `주의: ${ride.name}을 삭제하시면 하위에 있는 승하차장소의 정보들도 삭제됩니다. 정말 삭제하시겠습니까?`,
      })
      if (result) {
        this.$withLoading(
          deleteRide(ride.id)
            .then((response) => {
              if (response.code == '0') {
                this.$showMessage({
                  type: 'success',
                  message: '성공적으로 삭제했습니다.',
                })
                let index = this.form.rideList.findIndex(
                  (item) => item.id === ride.id
                )
                if (index !== 1) {
                  this.$delete(this.form.rideList, index)
                }
              }
            })
            .catch((e) => {
              this.$showError(e)
            })
        )
      }
    },
    async openRideAddDialog(isEdit = false, ride = {}) {
      ride.isEdit = isEdit
      const result = await this.$dialog(RideAddDialog, ride)
      if (result != null) {
        this.$showMessage({
          type: 'success',
          message: '성공적으로 추가했습니다.',
        })
        if (isEdit) {
          const index = this.form.rideList.findIndex(
            (item) => item.id == result.id
          )
          this.$set(this.form.rideList, index, result)
        } else {
          this.$set(this.form.rideList, this.form.rideList.length, result)
        }
      }
    },
    getRideList() {
      getRideList()
        .then((response) => {
          if (response.code == '0') {
            this.form.rideList = response.data
          }
        })
        .catch((e) => {
          this.$showError(e)
        })
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
