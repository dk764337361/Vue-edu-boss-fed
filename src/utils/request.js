import axios from 'axios'
// 引入Vuex的数据
import store from '@/store'
// 通过局部引入方式引入Element 的Message 组件功能
import { Message } from 'element-ui'
// 引入 Router
import router from '@/router'
// 引入 qs 用于进行请求参数处理
import qs from 'qs'

// create 创建axios 实例
const request = axios.create({
  // timeout: 2000
  // baseURL:
  // headers:
})

function getBaseURL (url) {
  if (url.startsWith('/boss')) {
    return 'http://eduboss.lagounews.com'
  } else {
    return 'http://edufront.lagounews.com'
  }
}

// 请求拦截器
request.interceptors.request.use(function (config) {
  // 判断config.url 的前缀，来进行请求 baseURL 的设置
  config.baseURL = getBaseURL(config.url)
  // console.log(config)

  // 统一设置Token 信息
  const { user } = store.state
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }

  // 存储是否正在更新 Token 的状态
  let isRefreshing = false
  // 存储因为等待Token刷新而挂起的请求
  let requests = []

  // 响应拦截器
  request.interceptors.response.use(function (response) {
    // 状态码 2xx 会执行这里
    // console.log('响应成功了：', response)
    return response
  }, function (error) {
    if (error.response) {
      // 请求发送成功，响应接受完毕，但状态码为失败的情况
      // 1. 判断失败的状态码情况（主要处理401的情况）
      const { status } = error.response
      let errorMessage = ''
      if (status === 400) {
        errorMessage = '请求参数错误'
      } else if (status === 401) {
        // 1.1 无Token 信息
        if (!store.state.user) {
          // 跳转登录页
          router.push({
            name: 'login',
            query: {
              // currentRoute 就是存储了路由信息的对象(相当于$route)
              redirect: router.currentRoute.fullPath
            }
          })
          return Promise.reject(error)
        }

        // 检测是否已经存在了正在刷新Token 的请求
        if (isRefreshing) {
          // 将当前失败的请求,存储到请求列表中
          return requests.push(() => {
            // 当前函数调用后，会自动发送本次失败的请i去
            request(error.config)
          })
        }
        isRefreshing = true

        // 2. Token 无效（过期）处理
        // 发送请求，获取新的 access_token
        return request({
          method: 'POST',
          url: '/front/user/refresh_token',
          data: qs.stringify({
            refreshtoken: store.state.user.refresh_token
          })
        }).then(res => {
          // console.log(res)
          // 刷新 token 失败
          if (res.data.state !== 1) {
            store.commit('setUser', null)
            // 跳转到登录页
            router.push({
              name: 'login',
              query: {
                // currentRoute 就是存储了路由信息的对象(相当于$route)
                redirect: router.currentRoute.fullPath
              }
            })
            return Promise.reject(error)
          }
          // 刷新 token 成功
          // - 存储新的token
          store.commit('setUser', res.data.content)
          // - 重新发送失败的请求(根据requests发送所有失败的请求)。services/user.js
          requests.forEach(callback => callback())
          // - 发送完毕，清除 requests 内容即可
          requests = []
          // - error.config ：本次失败的请求的配置对象
          // - 将本次请求发送
          return request(error.config)
        }).catch(err => {
          console.log(err)
        }).finally(() => {
          // 请求发送完毕，响应处理完毕，将刷新状态更改为false即可
          isRefreshing = false
        })
      } else if (status === 403) {
        errorMessage = '没有权限，请联系管理员'
      } else if (status >= 500) {
        errorMessage = '服务端错误，请联系管理员'
      }
      // console.log(errorMessage)
      Message.error(errorMessage)
    } else if (error.request) {
      // 请求已经成功发起，但没有收到响应
      // `error.request` 在浏览器中是 XMLHttpRequest 的实例，
      // 而在node.js中是 http.ClientRequest 的实例
      Message.error('请求超时，请重试')
    } else {
      // 发送请求时出了点问题
      Message.error(error.message)
    }
    // 将本次请求的错误对象继续向后抛出，让接受响应的处理函数进行操作
    return Promise.reject(error)
  })

  return config
})

export default request
