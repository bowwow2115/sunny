<template>
  <v-dialog v-model="visible" max-width="400px">
    <v-card>
      <v-toolbar color="primary" dark>
        <v-toolbar-title>
          {{ form.meetingLocationName }} 원아등록
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </v-toolbar>
      <v-list>
        <v-list-item-group v-model="selectedChild" active-class="info" multiple>
          <template v-for="(child, index) in form.childList">
            <v-list-item :key="index">
              <template v-slot:default="{ active }">
                <v-list-item-content>
                  <v-list-item-title>{{ child.name }}</v-list-item-title>
                  <v-list-item-subtitle class="text--primary">{{
                    child.class
                  }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-checkbox :value="active"></v-checkbox>
                </v-list-item-action>
              </template>
            </v-list-item>
            <v-divider
              v-if="index < form.childList.length - 1"
              :key="index"
            ></v-divider>
          </template>
          <!-- <v-list-item v-else style="padding-left: 15%; padding-right: 8%">
            <v-list-item-icon>
              <v-icon>mdi-information-off</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                등록된 원아의 정보가 없습니다.
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item> -->
        </v-list-item-group>
      </v-list>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      selectedChild: [],
      visible: false,
      resolve: null,
      reject: null,
      form: {
        childList: [],
        meetingLocationName: '',
      },
    }
  },
  methods: {
    open(item) {
      console.log(item)
      this.visible = true
      this.form.childList = item.childList
      this.form.meetingLocationName = item.meetingLocationName
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
