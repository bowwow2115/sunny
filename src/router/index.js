import Vue from 'vue';
import Router from 'vue-router';
import signIn from '@/components/signIn.vue';
import signUp from '@/components/signUp.vue';
import findId from '@/components/findId.vue';
import childRegist from '@/components/childRegist.vue';
import auth from "@/api/auth";
import constants from "@/Constants.js"

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: "/",
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
      path: '/childRegist',
      name: 'childRegist',
      component: childRegist,
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.path === from.path) {
    next(false); // 현재 경로와 동일한 경우 네비게이션을 취소
  }
  console.log(to);
  console.log(from);
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

  if (requiresAuth) {
    (async () => {
      let isValidate = await validate();
      if(isValidate) {
        next();
      } else {
        redirectLoginPage();
      }
    })();
  } else {
    next(); // 인증이 필요 없는 페이지는 그대로 이동
  }
});

async function validate() {
  return await auth.loggedIn()
  .then((response) => {
    console.log(response);
    if(response.code == "0") {
      return true;
    }
  })
  .catch((e) => {
    console.log(e);
    try {
      Utils.deleteCookie(constants.TOKEN);
    } catch (error) {
      console.log(`cookie: ${error}`);
    }
    redirectLoginPage();
    return false;
  });
}

function redirectLoginPage() {
  router.push({
    path: "/signIn",
  }).catch(() => {});
  
  // if (window.validateHandle) {
  //   clearInterval(window.validateHandle);
  //   window.validateHandle = null;
  // }
}

function getQueryString(location) {
  let uri = location.href.split("?");
  const getVars = {};
  if (uri.length == 2) {
    let vars = uri[1].split("&");
    let tmp = "";
    vars.forEach(function (v) {
      tmp = v.split("=");
      if (tmp.length == 2) getVars[tmp[0]] = tmp[1];
    });
  }

  return getVars;
}

export default router;
