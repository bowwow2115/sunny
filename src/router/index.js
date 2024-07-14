import Vue from 'vue'
import Router from 'vue-router'
import auth from '@/api/auth'
import constants from '@/Constants.js'

const Layout = () => import('@/components/Layout')
const AdminLayout = () => import('@/components/admin/AdminLayout')
const SignUp = () => import('@/views/SignUp')
const SignIn = () => import('@/views/SignIn')
const ChildRegist = () => import('@/views/ChildRegist')
const FindId = () => import('@/views/FindId')
const ChildrenList = () => import('@/views/ChildrenList')
const RideTimeline = () => import('@/views/RideTimeline')

Vue.use(Router)

const router = new Router({
  // mode: 'history',   //WAS에 배포할 때는 주석처리
  routes: [
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
    // {
    //   path: 'admin/:id?/:secondId?',
    //   name: 'AdminLayout',
    //   component: AdminLayout,
    //   meta: {
    //     requiresAuth: true,
    //     requiresAdmin: true,
    //     name: ':nm?',
    //   },
    // },
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
          path: '/ChildrenList',
          name: 'ChildrenList',
          component: ChildrenList,
          meta: { requiresAuth: true },
        },
        {
          path: '/RideTimeline',
          name: 'RideTimeline',
          component: RideTimeline,
          meta: { requiresAuth: true },
        },
      ],
    },
    // {
    //   path: '/notAuthorized',
    //   name: 'NotAuthorized',
    //   component: NotAuthorized
    // },
    // {
    //   path: '/not-found',
    //   name: 'NotFound',
    //   component: NotFound
    // },
    // {
    //   path: '*',
    //   redirect: (to) => {
    //     // 특정 URL을 제외하고 모든 경로를 /not-found로 리디렉션
    //     if (to.path.startsWith('/specific-path')) {
    //       return to.path; // 예외 경로는 리디렉션하지 않음
    //     } else {
    //       return '/not-found'; // 나머지 모든 경로는 /not-found로 리디렉션
    //     }
    //   }
    // },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.path === from.path) {
    next(false) // 현재 경로와 동일한 경우 네비게이션을 취소
  }
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin)
  if (requiresAuth) {
    ;(async () => {
      let isValidate = await validate()
      if (isValidate) {
        next()
      } else {
        redirectLoginPage()
      }
    })()
  } else {
    if (!Utils.isNull(Utils.getToken())) {
      //로그인 시 인증필요없는 페이지 접속 x
      redirectHomePage()
    }
    next() // 인증이 필요 없는 페이지는 그대로 이동
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
