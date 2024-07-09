<template>
  <v-app>
    <router-view> </router-view>
    <v-overlay :value="isLoading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'App',
  mounted() {},
  computed: {
    ...mapState({
      isLoading: (state) => state.isLoading,
    }),
  },
  data() {
    return {}
  },
  methods: {},
}
</script>

<style lang="scss">
@import './assets/styles/sass/style.scss';
</style>
