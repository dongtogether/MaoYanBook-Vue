// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import store from './store'
import echarts from 'echarts'

import 'mavon-editor/dist/css/index.css' //编辑时工具栏显示
import mavonEditor from 'mavon-editor'
Vue.use(mavonEditor)

Vue.prototype.$echarts = echarts

Vue.config.productionTip = false
Vue.use(ElementUI);

import axios from 'axios'
Vue.prototype.$axios = axios
axios.defaults.baseURL = 'http://localhost:8081/api'


/*首先判断访问的路径是否需要登录，
* 如果需要，判断 store 里有没有存储 user 的信息，
*    如果存在，则放行，否则跳转到登录页面，并存储访问的页面路径（以便在登录后跳转到访问页）。
*/

router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {
      if (store.state.user.userId) {
        next()
      } else {
        next({
          path: 'login',
          query: {redirect: to.fullPath}
        })
      }
    } else {
      next()
    }
  }
)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
  components: { App },
  template: '<App/>'
})
