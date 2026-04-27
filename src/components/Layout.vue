<template>
  <v-app>
    <!-- ✅ 상단 앱 바 -->
    <v-app-bar :elevation="isScrolled ? 4 : 1" class="px-2">
      <!-- ✅ 모바일 메뉴 토글 버튼 (v-app-bar-nav-icon 사용) -->
      <v-app-bar-nav-icon
        variant="text"
        @click.stop="toggleDrawer"
        class="d-md-none"
        data-testid="menu-toggle"
      >
        <v-icon icon="ri-menu-fill"></v-icon>
      </v-app-bar-nav-icon>

      <!-- 로고/타이틀 -->
      <v-app-bar-title class="text-subtitle-1 font-weight-bold">
        <span class="me-2">Sunny</span>
        <span class="text-grey">|</span>
        <span class="ms-2">{{ currentTitle }}</span>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <!-- 데스크탑 로그아웃 버튼 -->
      <v-btn
        v-if="mdAndUp"
        variant="text"
        color="grey"
        size="small"
        @click="handleLogout"
      >
        <v-icon icon="ri-logout-box-r-fill" start></v-icon>
        로그아웃
      </v-btn>
    </v-app-bar>

    <!-- ✅ 사이드 네비게이션 드로어 -->
    <v-navigation-drawer
      v-model="drawer"
      :temporary="!mdAndUp"
      :permanent="mdAndUp"
      :rail="isRail && mdAndUp"
      expand-on-hover
      class="_nav-drawer"
      data-testid="nav-drawer"
    >
      <!-- 드로어 헤더 -->
      <v-list-item
        prepend-icon="ri-sun-fill"
        title="Sunny"
        subtitle="해맑은 어린이집"
        class="_drawer-header"
      >
        <template v-slot:append>
          <v-btn
            v-if="mdAndUp"
            icon
            size="small"
            variant="text"
            @click="handleLogout"
          >
            <v-icon icon="ri-logout-box-r-fill" color="grey"></v-icon>
          </v-btn>
        </template>
      </v-list-item>

      <v-divider></v-divider>

      <!-- 네비게이션 메뉴 -->
      <v-list density="compact" nav>
        <v-list-item
          v-for="(item, index) in menuItems"
          :key="index"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          :active="isActiveRoute(item)"
          link
          @click="!mdAndUp && (drawer = false)"
        >
          <template v-slot:prepend>
            <v-icon
              :icon="item.icon"
              :color="isActiveRoute(item) ? 'primary' : 'default'"
              size="20"
            ></v-icon>
          </template>
        </v-list-item>
      </v-list>

      <!-- 모바일 로그아웃 (드로어 하단) -->
      <template v-slot:append>
        <v-list-item
          v-if="!mdAndUp"
          prepend-icon="ri-logout-box-r-fill"
          title="로그아웃"
          @click="handleLogout"
        ></v-list-item>
      </template>
    </v-navigation-drawer>

    <!-- ✅ 메인 콘텐츠 -->
    <v-main>
      <v-container fluid class="pa-4 pa-md-6">
        <router-view v-slot="{ Component, route }">
          <transition name="fade" mode="out-in">
            <component :is="Component" :key="route.fullPath" v-if="Component" />
          </transition>
        </router-view>
      </v-container>
    </v-main>

    <!-- ✅ 푸터 -->
    <v-footer app class="text-center text-body-2 text-grey">
      <span>© {{ currentYear }} 해맑은 어린이집. All rights reserved.</span>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
defineOptions({ name: 'AppLayout' })
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'
import auth from '@/api/auth'

interface MenuItem {
  title: string
  icon: string
  to: string
  name: string
}

const route = useRoute()
const { mdAndUp } = useDisplay()

const drawer = ref(false)
const isScrolled = ref(false)
const isRail = ref(false)

const menuItems: MenuItem[] = [
  { title: '홈', icon: 'ri-home-5-fill', to: '/SunnyHome', name: 'SunnyHome' },
  {
    title: '원아등록',
    icon: 'ri-user-shared-2-fill',
    to: '/ChildRegist',
    name: 'ChildRegist',
  },
  {
    title: '원아관리',
    icon: 'ri-user-search-fill',
    to: '/ChildList',
    name: 'ChildList',
  },
  {
    title: '차량운행관리',
    icon: 'ri-bus-2-fill',
    to: '/RideTimeline',
    name: 'RideTimeline',
  },
]

// ✅ 현재 연도
const currentYear = computed(() => new Date().getFullYear())

// ✅ 현재 페이지 제목
const currentTitle = computed(() => {
  const item = menuItems.find((i) => i.name === route.name)
  return item?.title || '해맑은 어린이집'
})

const isActiveRoute = (item: MenuItem): boolean => {
  return route.name === item.name || route.path.startsWith(item.to)
}

const toggleDrawer = () => {
  drawer.value = !drawer.value
}

const handleLogout = () => {
  auth.logout()
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}

// ✅ 데스크탑에서는 드로어 항상 열림
watch(mdAndUp, (newValue) => {
  if (newValue) {
    drawer.value = true
    isRail.value = false
  } else {
    drawer.value = false
    isRail.value = false
  }
  console.log(
    'Device changed to:',
    newValue ? 'Desktop' : 'Mobile',
    'Drawer:',
    drawer.value
  )
})

// ✅ 마운트/언마운트
onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })

  // ✅ 초기 상태 설정
  if (mdAndUp.value) {
    drawer.value = true
  }

  console.log('Layout mounted:', {
    isMobile: !mdAndUp.value,
    drawer: drawer.value,
    route: route.fullPath,
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped lang="scss">
/* ========== 네비게이션 드로어 ========== */
._nav-drawer {
  :deep(.v-list-item-title) {
    transition: opacity 0.2s;
  }

  :deep(.v-navigation-drawer--rail) {
    .v-list-item-title {
      opacity: 0;
    }
  }
}

._drawer-header {
  min-height: 64px;
}

/* ========== 페이지 전환 애니메이션 ========== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

/* ========== 스크롤바 스타일 ========== */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
</style>
