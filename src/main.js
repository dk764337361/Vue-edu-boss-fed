import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引⼊ element 组件库
import ElementUI from 'element-ui'
// 引⼊ element 主题⽂件
import 'element-ui/lib/theme-chalk/index.css'
// 引⼊自定义全局样式
import './styles/index.scss'

Vue.config.productionTip = false
// 注册为Vue插件
Vue.use(ElementUI)

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
