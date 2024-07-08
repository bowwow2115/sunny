<template>
  <v-app>
    <!-- <v-progress-circular
      :size="50"
      color="secondary"
      indeterminate
    ></v-progress-circular> -->
    <loading-bar :isLoading="isLoading" />
    <global-alert ref="alert"></global-alert>
    <router-view @show-alert="showAlert" @show-message="showMessage">
    </router-view>
    <global-snackbar ref="snackbar"></global-snackbar>
    <v-overlay :value="isLoading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-app>
</template>

<script>
import GlobalAlert from '@/components/GlobalAlert'
import GlobalSnackbar from '@/components/GlobalSnackbar.vue'
import LoadingBar from './components/LoadingBar.vue'
import { mapState } from 'vuex'

export default {
  name: 'App',
  components: { GlobalAlert, GlobalSnackbar, LoadingBar },
  mounted() {},
  computed: {
    ...mapState({
      isLoading: (state) => state.isLoading,
    }),
  },
  data() {
    return {
      // isLoading: false,
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
@import './assets/styles/sass/style.scss';
</style>
