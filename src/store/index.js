import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 用于在登录成功后保存用户信息(初始值尝试读取本地存储)
    user: JSON.parse(window.localStorage.getItem('user') || null)
  },
  getters: {
  },
  mutations: {
    // 存储用户数据
    setUser (state, payload) {
      // 将payload转换为对象后再进行存储
      state.user = JSON.parse(payload)
      // 将payload 数据添加到 本地存储中
      // - 注意，本地存储只能保存字符串
      window.localStorage.setItem('user', payload)
    }
  },
  actions: {

  },
  modules: {
  }
})
