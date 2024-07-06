<template>
  <v-dialog v-model="infoBox.show" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="text-h5">부모 & 차량정보</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="4" sm="2" md="1">
              <v-text-field label="이름" required></v-text-field>
            </v-col>
            <v-col cols="4" sm="2" md="1">
              <v-text-field label="Legal middle name"></v-text-field>
            </v-col>
            <v-col cols="4" sm="2" md="1">
              <v-text-field
                label="Legal last name*"
                persistent-hint
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field label="Email*" required></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Password*"
                type="password"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                :items="['0-17', '18-29', '30-54', '54+']"
                label="Age*"
                required
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-autocomplete
                :items="[
                  'Skiing',
                  'Ice hockey',
                  'Soccer',
                  'Basketball',
                  'Hockey',
                  'Reading',
                  'Writing',
                  'Coding',
                  'Basejump',
                ]"
                label="Interests"
                multiple
              ></v-autocomplete>
            </v-col>
          </v-row>
        </v-container>
        <small>*indicates required field</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeInfo"> Close </v-btn>
        <v-btn color="blue darken-1" text @click="closeInfo"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ParentRideInfo',
  data() {
    return {
      infoBox: {
        show: false,
        parentList: [],
        amRide: {},
        pmRide: {},
      },
    }
  },
  methods: {
    showInfo(payload) {
      this.infoBox.show = true
      this.infoBox.parentList = payload.parentList
      this.infoBox.amRide = payload.amRide
      this.infoBox.pmRide = payload.pmRide
    },
    closeInfo() {
      this.infoBox.show = false
      this.infoBox.code = ''
      this.infoBox.message = ''
    },
    onDialogInput(value) {
      if (!value) {
        this.closeError()
      }
    },
  },
}
</script>

<style scoped>
/* 원하는 스타일 추가 */
</style>
