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
.deleteButton {
  position: absolute;
  bottom: 20px; /* 부모 요소 하단에서의 거리 */
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  // background-color: #e53935;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
