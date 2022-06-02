import request from '@/utils/request'
import qs from 'qs'

// 用户登录接口
export const login = data => {
  return request({
    method: 'POST',
    // headers: { 'content-type': 'application/x-www-form-urlencoded' },
    url: '/front/user/login',
    // axios默认是发送JSON格式
    // 需要用第三方插件qs将JSON对象格式转换成urlencoded格式。urlencoded格式：名=值&名=值
    data: qs.stringify(data)
  })
}

// 用户基本信息接口
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/front/user/getInfo'
  })
}

// 分⻚查询⽤户信息 - ⽤户管理
export const getUserPages = data => {
  return request({
    method: 'POST',
    url: '/boss/user/getUserPages',
    data
  })
}

// 封禁⽤户（服务端关闭了权限，⽆法进⾏实际操作，如报错忽略即可）
export const forbidUser = userId => {
  return request({
    method: 'POST',
    url: '/boss/user/forbidUser',
    params: {
      userId
    }
  })
}
