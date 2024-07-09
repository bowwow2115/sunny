<template>
  <v-app>
    <loading-bar :isLoading="isLoading" />
    <router-view> </router-view>
    <!-- <v-overlay :value="isLoading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay> -->
  </v-app>
</template>

<script>
export default {
  name: 'App',
  mounted() {},
  computed: {},
  data() {
    return {
      // isLoading: false,
    }
  },
  methods: {},
}
</script>

<style lang="scss">
@import './assets/styles/sass/style.scss';
</style>
