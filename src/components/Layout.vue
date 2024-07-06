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
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"
        ><v-icon>mdi-menu</v-icon></v-app-bar-nav-icon
      >
      <v-toolbar-title>메뉴</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <v-container fluid>
        <error-dialog ref="errorDialog"></error-dialog>
        <router-view
          @show-error="showError"
          @show-alert="showAlert"
          @show-message="showMessage"
        />
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
      { title: 'dashboard', icon: 'mdi-view-dashboard', to: '/' },
      { title: 'ChildRegist', icon: 'mdi-image', to: '/ChildRegist' },
      { title: 'ChildrenList', icon: 'mdi-image', to: '/ChildrenList' },
    ],
    right: null,
  }),
  methods: {
    logout() {
      auth.logout()
    },
    showError(err) {
      this.$refs.errorDialog.showError(err)
    },
    showAlert(alert) {
      this.$emit('show-alert', alert)
    },
    showMessage(msg) {
      this.$emit('show-message', msg)
    },
  },
}
</script>

<style scoped></style>
