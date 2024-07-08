<template>
  <v-dialog v-model="show" max-width="400px">
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
        <v-btn color="accent" text @click="updateParents">수정</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="red lighten-2" text @click="closeParents">닫기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { updateParents } from '@/api/api'
export default {
  data() {
    return {
      show: false,
      form: {
        id: '',
        name: '',
        telephone: '',
        relation: '',
      },
    }
  },
  methods: {
    showParents(payload) {
      this.show = true
      this.form.id = payload.id
      this.form.name = payload.name
      this.form.telephone = payload.telephone
      this.form.relation = payload.relation
    },
    closeParents() {
      this.show = false
      this.form.id = ''
      this.form.name = ''
      this.form.telephone = ''
      this.form.relation = ''
    },
    updateParents() {
      this.$withLoading(
        updateParents(this.form)
          .then((response) => {
            if (response.code == '0') {
              this.$emit('show-message', {
                type: 'success',
                message: '수정이 완료되었습니다.',
              })
              this.closeParents()
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
