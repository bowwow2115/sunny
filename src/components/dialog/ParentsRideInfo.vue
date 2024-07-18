<template>
  <v-dialog
    v-model="show"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    max-width="100%"
  >
    <v-card>
      <v-toolbar dark color="primary">
        <v-toolbar-title>원아정보 더보기</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="closeInfo">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <!-- 보호자 리스트 -->
      <v-list>
        <v-list-group
          :value="true"
          prepend-icon="mdi-human-male-female-child"
          :no-action="true"
        >
          <template v-slot:activator>
            <v-list-item-subtitle>보호자 정보</v-list-item-subtitle>
          </template>
          <div v-if="form.parentList.length != 0">
            <v-list-item-group
              v-for="(item, index) in form.parentList"
              :key="index"
            >
              <v-list-item style="padding-left: 15%; padding-right: 8%">
                <v-list-item-icon>
                  <v-icon>mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ item.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    item.relation
                  }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-spacer></v-spacer>
                <v-list-item-icon @click="openParentsDialog(true, item)">
                  <v-icon color="green accent-4">mdi-pencil</v-icon>
                </v-list-item-icon>
              </v-list-item>
              <v-list-item style="padding-left: 15%; padding-right: 8%">
                <v-list-item-icon>
                  <v-icon
                    color="green"
                    v-clipboard:copy="item.telephone"
                    v-clipboard:success="phoneCall"
                    >mdi-phone</v-icon
                  >
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ item.telephone }}</v-list-item-title>
                </v-list-item-content>
                <v-spacer></v-spacer>
                <v-list-item-icon @click="deleteParents(item)">
                  <v-icon color="red darken3">mdi-minus</v-icon>
                </v-list-item-icon>
              </v-list-item>
              <v-divider v-if="index != form.parentList.length - 1"></v-divider>
            </v-list-item-group>
          </div>
          <v-list-item v-else style="padding-left: 15%; padding-right: 8%">
            <v-list-item-icon>
              <v-icon>mdi-information-off</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                등록된 부모의 정보가 없습니다.
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item style="padding: 0px">
            <v-spacer></v-spacer>
            <v-btn @click="openParentsDialog(false)"
              ><v-icon color="green darken3">mdi-plus</v-icon></v-btn
            >
            <v-spacer></v-spacer>
          </v-list-item>
        </v-list-group>
      </v-list>
      <v-divider></v-divider>
      <!-- 오전차량 리스트 -->
      <v-list>
        <v-list-group :value="true" prepend-icon="mdi-bus-side">
          <template v-slot:activator>
            <v-list-item-subtitle>오전차량 정보</v-list-item-subtitle>
          </template>

          <v-list-item-group v-if="form.amRide != null">
            <v-list-item style="padding-left: 15%; padding-right: 8%">
              <v-list-item-icon>
                <v-icon>mdi-bus</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{
                  form.amRide.sunnyRide.name + ' 코스'
                }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  form.amRide.sunnyRide.time ||
                  '' + ' ' + form.amRide.sunnyRide.comment
                }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-spacer></v-spacer>
              <v-list-item-icon>
                <v-icon
                  color="green accent-4"
                  @click="openChildRideDialog(true, form.amRide)"
                  >mdi-pencil</v-icon
                >
              </v-list-item-icon>
            </v-list-item>

            <v-list-item style="padding-left: 15%; padding-right: 8%">
              <v-list-item-icon>
                <v-icon>mdi-human-male-child</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{
                  form.amRide.time + ' 승차'
                }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  form.amRide.comment || ''
                }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-spacer></v-spacer>
              <v-list-item-icon>
                <v-icon
                  color="red darken3"
                  @click="deleteChildRide(form.amRide)"
                  >mdi-minus</v-icon
                >
              </v-list-item-icon>
            </v-list-item>
          </v-list-item-group>
          <div v-else>
            <v-list-item style="padding-left: 15%; padding-right: 8%">
              <v-list-item-icon>
                <v-icon>mdi-information-off</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  등록된 오전챠량의 정보가 없습니다.
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item style="padding: 0px">
              <v-spacer></v-spacer>
              <v-btn @click="openChildRideDialog(false, {}, true)"
                ><v-icon color="green darken3">mdi-plus</v-icon></v-btn
              >
              <v-spacer></v-spacer>
            </v-list-item>
          </div>
        </v-list-group>
      </v-list>
      <v-divider></v-divider>
      <!-- 오후차량 리스트 -->
      <v-list>
        <v-list-group :value="true" prepend-icon="mdi-bus-side">
          <template v-slot:activator>
            <v-list-item-subtitle>오후차량 정보</v-list-item-subtitle>
          </template>
          <v-list-item-group v-if="form.pmRide != null">
            <v-list-item style="padding-left: 15%; padding-right: 8%">
              <v-list-item-icon>
                <v-icon>mdi-bus</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{
                  form.pmRide.sunnyRide.name + ' 코스'
                }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  form.pmRide.sunnyRide.time ||
                  '' + ' ' + form.pmRide.sunnyRide.comment
                }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-spacer></v-spacer>
              <v-list-item-icon>
                <v-icon
                  @click="openChildRideDialog(true, form.pmRide)"
                  color="green accent-4"
                  >mdi-pencil</v-icon
                >
              </v-list-item-icon>
            </v-list-item>

            <v-list-item style="padding-left: 15%; padding-right: 8%">
              <v-list-item-icon>
                <v-icon>mdi-human-male-child</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{
                  form.pmRide.time + ' 하차'
                }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  form.pmRide.comment
                }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-spacer></v-spacer>
              <v-list-item-icon>
                <v-icon
                  color="red darken3"
                  @click="deleteChildRide(form.pmRide)"
                  >mdi-minus</v-icon
                >
              </v-list-item-icon>
            </v-list-item>
          </v-list-item-group>
          <div v-else>
            <v-list-item style="padding-left: 15%; padding-right: 8%">
              <v-list-item-icon>
                <v-icon>mdi-information-off</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  등록된 오후차량의 정보가 없습니다.
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item style="padding: 0px">
              <v-spacer></v-spacer>
              <v-btn @click="openChildRideDialog(false, {}, false)"
                ><v-icon color="green darken3">mdi-plus</v-icon></v-btn
              >
              <v-spacer></v-spacer>
            </v-list-item>
          </div>
        </v-list-group>
      </v-list>
      <!-- 원아정보 -->
    </v-card>
  </v-dialog>
