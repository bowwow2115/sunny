<template>
  <v-app>
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

      <v-divider /><!--구분선-->

      <!-- 메뉴 navi - list -->
      <v-list dense nav>
        <v-list-item v-for="item in items" :key="item.title" link :to="item.to">
          <v-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- 상단 bar -->
    <v-app-bar
      absolute
      color="#43a047"
      dark
      shrink-on-scroll
      prominent
      src="https://picsum.photos/1920/1080?random"
      fade-img-on-scroll
      scroll-target="#scrolling-techniques-5"
      scroll-threshold="500"
    >
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(55,236,186,.7), rgba(25,32,72,.7)"
        ></v-img>
      </template>
      <v-app-bar-nav-icon @click="drawer = !drawer"
        ><v-icon>mdi-menu</v-icon></v-app-bar-nav-icon
      >
      <v-toolbar-title>메뉴</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-sheet
      id="scrolling-techniques-5"
      class="overflow-y-auto"
      max-height="600"
    >
    </v-sheet>

    <!-- Sizes your content based upon application components -->
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
  data: () => ({
    drawer: false,
    items: [
      { title: '원아등록', icon: 'mdi-image', to: '/ChildRegist' },
      { title: '원아조회', icon: 'mdi-image', to: '/ChildList' },
      { title: '차량운행조회', icon: 'mdi-image', to: '/RideTimeline' },
    ],
    right: null,
  }),
  methods: {
    logout() {
      auth.logout()
    },
  },
}
</script>

<style scoped></style>
