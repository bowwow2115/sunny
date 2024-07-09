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
        <v-list-group :value="true" prepend-icon="mdi-human-male-female-child">
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
                <v-icon color="accent">mdi-pencil</v-icon>
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
                <v-icon color="accent">mdi-pencil</v-icon>
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
import { getChildById } from '@/api/api.js'
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
    phoneCall() {
      console.log('hi')
    },
    async showParents(item) {
      try {
        const result = await this.$dialog(ParentsDialog, item)
        if (result) {
          this.$emit('show-message', {
            type: 'success',
            message: '수정이 완료되었습니다.',
          })
          let index = this.form.parentList.findIndex(
            (item) => item.id == result.id
          )
          console.log(`index: ${index}`)
          if (index !== -1) {
            this.$set(this.form.parentList, index, result)
          }
        }
        console.log('Dialog confirmed:', result)
      } catch (error) {
        console.log('Dialog cancelled:', error)
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
            this.$emit('show-error', e)
          })
      )
    },
  },
}
</script>

<style scoped>
/* 원하는 스타일 추가 */
</style>
