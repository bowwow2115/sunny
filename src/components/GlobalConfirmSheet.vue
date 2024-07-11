<template>
  <div class="text-center">
    <v-btn color="blue" dark @click="sheet = !sheet"> Open v-model </v-btn>
    <v-bottom-sheet v-model="sheet" inset>
      <v-sheet class="text-center" height="150px">
        <div class="py-3">
          {{ form.message }}
        </div>
        <v-spacer></v-spacer>
        <v-row style="padding: 20px">
          <v-spacer></v-spacer>
          <v-btn class="mt-6" text color="green" @click="confirm"> 확인 </v-btn>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-btn class="mt-6" text color="red" @click="cancel"> 닫기 </v-btn>
          <v-spacer></v-spacer>
        </v-row>
      </v-sheet>
    </v-bottom-sheet>
  </div>
</template>
<script>
export default {
  data() {
    return {
      sheet: false,
      resolve: null,
      reject: null,
      form: {
        type: '',
        message: '',
      },
    }
  },
  methods: {
    open(item) {
      this.sheet = true
      this.form.message = item.message
      this.form.type = item.type
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    confirm() {
      this.sheet = false
      this.resolve(true)
    },
    cancel() {
      this.sheet = false
      this.resolve(false)
    },
  },
}
</script>

<style></style>
