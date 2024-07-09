<template>
  <v-dialog v-model="visible" max-width="400px">
    <v-card>
      <v-card-title class="headline">부모정보수정</v-card-title>
      <v-card-text>
        <v-text-field
          prepend-icon="mdi-account"
          v-model="form.name"
          clearable
        ></v-text-field>
        <v-text-field
          prepend-icon="mdi-account-multiple"
          v-model="form.relation"
          clearable
        ></v-text-field>
        <v-text-field
          prepend-icon="mdi-phone"
          color="green"
          v-model="form.telephone"
          clearable
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="accent" text @click="confirm">수정</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="red lighten-2" text @click="cancel">닫기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { updateParents } from '@/api/api'
export default {
  data() {
    return {
      visible: false,
      resolve: null,
      reject: null,
      form: {
        id: '',
        name: '',
        telephone: '',
        relation: '',
      },
    }
  },
  methods: {
    open({ id, name, telephone, relation }) {
      this.visible = true
      this.form.id = id
      this.form.name = name
      this.form.telephone = telephone
      this.form.relation = relation
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    cancel() {
      this.visible = false
      this.reject(false)
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
            this.$emit('show-error', e)
          })
      )
    },
  },
}
</script>

<style scoped>
/* 원하는 스타일 추가 */
</style>
