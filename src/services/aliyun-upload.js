import request from '@/utils/request'

// 获取阿⾥云图⽚上传凭证（image 少了个 e）
export const aliyunImageUploadAddressAndAuth = () => {
  return request({
    method: 'GET',
    url: '/boss/course/upload/aliyunImagUploadAddressAdnAuth.json'
  })
}

// 获取阿⾥云视频上传凭证（有两个请求参数）
export const aliyunVideoUploadAddressAndAuth = (params) => {
  return request({
    method: 'GET',
    url: '/boss/course/upload/aliyunVideoUploadAddressAdnAuth.json',
    params
  })
}
// 阿⾥云转码请求（transcode 是⼀个词，中间不⽤驼峰）
export const aliyunVideoTrancode = (data) => {
  return request({
    method: 'POST',
    url: '/boss/course/upload/aliyunTransCode.json',
    data
  })
}

// 阿⾥云转码进度
export const getAliyunTranscodePercent = (lessonId) => {
  return request({
    method: 'GET',
    url: '/boss/course/upload/aliyunTransCodePercent.json',
    params: {
      lessonId
    }
  })
}
