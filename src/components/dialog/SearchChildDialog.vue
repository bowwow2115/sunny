<template>
  <v-dialog v-model="visible">
    <v-card class="pa-2">
      <v-card-title class="title">승하차등록</v-card-title>
      <v-list>
        <v-list-item-group v-model="selectedChild" multiple>
          <template>
            <v-card-actions>
              <v-text-field
                v-model="searchTerm"
                clearable
                flat
                solo-inverted
                hide-details
                prepend-inner-icon="ri-search-line"
                @input="searchList"
                label="이름 또는 반을 입력하세요."
              ></v-text-field>
              <div class="_btn-grp flex-nowrap">
                <v-btn color="gray" text large @click="cancel">닫기</v-btn>
                <v-btn color="accent" text large @click="confirm">추가</v-btn>
              </div>
            </v-card-actions>
            <div v-for="(child, index) in filteredList" :key="index">
              <v-list-item :value="child.id">
                <template v-slot:default="{ active }">
                  <v-list-item-content>
                    <v-list-item-title>{{ child.name }}</v-list-item-title>
                    <v-list-item-subtitle color="gray">{{
                      child.className
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-checkbox :value="active"></v-checkbox>
                  </v-list-item-action>
                </template>
              </v-list-item>
              <v-divider v-if="index < childList.length - 1"></v-divider>
              <v-list-item
                v-if="childList.length < 1"
                style="padding-left: 15%; padding-right: 8%"
              >
                <v-list-item-icon>
                  <v-icon>mdi-information-off</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>
                    등록된 원아의 정보가 없습니다.
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </div>
          </template>
        </v-list-item-group>
      </v-list>
    </v-card>
  </v-dialog>
</template>

<script>
import Hangul from 'hangul-js'
import { addChildRideList } from '@/api/api.js'

export default {
  data() {
    return {
      searchTerm: '',
      visible: false,
      resolve: null,
      reject: null,
      selectedChild: [],
      form: {},
      childList: [],
      meetingLocationName: '',
      meetingLocationId: '',
      filteredList: [],
    }
  },
  methods: {
    open(item) {
      console.log(item)
      this.visible = true
      this.childList = item.childList
      this.meetingLocationName = item.meetingLocationName
      this.meetingLocationId = item.meetingLocationId
      this.filteredList = item.childList
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    cancel() {
      this.visible = false
    },
    confirm() {
      let form = this.makeForm()
      this.$withLoading(
        addChildRideList(form)
          .then((response) => {
            if (response.code === '0') {
              this.visible = false
              this.resolve(response.data)
            }
          })
          .catch((e) => {
            this.$showError(e)
          })
      )
      this.visible = false
    },
    makeForm() {
      let form = []
      for (let childId of this.selectedChild) {
        let childRide = {}
        childRide.meetingLocation = {}
        childRide.meetingLocation.id = this.meetingLocationId
        childRide.child = {}
        childRide.child.id = childId
        form.push(childRide)
      }
      return form
    },
    searchList() {
      if (this.searchTerm == null || this.searchTerm == undefined) {
        this.filteredList = this.childList
        return
      }
      const input = this.searchTerm.trim()

      if (input === '') {
        this.filteredList = this.childList
        return
      }
      // 한글 초성 검색을 용이하게 하기 위해 Hangul 라이브러리 사용
      this.filteredList = this.childList.filter(
        (item) =>
          Hangul.search(item.name, input) !== -1 ||
          Hangul.search(item.className, input) !== -1
      )
    },
  },
}
</script>

<style></style>
