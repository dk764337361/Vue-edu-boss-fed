// router/index.js
import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入 store
import store from '@/store'
Vue.use(VueRouter)

// 路由规则（添加需要认证的requiresAuth 信息）
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: 'login' */'@/views/login/index')
  },
  {
    path: '/',
    component: () => import(/* webpackChunkName: 'layout' */'@/views/layout/index'),
    // ⼦路由请求会经过⽗路由，直接给⽗路由设置登录检测更加简单，适合所有⼦路由均需要登录的情况
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'home',
        component: () => import(/* webpackChunkName: 'home' */'@/views/home/index')
      },
      {
        path: '/role',
        name: 'role',
        component: () => import(/* webpackChunkName: 'role' */'@/views/role/index')
      },
      {
        path: '/menu',
        name: 'menu',
        component: () => import(/* webpackChunkName: 'menu' */'@/views/menu/index')
      },
      {
        path: '/resource',
        name: 'resource',
        component: () => import(/* webpackChunkName: 'resource' */'@/views/resource/index')
      },
      {
        path: '/course',

        name: 'course',
        component: () => import(/* webpackChunkName: 'course' */'@/views/course/index')
      },
      {
        path: '/user',
        name: 'user',
        component: () => import(/* webpackChunkName: 'user' */'@/views/user/index')
      },
      {
        path: '/advert',
        name: 'advert',
        component: () => import(/* webpackChunkName: 'advert' */'@/views/advert/index')
      },
      {
        path: '/advert-space',
        name: 'advert-space',
        component: () => import(/* webpackChunkName: 'advert-space' */'@/views/advert-space/index')
      },
      // 添加菜单路由组件
      {
        path: '/menu/create',
        name: 'menu-create',
        component: () => import(/* webpackChunkName: 'menu-create' */'@/views/menu/create')
      },
      // 编辑菜单路由组件
      {
        // 设置动态路由
        path: '/menu/:id/edit',
        name: 'menu-edit',
        component: () => import(/* webpackChunkName: 'menu-edit' */'@/views/menu/edit')
      },
      // 添加资源路由组件
      {
        path: '/resource/create',
        name: 'resource-create',
        component: () => import(/* webpackChunkName: 'resource-create' */'@/views/resource/create')
      },
      // 编辑资源路由组件
      {
        // 设置动态路由
        path: '/resource/:id/edit',
        name: 'resource-edit',
        component: () => import(/* webpackChunkName: 'menu-edit' */'@/views/resource/edit')
      },
      // 分配菜单路由组件
      {
        // 设置动态路由
        path: '/role/:roleId/alloc-menu',
        name: 'alloc-menu',
        component: () => import(/* webpackChunkName: 'alloc-menu' */'@/views/role/alloc-menu'),
        props: true
      },
      // 课程首页
      {
        path: '/course/',
        name: 'course-index',
        component: () => import(/* webpackChunkName: 'course-list' */'@/views/course/index.vue')
      },
      {
        // 添加课程组件
        path: '/course/create',
        name: 'course-create',
        component: () => import(/* webpackChunkName: 'course-create' */'@/views/course/create')
      },
      {
        path: '/course/:courseId/edit',
        name: 'course-edit',
        component: () => import(/* webpackChunkName: 'course-edit' */'@/views/course/edit.vue'),
        props: true
      },
      // 课程内容组件
      {
        path: '/course/:courseId/section',
        name: 'course-section',
        component: () => import(/* webpackChunkName: 'course-section' */'@/views/course/components/section.vue'),
        props: true
      },
      // 上传课时视频
      {
        path: '/course/:courseId/video',
        name: 'course-video',
        component: () => import(/* webpackChunkName: 'course-video' */'@/views/course/components/video.vue'),
        props: true
      }

    ]
  },
  {
    path: '*',
    name: 'error-page',
    component: () => import(/* webpackChunkName: 'error-page' */'@/views/error-page/index')
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // 验证to 路由是否需要进行身份验证
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // console.log('当前页面需要认证')
    // 验证 vuex 的store 中的登录用户信息是否存储
    if (!store.state.user) {
      // 未登录，跳转到登录页
      return next({
        name: 'login',
        query: {
          // 将本次路由的fullpath 传递给 login页面
          redirect: to.fullPath
        }

      })
    }
    next() // 确保一定要调用 next()
  } else {
    console.log('当前页面不需要认证')
    next() // 确保一定要调用 next()
  }
})

export default router
