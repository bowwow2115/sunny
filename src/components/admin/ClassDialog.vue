<template>
  <v-dialog
    v-model="visible"
    :fullscreen="isMobile"
    :hide-overlay="isMobile"
    width="500px"
  >
    <v-card>
      <v-toolbar color="primary" dark>
        <v-toolbar-title>
          {{ '반 설정' }}
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
          <div v-if="form.classList.length != 0">
            <v-list-item-group
              v-for="(sunnyClass, index) in form.classList"
              :key="index"
            >
              <v-list-item style="padding-left: 15%; padding-right: 8%">
                <v-list-item-content>
                  <v-list-item-title>{{ sunnyClass.name }}</v-list-item-title>
                  <!-- <v-spacer></v-spacer> -->
                </v-list-item-content>
                <v-list-item-icon @click="deleteClass(sunnyClass)">
                  <v-icon color="red lighten-1">mdi-minus</v-icon>
                </v-list-item-icon>
              </v-list-item>
              <v-divider v-if="index != form.classList.length - 1"></v-divider>
            </v-list-item-group>
          </div>
          <v-list-item v-else style="padding-left: 15%; padding-right: 8%">
            <v-list-item-icon>
              <v-icon>mdi-information-off</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                등록된 반의 정보가 없습니다.
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item style="padding: 0px">
            <v-spacer></v-spacer>
            <v-btn @click="openClassAddDialog()"
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
import { getClassList, deleteClass } from '@/api/api'
import ClassAddDialog from './ClassAddDialog.vue'

export default {
  mounted() {
    this.getClassList()
    this.checkIfMobile()
  },
  data() {
    return {
      visible: false,
      resolve: null,
      reject: null,
      form: {
        classList: [],
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
    async deleteClass(sunnyClass) {
      const result = await this.$confirm({
        message: `${sunnyClass.name}을 정말 삭제하시겠습니까?`,
      })
      if (result) {
        this.$withLoading(
          deleteClass(sunnyClass.id)
            .then((response) => {
              if (response.code == '0') {
                this.$showMessage({
                  type: 'success',
                  message: '성공적으로 삭제했습니다.',
                })
                let index = this.form.classList.findIndex(
                  (item) => item.id === sunnyClass.id
                )
                if (index !== 1) {
                  this.$delete(this.form.classList, index)
                }
              }
            })
            .catch((e) => {
              this.$showError(e)
            })
        )
      }
    },
    async openClassAddDialog() {
      const result = await this.$dialog(ClassAddDialog, null)
      if (result != null) {
        this.$showMessage({
          type: 'success',
          message: '성공적으로 추가했습니다.',
        })
        this.$set(this.form.classList, this.form.classList.length, result)
      }
    },
    getClassList() {
      getClassList()
        .then((response) => {
          if (response.code == '0') {
            this.form.classList = response.data
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
