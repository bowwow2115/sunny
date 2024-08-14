<template>
  <v-dialog
    v-model="visible"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    max-width="100%"
  >
    <v-card>
      <v-toolbar color="primary" dark>
        <v-toolbar-title>
          {{ '차량 설정' }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="cancel">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-list>
        <v-list-group
          :value="true"
          prepend-icon="mdi-account-box-multiple"
          :no-action="true"
        >
          <template v-slot:activator>
            <v-list-item-subtitle>반</v-list-item-subtitle>
          </template>
          <div v-if="form.rideList.length != 0">
            <v-list-item-group
              v-for="(ride, index) in form.rideList"
              :key="index"
            >
              <v-list-item style="padding-left: 15%; padding-right: 8%">
                <v-list-item-content>
                  <v-list-item-title>{{
                    `${ride.name}(${ride.time})`
                  }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    ride.comment
                  }}</v-list-item-subtitle>
                  <!-- <v-spacer></v-spacer> -->
                </v-list-item-content>
                <v-list-item-icon @click="deleteClass(ride)">
                  <v-icon color="red darken3">mdi-minus</v-icon>
                </v-list-item-icon>
              </v-list-item>
              <v-divider v-if="index != form.rideList.length - 1"></v-divider>
            </v-list-item-group>
          </div>
          <v-list-item v-else style="padding-left: 15%; padding-right: 8%">
            <v-list-item-icon>
              <v-icon>mdi-information-off</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                등록된 차량의 정보가 없습니다.
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item style="padding: 0px">
            <v-spacer></v-spacer>
            <v-btn @click="openAddClassDialog()"
              ><v-icon color="green darken3">mdi-plus</v-icon></v-btn
            >
            <v-spacer></v-spacer>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-card>
  </v-dialog>
</template>

<script>
import { getRideList } from '@/api/api'
import AddClassDialog from './AddClassDialog.vue'

export default {
  mounted() {
    this.getRideList()
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
    async deleteClass(ride) {
      const result = await this.$confirm({
        message: `${ride.name}을 정말 삭제하시겠습니까?`,
      })
      if (result) {
        this.$withLoading(
          deleteClass(ride.id)
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
    async openAddClassDialog() {
      const result = await this.$dialog(AddClassDialog, null)
      if (result != null) {
        this.$showMessage({
          type: 'success',
          message: '성공적으로 추가했습니다.',
        })
        this.$set(this.form.rideList, this.form.rideList.length, result)
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
  },
}
</script>

<style scoped>
/* 원하는 스타일 추가 */
</style>
