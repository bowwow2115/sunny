<template>
  <div id="app">
    <v-app>
      <error-dialog></error-dialog>
      <router-view> </router-view>
      <v-overlay :value="isLoading">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </v-app>
  </div>
</template>

<script>
import ErrorDialog from '@/views/ErrorDialog'

export default {
  name: 'App',
  components: { ErrorDialog },
  mounted() {
    // setTimeout(() => {
    //   this.isLoading = true;
    // }, 800);
  },
  data() {
    return {
      isLoading: false,
    }
  },
}
</script>

<style scoped></style>
