<template>
  <div id="app">
    <h1>教育管理系统</h1>
    <!-- 根路由出口 -->
    <router-view />
  </div>
</template>

<script>
import request from '@/utils/request'

request({
  method: 'GET',
  // url: 'front/ad/getAdList'
  url: '/boss/v2/api-docs?group=edu-boss-boot'
}).then((res) => {
  // console.log(res)
})
export default {
  name: 'AppPage'
}
</script>
<style lang="scss" scoped>
</style>
