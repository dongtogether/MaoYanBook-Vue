import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      userId: window.localStorage.getItem('userId' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('userId' || '[]'))
      // userId: window.localStorage.getItem('userId' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('userId' || '[]')).userId
    },
    isAdmin:JSON.parse(window.localStorage.getItem('userId' || '[]') )== 'U001'
  },
  mutations: {

    login (state, userId) {
      state.user.userId = userId
      if(userId == 'U001'){
        state.isAdmin = true //当前用户位系统用户
      }
      window.localStorage.setItem('userId', JSON.stringify(userId))
    },
    logout (state) {
      // 注意不能用 null 清除，否则将无法判断 user 里具体的内容
      state.user.userId = []
      state.isAdmin = false
      window.localStorage.removeItem('userId')
    }
  }
})
