// services/course.js 课程接⼝模块（新建）
import request from '@/utils/request'
// 分⻚查询课程信息
export const getQueryCourses = (data) => {
  return request({
    method: 'POST',
    url: '/boss/course/getQueryCourses',
    data
  })
}

// 课程上下架接口
// params为GET发送的参数合集
// 写法一：
// export const changeState = (data) => {
//   return request({
//     method: 'GET',
//     url: '/boss/course/changeState',
//     params: data
//   })
// }
// 写法二：
export const changeState = params => {
  return request({
    method: 'GET',
    url: '/boss/course/changeState',
    // params: params
    params
  })
}

// 保存或更改课程信息接口

export const saveOrUpdateCourse = data => {
  return request({
    method: 'POST',
    url: '/boss/course/saveOrUpdateCourse',
    data
  })
}
// 上传图片接口

export const uploadCourseImage = (data, onUploadProgress) => {
  // data 应当为FormData 对象
  return request({
    method: 'POST',
    url: '/boss/course/upload',
    data,
    onUploadProgress
    // Axios 将 HTML5 新增的上传进度事件：progress
    // onUploadProgress (event) {
    //   console.log(event.total, event.loaded)
    // }
  })
}

// 通过课程Id获取课程信息
export const getCourseById = courseId => {
  return request({
    method: 'GET',
    url: '/boss/course/getCourseById',
    params: {
      courseId
    }
  })
}
