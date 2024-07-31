<template>
  <v-app>
    <!-- 상단 bar -->
    <v-app-bar fixed elevate-on-scroll class="elevation-4">
      <v-app-bar-nav-icon @click="drawer = !drawer">
        <v-icon>mdi-menu</v-icon>
      </v-app-bar-nav-icon>
      <v-toolbar-title class="text-subtitle-1 font-weight-bold pl-0">{{
        currentTitle
      }}</v-toolbar-title>
    </v-app-bar>

    <!-- 메뉴 navi -->
    <v-navigation-drawer v-model="drawer" app>
      <!-- 메뉴 navi - home title -->
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">Sunny</v-list-item-title>
          <v-list-item-subtitle>해맑은</v-list-item-subtitle>
        </v-list-item-content>
        <v-btn @click="logout"> 로그아웃 </v-btn>
      </v-list-item>

      <v-list dense nav>
        <v-list-item v-for="item in items" :key="item.title" link :to="item.to">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="text-subtitle-1">{{
              item.title
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script>
import auth from '@/api/auth'
import ErrorDialog from '@/components/dialog/ErrorDialog.vue'

export default {
  name: 'Layout',
  components: { ErrorDialog },
  data() {
    return {
      drawer: false,
      isScrolled: false, // 스크롤 상태 추적
      items: [
        {
          title: '원아등록',
          icon: 'mdi-image',
          to: '/ChildRegist',
          name: 'ChildRegist',
        },
        {
          title: '원아조회',
          icon: 'mdi-image',
          to: '/ChildList',
          name: 'ChildList',
        },
        {
          title: '차량운행조회',
          icon: 'mdi-image',
          to: '/RideTimeline',
          name: 'RideTimeline',
        },
      ],
    }
  },
  computed: {
    currentTitle() {
      const currentRouteName = this.$route.name
      const item = this.items.find((item) => item.name === currentRouteName)
      return item ? item.title : '메뉴'
    },
  },
  methods: {
    logout() {
      auth.logout()
    },
  },
}
</script>
