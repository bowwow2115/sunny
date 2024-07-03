<template>
  <div id="app">
    <v-app>
      <global-alert ref="alert"></global-alert>
      <router-view @show-alert="showAlert" @show-message="showMessage">
      </router-view>
      <global-snackbar ref="snackbar"></global-snackbar>
      <v-overlay :value="isLoading">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </v-app>
  </div>
</template>

<script>
import GlobalAlert from '@/views/GlobalAlert'
import GlobalSnackbar from '@/views/GlobalSnackbar.vue'

export default {
  name: 'App',
  components: { GlobalAlert, GlobalSnackbar },
  mounted() {},
  data() {
    return {
      isLoading: false,
    }
  },
  methods: {
    showAlert(alert) {
      this.$refs.alert.showAlert(alert)
    },
    showMessage(msg) {
      this.$refs.snackbar.showMessage(msg)
    },
  },
}
</script>

<style lang="scss">
@import './assets/styles/main.scss';
</style>
