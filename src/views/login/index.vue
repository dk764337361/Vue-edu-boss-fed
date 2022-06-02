<template>
  <div class="login">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="80px"
      label-position="top"
    >
      <el-form-item
        label="手机号"
        prop="phone"
      >
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item
        label="密码"
        prop="password"
      >
        <el-input
          v-model="form.password"
          type="password"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="isLoginLoading"
          @click="onSubmit"
        >登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 引入封装的接口功能组件
import { login } from '@/services/user'

export default {
  name: 'LoginIndex',
  data () {
    return {
      // 存储表单数据的对象
      form: {
        phone: '18201288771',
        password: '111111'
      },
      // 用于设置表单校验规则
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^1\d{10}$/,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 18,
            message: '密码长度为 6 到 18 位',
            trigger: 'blur'
          }
        ]
      },
      // 用于保存加载状态
      isLoginLoading: false
    }
  },
  methods: {
    // 登录功能
    async onSubmit () {
      try {
        // 1.设置校验成功后的功能（请求发送）
        await this.$refs.form.validate()
        this.isLoginLoading = true
        // 2. 发送请求
        const { data } = await login(this.form)
        console.log(data)
        this.isLoginLoading = false

        // 3. 响应处理
        if (data.state === 1) {
          this.$message.success('登录成功')
          // 将用户信息存储到Vuex中
          this.$store.commit('setUser', data.content)
          // 根据可能存储的redirect 数据进行跳转设置
          // this.$router.push({
          //   name: 'home'
          // })
          this.$router.push(this.$route.query.redirect || '/')
        } else {
          this.$message.error('登录失败')
          // this.$message.error(data.message)
        }
      } catch (err) {
        // 设置校验失败后的功能（提示）
        console.log('没有通过校验')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  // 容器撑满⾼度
  height: 100vh;
  display: flex;
  // 内容⽔平垂直居中
  align-items: center;
  justify-content: center;

  .el-form {
    background-color: #fff;
    width: 300px;
    padding: 20px;
    border-radius: 10px;
    .el-button {
      width: 100%;
    }
  }
}
</style>
