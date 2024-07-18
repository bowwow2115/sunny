<template>
  <v-dialog v-model="visible" max-width="400px">
    <v-card>
      <v-toolbar color="primary" dark> 보호자 정보 </v-toolbar>
      <v-list>
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
                <v-list-item-subtitle>{{ item.relation }}</v-list-item-subtitle>
              </v-list-item-content>
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
      </v-list>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      resolve: null,
      reject: null,
      form: {
        parentList: [],
      },
      phoneNum: '',
    }
  },
  methods: {
    open(item) {
      this.visible = true
      this.form.parentList = item
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    cancel() {
      this.visible = false
    },
    confirm() {
      this.visible = false
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

<style></style>
