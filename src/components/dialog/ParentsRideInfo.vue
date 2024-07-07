<template>
  <v-dialog
    v-model="infoBox.show"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    max-width="100%"
  >
    <parents-dialog ref="parentsDialog"></parents-dialog>
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
        <v-list-group :value="true" prepend-icon="mdi-human-male-female-child">
          <template v-slot:activator>
            <v-list-item-subtitle>보호자 정보</v-list-item-subtitle>
          </template>
          <div v-if="infoBox.parentList.length != 0">
            <v-list-item-group
              v-for="(item, index) in infoBox.parentList"
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
                <v-list-item-icon @click="showParents(item)">
                  <v-icon color="accent">mdi-pencil</v-icon>
                </v-list-item-icon>
              </v-list-item>
              <v-list-item style="padding-left: 15%; padding-right: 8%">
                <v-list-item-icon>
                  <v-icon color="green" @click="phoneCall">mdi-phone</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ item.telephone }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider
                v-if="index != infoBox.parentList.length - 1"
              ></v-divider>
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
        </v-list-group>
      </v-list>
      <v-divider></v-divider>
      <!-- 오전차량 리스트 -->
      <v-list>
        <v-list-group :value="true" prepend-icon="mdi-bus-side">
          <template v-slot:activator>
            <v-list-item-subtitle>오전차량 정보</v-list-item-subtitle>
          </template>

          <v-list-item-group v-if="infoBox.amRide != null">
            <v-list-item style="padding-left: 15%; padding-right: 8%">
              <v-list-item-icon>
                <v-icon>mdi-bus</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{
                  infoBox.amRide.sunnyRide.name + ' 코스'
                }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  infoBox.amRide.sunnyRide.time ||
                  '' + ' ' + infoBox.amRide.sunnyRide.comment
                }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-spacer></v-spacer>
              <v-list-item-icon>
                <v-icon color="accent">mdi-pencil</v-icon>
              </v-list-item-icon>
            </v-list-item>

            <v-list-item style="padding-left: 15%; padding-right: 8%">
              <v-list-item-icon>
                <v-icon>mdi-human-male-child</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{
                  infoBox.amRide.time + ' 승차'
                }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  infoBox.amRide.comment || ''
                }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-spacer></v-spacer>
              <v-list-item-icon>
                <v-icon color="accent">mdi-pencil</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-item-group>
          <v-list-item style="padding-left: 15%; padding-right: 8%" v-else>
            <v-list-item-icon>
              <v-icon>mdi-information-off</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                등록된 오전챠량의 정보가 없습니다.
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
      <v-divider></v-divider>
      <!-- 오후차량 리스트 -->
      <v-list>
        <v-list-group :value="true" prepend-icon="mdi-bus-side">
          <template v-slot:activator>
            <v-list-item-subtitle>오후차량 정보</v-list-item-subtitle>
          </template>
          <v-list-item-group v-if="infoBox.pmRide != null">
            <v-list-item style="padding-left: 15%; padding-right: 8%">
              <v-list-item-icon>
                <v-icon>mdi-bus</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{
                  infoBox.pmRide.sunnyRide.name + ' 코스'
                }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  infoBox.pmRide.sunnyRide.time ||
                  '' + ' ' + infoBox.pmRide.sunnyRide.comment
                }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-spacer></v-spacer>
              <v-list-item-icon>
                <v-icon color="accent">mdi-pencil</v-icon>
              </v-list-item-icon>
            </v-list-item>

            <v-list-item style="padding-left: 15%; padding-right: 8%">
              <v-list-item-icon>
                <v-icon>mdi-human-male-child</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{
                  infoBox.pmRide.time + ' 하차'
                }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  infoBox.pmRide.comment
                }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-spacer></v-spacer>
              <v-list-item-icon>
                <v-icon color="accent">mdi-pencil</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-item-group>
          <v-list-item v-else style="padding-left: 15%; padding-right: 8%">
            <v-list-item-icon>
              <v-icon>mdi-information-off</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                등록된 오후챠량의 정보가 없습니다.
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
      <!-- 원아정보 -->
    </v-card>
  </v-dialog>
</template>

<script>
import ParentsDialog from './ParentsDialog.vue'
export default {
  components: { ParentsDialog },
  name: 'ParentRideInfo',
  mounted() {},
  data() {
    return {
      infoBox: {
        show: false,
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
      this.infoBox.show = true
      this.infoBox.id = info.id
      this.infoBox.childCode = info.childCode
      this.infoBox.admissionDate = info.admissionDate
      this.infoBox.className = info.className
      this.infoBox.address = info.address
      this.infoBox.birthday = info.birthday
      this.infoBox.parentList = info.parentList
      this.infoBox.status = info.status
      this.infoBox.amRide = info.amRide
      this.infoBox.pmRide = info.pmRide
      this.infoBox.name = info.name
    },
    closeInfo() {
      this.infoBox.show = false
      this.infoBox.id = null
      this.infoBox.childCode = null
      this.infoBox.admissionDate = null
      this.infoBox.className = null
      this.infoBox.address = null
      this.infoBox.birthday = null
      this.infoBox.parentList = []
      this.infoBox.status = null
      this.infoBox.amRide = null
      this.infoBox.pmRide = null
      this.infoBox.name = null
    },
    phoneCall() {
      console.log('hi')
    },
    showParents(item) {
      this.$refs.parentsDialog.showParents(item)
    },
    // onDialogInput(value) {
    //   if (!value) {
    //     this.closeError()
    //   }
    // },
  },
}
</script>

<style scoped>
/* 원하는 스타일 추가 */
</style>
