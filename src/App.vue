<template>
  <div id="app">
    <v-app>
      <error-dialog></error-dialog>
      <global-alert></global-alert>
      <router-view> </router-view>
      <v-overlay :value="isLoading">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </v-app>
  </div>
</template>

<script>
import ErrorDialog from '@/views/ErrorDialog'
import GlobalAlert from '@/views/GlobalAlert'

export default {
  name: 'App',
  components: { ErrorDialog, GlobalAlert },
  mounted() {},
  data() {
    return {
      isLoading: false,
    }
  },
}
</script>

<style lang="scss">
@import './assets/styles/main.scss';
</style>
