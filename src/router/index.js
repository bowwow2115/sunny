import Vue from 'vue'
import Router from 'vue-router'
import auth from '@/api/auth'
import constants from '@/Constants.js'

const signUp = () => import('@/components/signUp')
const signIn = () => import('@/components/signIn')
const childRegist = () => import('@/components/childRegist')
const findId = () => import('@/components/findId')
const Layout = () => import('@/components/Layout')

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: { path: constants.DEFAULT_HOME },
    },
    {
      path: '/signIn',
      name: 'signIn',
      component: signIn,
    },
    {
      path: '/signUp',
      name: 'signUp',
      component: signUp,
    },
    {
      path: '/findId',
      name: 'findId',
      component: findId,
    },
    {
      path: '/',
      component: Layout,
      redirect: { path: constants.DEFAULT_HOME },
      children: [
        {
          path: '/childRegist',
          name: 'childRegist',
          component: childRegist,
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
      path: '/signIn',
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
