<template>
  <v-dialog
    v-model="infoBox.show"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    max-width="100%"
  >
    <v-card>
      <v-toolbar dark color="primary">
        <v-toolbar-title>원아정보 더보기 및 수정</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="closeInfo">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-list>
        <v-list-group :value="true" prepend-icon="mdi-human-male-female-child">
          <template v-slot:activator>
            <v-list-item-subtitle>부모정보</v-list-item-subtitle>
          </template>

          <!-- <v-subheader>부모정보</v-subheader> -->
          <div v-if="infoBox.parentList.length != 0">
            <v-list-item-group
              v-for="(item, index) in infoBox.parentList"
              :key="index"
            >
              <v-list-item link>
                <v-list-item-icon> </v-list-item-icon>
                <v-list-item-icon>
                  <v-icon>mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ item.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    item.relation
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon> </v-list-item-icon>
                <v-list-item-icon>
                  <v-icon color="green" @click="phoneCall">mdi-phone</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ item.telephone }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
            </v-list-item-group>
          </div>
          <!-- TODO:등록된 -->
          <v-list-item v-else>
            <v-list-item-icon> </v-list-item-icon>
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
      <v-list>
        <v-list-group :value="true" prepend-icon="mdi-human-male-female-child">
          <v-subheader>오전 챠량정보</v-subheader>
          <v-list-item-group v-if="infoBox.amRide != null">
            <v-list-item>
              <v-list-item-icon> </v-list-item-icon>
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
            </v-list-item>

            <v-list-item>
              <v-list-item-icon> </v-list-item-icon>
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
            </v-list-item>
          </v-list-item-group>
          <v-list-item v-else>
            <v-list-item-icon> </v-list-item-icon>
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

      <v-list>
        <v-subheader>오후 챠량정보</v-subheader>
        <v-list-item-group v-if="infoBox.pmRide != null">
          <v-list-item>
            <v-list-item-icon> </v-list-item-icon>
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
          </v-list-item>

          <v-list-item>
            <v-list-item-icon> </v-list-item-icon>
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
          </v-list-item>
        </v-list-item-group>
        <v-list-item v-else>
          <v-list-item-icon> </v-list-item-icon>
          <v-list-item-icon>
            <v-icon>mdi-information-off</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              등록된 오전챠량의 정보가 없습니다.
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
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
