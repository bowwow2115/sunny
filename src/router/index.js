import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld.vue';

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
      path: '/helloworld',
      name: 'helloworld',
      component: HelloWorld,
    },
  ],
});
