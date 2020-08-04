import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'login',
      redirect: '/login',
      component: () => import('@/components/LoginPage'),
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/components/LoginPage')
    },
    {
      path: '/register',
      name: 'register',
      component:  () => import('@/components/RegisterPage')
    },

    {
      path: '/home',
      name: 'Home',
      component: () => import('@/components/Home'),
      // home页面并不需要被访问
      redirect: '/homePage',
      children: [
        {
          path: '/homePage',
          name: 'HomePage',
          component: () => import('@/components/home/HomePage'),
          meta: {
            requireAuth: true
          }
        },

        //笔记本
        {
          path: '/jotter',
          name: 'Jotter',
          component: () => import('@/components/jotter/Articles'),
        },
        {
          path: '/jotter/article',
          name: 'Article',
          component: () => import('@/components/jotter/ArticlesDetails'),
        },
        {
          path: '/jotter/editor',
          name: 'Editor',
          component: () => import('@/components/jotter/ArticleEditor'),
          meta: {
            requireAuth: true
          }
        },

        //图书馆
        {
          path: '/library',
          name: 'Library',
          component:  () => import('@/components/library/LibraryIndex'),
          meta: {
            requireAuth: true
          }
        },

        //用户中心
        {
          path: '/user',
          name: 'user',
          component: () => import('@/components/user/UserProfile'),
          meta: {
            requireAuth: true
          },
        }
      ]
    },

  ]
})
