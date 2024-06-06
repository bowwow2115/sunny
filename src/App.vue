<template>
  <v-app>
    <v-navigation-drawer app>
      <!-- -->
    </v-navigation-drawer>

    <!-- 상단 bar -->
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Vuetify</v-toolbar-title>

      <v-spacer></v-spacer>
    </v-app-bar>

    <!-- 메뉴 navi -->
    <v-navigation-drawer v-model="drawer" app>

      <!-- 메뉴 navi - home title -->
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">Sunny</v-list-item-title>
          <v-list-item-subtitle>해맑은</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider />

      <!-- 메뉴 navi - list -->
      <v-list dense nav>
        <v-list-item
          v-for="item in items" :key="item.title"
          link :to="item.to">
          <v-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

    </v-navigation-drawer>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <router-view />
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue';

export default {
  name: 'App',
  components: {},

  data: () => ({
    drawer: false,
    items: [
      { title: 'dashboard', icon: 'mdi-view-dashboard', to: '/'},
      { title: 'HelloWorld', icon: 'mdi-image', to: '/helloworld' },
    ],
    right: null,
  }),
};
</script>

<style scoped></style>