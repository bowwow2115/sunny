<template>
  <v-dialog v-model="visible" max-width="400px">
    <v-card>
      <v-toolbar color="primary" dark>
        <v-toolbar-title> 보호자 정보 </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="cancel">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-list>
        <v-list-group
          :value="index == 0 ? true : false"
          prepend-icon="mdi-human-male-female-child"
          :no-action="true"
          v-for="(childRide, index) in form.childRideList"
          :key="index"
        >
          <template v-slot:activator>
            <v-list-item-subtitle>{{
              `${childRide.child.name}의 보호자 정보`
            }}</v-list-item-subtitle>
          </template>
          <div v-if="childRide.child.parentList.length != 0">
            <v-list-item-group
              v-for="(parents, j) in childRide.child.parentList"
              :key="j"
            >
              <v-list-item style="padding-left: 15%; padding-right: 8%">
                <v-list-item-icon>
                  <v-icon>mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ parents.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    parents.relation
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item style="padding-left: 15%; padding-right: 8%">
                <v-list-item-icon>
                  <v-icon
                    color="green"
                    v-clipboard:copy="parents.telephone"
                    v-clipboard:success="phoneCall"
                    >mdi-phone</v-icon
                  >
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ parents.telephone }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider
                v-if="index != childRide.child.parentList.length - 1"
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
        childRideList: [],
      },
      phoneNum: '',
    }
  },
  methods: {
    open(item) {
      this.visible = true
      this.form.childRideList = item
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
