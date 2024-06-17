import Vue from 'vue';
import Router from 'vue-router';
import SunnyLogin from '@/components/sunnyLogin.vue';
import childRegist from '@/components/childRegist.vue';

import auth from "@/api/auth";

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: () => import('@/components/Home.vue'), // 기본 홈 컴포넌트
    // },
    {
      path: '/sunnyLogin',
      name: 'sunnyLogin',
      component: SunnyLogin,
    },
    {
      path: '/childRegist',
      name: 'childRegist',
      component: childRegist,
    },
  ],
});
