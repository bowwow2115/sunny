<template>
  <v-dialog v-model="parentsBox.show" max-width="400px">
    <v-card>
      <v-card-title class="headline">부모정보수정</v-card-title>
      <v-card-text>
        <v-text-field
          prepend-icon="mdi-account"
          v-model="parentsBox.name"
          clearable
        ></v-text-field>
        <v-text-field
          prepend-icon="mdi-account"
          v-model="parentsBox.name"
          clearable
        ></v-text-field>
        <v-text-field
          prepend-icon="mdi-account"
          v-model="parentsBox.name"
          clearable
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red lighten-2" text @click="closeParents">닫기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      parentsBox: {
        show: false,
        name: '',
        telephone: '',
        relation: '',
      },
    }
  },
  methods: {
    showParents(payload) {
      this.parentsBox.show = true
      this.parentsBox.name = payload.name
      this.parentsBox.telephone = payload.telephone
      this.parentsBox.relation = payload.relation
    },
    closeParents() {
      this.parentsBox.show = false
      this.parentsBox.name = ''
      this.parentsBox.telephone = ''
      this.parentsBox.relation = ''
    },
  },
}
</script>

<style scoped>
/* 원하는 스타일 추가 */
</style>
