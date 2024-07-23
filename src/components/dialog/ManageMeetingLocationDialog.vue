<template>
  <v-dialog v-model="visible" max-width="400px">
    <v-card>
      <v-toolbar color="primary" dark>
        <v-toolbar-title>
          {{ `${this.form.name} 원아 추가 삭제` }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="cancel">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-list>
        <v-subheader>등록된 원아</v-subheader>
        <div v-if="form.childRideList.length != 0">
          <v-list-item-group
            v-for="(childRide, index) in form.childRideList"
            :key="index"
          >
            <v-list-item style="padding-left: 15%; padding-right: 8%">
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{
                  childRide.child.name
                }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  childRide.child.className
                }}</v-list-item-subtitle>
                <v-spacer></v-spacer>
                <v-list-item-icon @click="deleteChild(childRide.child)">
                  <v-icon color="red darken3">mdi-minus</v-icon>
                </v-list-item-icon>
              </v-list-item-content>
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
      </v-list>
    </v-card>
  </v-dialog>
</template>

<script>
import {} from '@/api/api'
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
      this.id = item.id
      this.name = item.name
      this.time = item.time
      this.childRideList = item.childRideList
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
      this.resolve()
    },
  },
}
</script>

<style scoped>
/* 원하는 스타일 추가 */
</style>
