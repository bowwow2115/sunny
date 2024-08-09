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
          {{ `${this.form.name} 정보 수정` }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="cancel">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-list>
        <v-list-group
          :value="true"
          prepend-icon="mdi-map-marker-radius"
          :no-action="true"
        >
          <template v-slot:activator>
            <v-list-item-subtitle>승하차 장소 정보</v-list-item-subtitle>
          </template>
          <v-list-item-group>
            <v-list-item style="padding-left: 15%; padding-right: 8%">
              <v-list-item-content>
                <v-list-item-title>{{ form.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ form.time }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-spacer></v-spacer>
              <v-list-item-icon @click="openMeetingLoactionDialog(form)">
                <v-icon color="green accent-4">mdi-pencil</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-item-group>
        </v-list-group>
      </v-list>
      <v-list>
        <v-list-group
          :value="true"
          prepend-icon="mdi-account"
          :no-action="true"
        >
          <template v-slot:activator>
            <v-list-item-subtitle>등록된 원아</v-list-item-subtitle>
          </template>
          <div v-if="form.childRideList.length != 0">
            <v-list-item-group
              v-for="(childRide, index) in form.childRideList"
              :key="index"
            >
              <v-list-item style="padding-left: 15%; padding-right: 8%">
                <v-list-item-content>
                  <v-list-item-title>{{
                    childRide.child.name
                  }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    childRide.child.className
                  }}</v-list-item-subtitle>
                  <v-spacer></v-spacer>
                </v-list-item-content>
                <v-list-item-icon @click="deleteChildRide(childRide)">
                  <v-icon color="red darken3">mdi-minus</v-icon>
                </v-list-item-icon>
              </v-list-item>
              <v-divider v-if="index != childRide.length - 1"></v-divider>
            </v-list-item-group>
          </div>
          <v-list-item v-else style="padding-left: 15%; padding-right: 8%">
            <v-list-item-icon>
              <v-icon>mdi-information-off</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                등록된 원아의 정보가 없습니다.
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item style="padding: 0px">
            <v-spacer></v-spacer>
            <v-btn @click="openAddChildRideDialog(false, {}, true)"
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
import { deleteChildRide } from '@/api/api'
import ManageMeetingLocationDialog from '@/components/dialog/ManageMeetingLocationDialog.vue'

export default {
  mounted() {},
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
                this.form.childRideList = this.form.childRideList.filter(
                  (childRide) => childRide.id !== childRide.id
                )
                this.$showMessage({
                  type: 'success',
                  message: '성공적으로 삭제했습니다.',
                })
              }
            })
            .catch((e) => {
              this.$showError(e)
            })
        )
      }
    },
  },
}
</script>

<style scoped>
/* 원하는 스타일 추가 */
</style>
