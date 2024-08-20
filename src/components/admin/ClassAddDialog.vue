<template>
  <v-dialog v-model="visible" max-width="400px">
    <v-card>
      <v-card-title color="primary" class="headline">반 추가</v-card-title>
      <v-card-text>
        <v-text-field
          prepend-icon="mdi-account"
          v-model="form.name"
          label="반 이름을 입력해주세요."
          clearable
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="accent" text @click="confirm">추가</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="red lighten-2" text @click="cancel">닫기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { addClass } from '@/api/api'
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
      },
      isEdit: false,
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
    },
    confirm() {
      this.$withLoading(
        addClass(this.form)
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
    },
  },
}
</script>

<style scoped>
/* 원하는 스타일 추가 */
</style>
