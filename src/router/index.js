import { createRouter, createWebHashHistory } from 'vue-router'
import auth from '@/api/auth'
import constants from '@/Constants.js'
import store from '@/store/index.js'

const Layout = () => import('@/components/Layout')
const AdminMenu = () => import('@/components/admin/AdminMenu')
const SignUp = () => import('@/views/SignUp')
const SignIn = () => import('@/views/SignIn')
const ChildRegist = () => import('@/views/ChildRegist')
const FindId = () => import('@/views/FindId')
const ChildList = () => import('@/views/ChildList')
const RideTimeline = () => import('@/views/RideTimeline')
const SunnyHome = () => import('@/views/SunnyHome')
const RideTimelineTable = () => import('@/views/RideTimelineTable')

const routes = [
  {
    path: '/',
    redirect: { path: constants.DEFAULT_HOME },
  },
  {
    path: '/SignIn',
    name: 'SignIn',
    component: SignIn,
  },
  {
    path: '/SignUp',
    name: 'SignUp',
    component: SignUp,
  },
  {
    path: '/FindId',
    name: 'FindId',
    component: FindId,
  },
  {
    path: '/RideTimelineTable',
    name: 'RideTimelineTable',
    component: RideTimelineTable,
    meta: { requiresAuth: true },
  },
  {
    path: '/',
    component: Layout,
    redirect: { path: constants.DEFAULT_HOME },
    children: [
      {
        path: '/ChildRegist',
        name: 'ChildRegist',
        component: ChildRegist,
        meta: { requiresAuth: true },
      },
      {
        path: '/ChildList',
        name: 'ChildList',
        component: ChildList,
        meta: { requiresAuth: true },
      },
      {
        path: '/RideTimeline',
        name: 'RideTimeline',
        component: RideTimeline,
        meta: { requiresAuth: true },
      },
      {
        path: '/AdminMenu',
        name: 'AdminMenu',
        component: AdminMenu,
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: '/SunnyHome',
        name: 'SunnyHome',
        component: SunnyHome,
        meta: { requiresAuth: true },
      },
    ],
  },
  // Catch-all for unmatched routes - must be last
  {
    path: '/:pathMatch(.*)*',
    redirect: { path: constants.DEFAULT_HOME },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach(async (to, from) => {
  if (to.path === from.path) {
    return false // 현재 경로와 동일한 경우 네비게이션을 취소
  }
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin)
  if (requiresAuth) {
    let isValidate = await validate()
    if (isValidate) {
      return true // 인증되었으면 계속 진행
    } else {
      redirectLoginPage()
      return false
    }
  } else {
    if (!Utils.isNull(Utils.getToken())) {
      //로그인 시 인증필요없는 페이지 접속 x
      redirectHomePage()
      return false
    }
    return true // 인증이 필요 없는 페이지는 그대로 이동
  }
})

async function validate() {
  return await auth
    .loggedIn()
    .then((response) => {
      console.log(response)
      if (response.code == '0') {
        return true
      }
    })
    .catch((e) => {
      console.log(e)
      try {
        Utils.deleteCookie(constants.TOKEN)
      } catch (error) {
        console.log(`cookie: ${error}`)
      }
      redirectLoginPage()
      return false
    })
}

function redirectLoginPage() {
  router
    .push({
      path: '/SignIn',
    })
    .catch(() => {})

  // if (window.validateHandle) {
  //   clearInterval(window.validateHandle);
  //   window.validateHandle = null;
  // }
}

function redirectHomePage() {
  router.push({
    path: constants.DEFAULT_HOME,
  })
}

function getQueryString(location) {
  let uri = location.href.split('?')
  const getVars = {}
  if (uri.length == 2) {
    let vars = uri[1].split('&')
    let tmp = ''
    vars.forEach(function (v) {
      tmp = v.split('=')
      if (tmp.length == 2) getVars[tmp[0]] = tmp[1]
    })
  }

  return getVars
}

export default router
