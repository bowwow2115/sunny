import { h, defineComponent } from 'vue'
import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
  type RouteLocationNormalized,
} from 'vue-router'
import auth from '@/api/auth'
import constants from '@/Constants'
import store from '@/store'
import Utils from '@/utils/utils'

function withLoadingError(
  importFn: () => Promise<any>,
  componentName: string
): () => Promise<any> {
  return async () => {
    try {
      return await importFn()
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error))
      console.error(`[Router] Failed to load ${componentName}:`, err)
      return defineComponent({
        setup() {
          return () =>
            h('div', { class: 'pa-8 text-center' }, [
              h('v-icon', {
                icon: 'ri-error-warning-fill',
                color: 'error',
                size: '48',
              }),
              h(
                'h3',
                { class: 'text-h6 mt-4' },
                `${componentName} 로딩 실패`
              ),
              h('p', { class: 'text-grey mt-2' }, err.message),
              h(
                'v-btn',
                {
                  color: 'primary',
                  class: 'mt-4',
                  onClick: () => window.location.reload(),
                },
                '새로고침'
              ),
            ])
        },
      })
    }
  }
}

const Layout = withLoadingError(
  () => import('@/components/Layout.vue'),
  'Layout'
)
const AdminMenu = withLoadingError(
  () => import('@/components/admin/AdminMenu.vue'),
  'AdminMenu'
)
const SignUp = withLoadingError(() => import('@/views/SignUp.vue'), 'SignUp')
const SignIn = withLoadingError(() => import('@/views/SignIn.vue'), 'SignIn')
const ChildRegist = withLoadingError(
  () => import('@/views/ChildRegist.vue'),
  'ChildRegist'
)
const FindId = withLoadingError(() => import('@/views/FindId.vue'), 'FindId')
const ChildList = withLoadingError(
  () => import('@/views/ChildList.vue'),
  'ChildList'
)
const RideTimeline = withLoadingError(
  () => import('@/views/RideTimeline.vue'),
  'RideTimeline'
)
const SunnyHome = withLoadingError(
  () => import('@/views/SunnyHome.vue'),
  'SunnyHome'
)
const RideTimelineTable = withLoadingError(
  () => import('@/views/RideTimelineTable.vue'),
  'RideTimelineTable'
)

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: { name: 'SunnyHome' } },
  { path: '/SignIn', name: 'SignIn', component: SignIn, meta: { requiresAuth: false } },
  { path: '/SignUp', name: 'SignUp', component: SignUp, meta: { requiresAuth: false } },
  { path: '/FindId', name: 'FindId', component: FindId, meta: { requiresAuth: false } },
  {
    path: '/RideTimelineTable',
    name: 'RideTimelineTable',
    component: RideTimelineTable,
    meta: { requiresAuth: true, layout: 'blank' },
  },
  {
    path: '/',
    component: Layout,
    redirect: { name: 'SunnyHome' },
    children: [
      { path: 'ChildRegist', name: 'ChildRegist', component: ChildRegist, meta: { requiresAuth: true } },
      { path: 'ChildList', name: 'ChildList', component: ChildList, meta: { requiresAuth: true } },
      { path: 'RideTimeline', name: 'RideTimeline', component: RideTimeline, meta: { requiresAuth: true } },
      { path: 'AdminMenu', name: 'AdminMenu', component: AdminMenu, meta: { requiresAuth: true, requiresAdmin: true } },
      { path: 'SunnyHome', name: 'SunnyHome', component: SunnyHome, meta: { requiresAuth: true } },
    ],
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', redirect: { name: 'SunnyHome' } },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  },
})

router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  if (to.fullPath === from.fullPath) return

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin)

  if (requiresAuth) {
    const isAuthenticated = await validateAuth()

    if (isAuthenticated) {
      if (requiresAdmin && !store.getters.isAdmin) {
        return { name: constants.DEFAULT_HOME || 'SunnyHome' }
      }
      return true
    }
    return {
      name: 'SignIn',
      query: { redirect: to.fullPath },
    }
  }

  const hasToken = !Utils.isNull(Utils.getToken())
  if (hasToken && !['SignIn', 'SignUp', 'FindId'].includes(to.name as string)) {
    return { name: constants.DEFAULT_HOME || 'SunnyHome' }
  }

  return true
})

async function validateAuth(): Promise<boolean> {
  try {
    const response = await auth.loggedIn()
    if (response?.code === '0' || response?.code === 0) return true
    return false
  } catch (error) {
    console.warn('Auth validation failed:', error)
    try {
      Utils.deleteCookie?.(constants.TOKEN)
      store.commit?.('SET_USERID', '')
      store.commit?.('SET_ADMIN', false)
    } catch (e) {
      console.error('Cookie cleanup error:', e)
    }
    return false
  }
}

router.afterEach((to) => {
  const titles: Record<string, string> = {
    SignIn: '로그인 - 해맑은 어린이집',
    SignUp: '회원가입 - 해맑은 어린이집',
    SunnyHome: '홈 - 해맑은 어린이집',
    ChildList: '원아관리 - 해맑은 어린이집',
    RideTimeline: '차량운행관리 - 해맑은 어린이집',
  }

  const baseTitle = '해맑은 어린이집'
  document.title = titles[to.name as string] || baseTitle

  if (store.state?.isLoading) {
    store.commit?.('SET_LOADING', false)
  }
})

export function getQueryString(
  location: string = window.location.href
): Record<string, string> {
  const url = new URL(location)
  return Object.fromEntries(url.searchParams.entries())
}

export default router