</template>

<script>
import ParentsDialog from '@/components/dialog/ManageParentsDialog.vue'
import ChildRideDialog from '@/components/dialog/ManageChildRideDialog'
import { getChildById, deleteParents, deleteChildRide } from '@/api/api.js'
export default {
  components: {},
  name: 'ParentRideInfo',
  mounted() {},
  data() {
    return {
      show: false,
      form: {
        id: '',
        childCode: '',
        admissionDate: '',
        className: '',
        address: null,
        birthday: '',
        parentList: [],
        status: false,
        amRide: null,
        pmRide: null,
        name: '',
      },
    }
  },
  methods: {
    showInfo(info) {
      this.show = true
      this.form.id = info.id
      this.form.childCode = info.childCode
      this.form.admissionDate = info.admissionDate
      this.form.className = info.className
      this.form.address = info.address
      this.form.birthday = info.birthday
      this.form.parentList = info.parentList
      this.form.status = info.status
      this.form.amRide = info.amRide
      this.form.pmRide = info.pmRide
      this.form.name = info.name
    },
    closeInfo() {
      this.show = false
      this.form.id = null
      this.form.childCode = null
      this.form.admissionDate = null
      this.form.className = null
      this.form.address = null
      this.form.birthday = null
      this.form.parentList = []
      this.form.status = null
      this.form.amRide = null
      this.form.pmRide = null
      this.form.name = null
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
    async openChildRideDialog(isEdit, item = {}, am = null) {
      item.isEdit = isEdit
      item.child = {}
      item.child.id = this.form.id
      if (am != null) {
        item.sunnyRide = {}
        item.sunnyRide.am = am
      }
      const result = await this.$dialog(ChildRideDialog, item)
      if (result) {
        if (isEdit) {
          this.$showMessage({
            type: 'success',
            message: '수정이 완료되었습니다.',
          })
        } else {
          this.$showMessage({
            type: 'success',
            message: '추가가 완료되었습니다.',
          })
        }
        if (result.sunnyRide.am) this.form.amRide = result
        else this.form.pmRide = result
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
        message: `${
          childRide.sunnyRide.am ? '오전정보' : '오후정보'
        }를 정말 삭제하시겠습니까?`,
      })
      if (result) {
        deleteChildRide(childRide.id)
          .then((response) => {
            if (response.code == '0') {
              this.$showMessage({
                type: 'success',
                message: '성공적으로 삭제했습니다.',
              })
              childRide.sunnyRide.am
                ? (this.form.amRide = null)
                : (this.form.pmRide = null)
            }
          })
          .catch((e) => {
            this.$showError(e)
          })
      }
    },
    getParentsRideInfo() {
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
  },
}
</script>

<style scoped>
/* 원하는 스타일 추가 */
</style>
