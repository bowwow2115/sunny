<template>
  <v-dialog v-model="visible" max-width="400px">
    <v-card>
      <v-card-title class="headline">{{
        isEdit ? '보호자 정보 수정' : '보호자 정보 추가'
      }}</v-card-title>
      <v-card-text>
        <v-text-field
          prepend-icon="mdi-account"
          v-model="form.name"
          label="보호자의 이름을 입력해주세요."
          clearable
        ></v-text-field>
        <v-select
          prepend-icon="mdi-account-multiple"
          v-model="form.relation"
          :items="parentTypeList"
          label="보호자와의 관계를 입력해주세요."
          clearable
        ></v-select>
        <v-text-field
          prepend-icon="mdi-phone"
          color="green"
          v-model="form.telephone"
          label="보호자의 전화번호를 입력해주세요."
          clearable
        ></v-text-field>
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
import { updateParents, addParents } from '@/api/api'
export default {
  mounted() {},
  data() {
    return {
      visible: false,
      resolve: null,
      reject: null,
      form: {
        id: '',
        childId: '',
        name: '',
        telephone: '',
        relation: '',
      },
      isEdit: false,
      parentTypeList: ['부', '모', '조부', '조모', '그 외'],
    }
  },
  methods: {
    open(item) {
      this.visible = true
      this.form.id = item.id
      this.form.name = item.name
      this.form.telephone = item.telephone
      this.form.relation = item.relation
      this.form.childId = item.childId
      this.isEdit = item.isEdit
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    cancel() {
      this.visible = false
    },
    confirm() {
      if (this.isEdit) {
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
      } else {
        this.$withLoading(
          addParents(this.form)
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
  },
}
</script>

<style scoped>
/* 원하는 스타일 추가 */
</style>
