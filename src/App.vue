<template>
  <div id="app">
    <router-view></router-view>
    <v-overlay :value="isLoading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
//import HelloWorld from './components/childRegist.vue';

export default {
  name: 'App',
  components: {},
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
