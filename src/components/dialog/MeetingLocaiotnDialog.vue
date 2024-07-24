<template>
  <v-dialog v-model="visible" max-width="400px">
    <v-card>
      <v-card-title color="primary" class="headline">{{
        `${form.name} 정보 수정`
      }}</v-card-title>
      <v-card-text>
        <v-text-field
          prepend-icon="mdi-map-marker-radius"
          v-model="form.name"
          label="장소의 이름을 입력해주세요."
          clearable
        ></v-text-field>
        <v-select
          prepend-icon="mdi-account-multiple"
          v-model="form.time"
          :items="parentTypeList"
          label="보호자와의 관계를 입력해주세요."
          clearable
        ></v-select>
      </v-card-text>
      <v-card-actions>
        <v-btn color="accent" text @click="confirm">{{
          isEdit ? '수정' : '추가'
        }}</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="red lighten-2" text @click="cancel">닫기</v-btn>
      </v-card-actions>
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
      },
    }
  },
  methods: {
    open(item) {
      this.visible = true
      this.form.id = item.id
      this.form.name = item.name
      this.form.time = item.time
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
        updateParents(this.form)
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
