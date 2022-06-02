// layout/components/AppHeader.vue
<template>
  <div class="app-header">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 右侧用户信息展示 -->
    <el-dropdown>
      <span class="el-dropdown-link">
        <!-- 用户头像。使用Avatar 组件 -->
        <el-avatar
        :size="30"
        :src=" userInfo.portrait || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png' "
        ></el-avatar>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>{{ userInfo.userName }}</el-dropdown-item>
        <el-dropdown-item
        divided
        @click.native="handleLogout"
        >退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
// 引入用户信息接口功能
import { getUserInfo } from '@/services/user'

export default {
  name: 'AppHeader',
  // 实例创建时请求数据
  created () {
    // 加载用户信息
    // 不建议在钩⼦函数中直接书写逻辑，应封装到 methods 中
    this.loadUserInfo()
  },
  data () {
    return {
      // 声明存储⽤户信息的数据，绑定到视图中
      userInfo: {}
    }
  },
  methods: {
    // 加载用户信息功能
    async loadUserInfo () {
      // 调⽤⽅法请求⽤户信息
      const { data } = await getUserInfo()
      // 保存在 data 的数据中
      this.userInfo = data.content
    },
    // 退出功能
    handleLogout () {
      this.$confirm('确认退出吗?', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      // 1. 清除store 中的用户信息
        this.$store.commit('setUser', null)
        // 2. 跳转登录页
        // this.$router.push('/login')
        this.$router.push({
          name: 'login'
        })

        this.$message({
          type: 'success',
          message: '退出成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
  }
}
</script>

 <style lang="scss" scoped>
.app-header {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .el-dropdown-link {
    display: flex;
    align-items: center;
  }
}
</style>
