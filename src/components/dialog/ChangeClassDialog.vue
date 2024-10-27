<template>
  <v-dialog v-model="visible">
    <v-card class="pa-2">
      <v-card-title class="title">{{
        isEdit ? '승하차 장소 정보 수정' : '승하차 장소 정보 추가'
      }}</v-card-title>
      <v-form v-model="isValid" ref="form" lazy-validation>
        <v-card-text>
          <v-row>
            <v-col cols="12" lg="6">
              <v-select
                prepend-inner-icon="ri-book-read-fill"
                :items="classList"
                v-model="form.className"
                label="반을 선택해주세요."
                :rules="nameRule"
                outlined
                clearable
                clear-icon="ri-close-circle-fill"
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="gray" text large @click="cancel">닫기</v-btn>
          <v-btn color="accent" text large @click="confirm">{{ '수정' }}</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { getClassList, updateChildrenClass } from '@/api/api'
export default {
  mounted() {
    this.getClassList()
  },
  data() {
    return {
      isValid: false,
      visible: false,
      resolve: null,
      reject: null,
      classList: [],
      form: {
        childrenList: [],
        className: '',
      },
      isEdit: false,
      nameRule: [(v) => !!v || '필수 항목입니다.'],
    }
  },
  methods: {
    open(item) {
      this.visible = true
      console.log(item)
      this.form.childrenList = item
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    cancel() {
      this.visible = false
    },
    async confirm() {
      if (this.$refs.form.validate()) {
        const result = await this.$confirm({
          message: `정말 ${this.form.childrenList.length}명의 원아을 ${this.form.className}으로 변경시키곘습니까?`,
        })
        if (!result) return
        this.$withLoading(
          updateChildrenClass(this.form.childrenList, this.form.className)
            .then((response) => {
              if (response.code == '0') {
                this.visible = false
                this.resolve(response.data)
              }
            })
            .catch((e) => {
              this.$showError(e)
            })
        )
      }
    },
    getClassList() {
      getClassList().then((response) => {
        if (response.code == 0) {
          this.classList = response.data.map(
            (element, index, array) => element.name
          )
        }
      })
    },
  },
}
</script>

<style scoped>
/* 원하는 스타일 추가 */
</style>
