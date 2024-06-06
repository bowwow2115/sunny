<template>
  <v-container fluid><!-- fluid(100%) 없으면 자동 반응형 container 설정너비 -->
    <v-card class="pa-3">
      <v-row>
        <v-col>
          <v-card class="pa-3" outlined>
            col
          </v-card>
        </v-col>
        <v-col>
          <v-card class="pa-3" outlined>
            col
          </v-card>
        </v-col>
        <v-col>
          <v-card class="pa-3" outlined>
            col
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card class="pa-3" outlined>
            col
          </v-card>
        </v-col>
        <v-col>
          <v-card class="pa-3" outlined>
            col
          </v-card>
        </v-col>
        <v-col>
          <v-card class="pa-3" outlined>
            col
          </v-card>
        </v-col>
      </v-row>
    </v-card>

  </v-container>

</template>

<script>
export default {
  name: 'HelloWorld',
  components: {},
  data: () => ({
    //
  })
}
</script>

<style scoped></style>
