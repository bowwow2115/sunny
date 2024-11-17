<template>
  <v-dialog v-model="visible">
    <v-card class="pa-2">
      <v-card-title class="title">보호자 정보</v-card-title>
      <v-list class="pa-0">
        <div v-if="form.childRideList.length != 0">
          <v-list-group
            :value="index == 0 ? true : false"
            prepend-icon="ri-parent-fill"
            :no-action="true"
            v-for="(childRide, index) in form.childRideList"
            :key="index"
          >
            <template v-slot:activator>
              <v-list-item-title>{{
                `${childRide.child.name}의 보호자 정보`
              }}</v-list-item-title>
            </template>
            <div v-if="childRide.child.parentList.length != 0">
              <v-list-item-group
                v-for="(parents, j) in childRide.child.parentList"
                :key="j"
                class="ml-14"
              >
                <v-list-item>
                  <v-list-item-icon>
                    <span class="_list-icon _list-icon-ko">{{
                      parents.relation
                    }}</span>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title class="_list-title-with-sub"
                      >{{ parents.name }}
                      <span>
                        <v-icon
                          color="gray"
                          v-clipboard:copy="parents.telephone"
                          v-clipboard:success="phoneCall"
                          >ri-phone-fill</v-icon
                        >
                        {{ parents.telephone }}
                      </span>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-divider
                  v-if="index != childRide.child.parentList.length - 1"
                ></v-divider>
              </v-list-item-group>
            </div>
            <v-list-item v-else>
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
        </div>
        <v-list-item v-else>
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
      <v-card-actions class="flex-wrap justify-end py-4 px-6">
        <v-btn color="gray" text @click="cancel" large>닫기</v-btn>
      </v-card-actions>
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
