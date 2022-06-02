<template>
  <div class="menu-create-or-edit">
    <!-- Card 组件 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 设置标题 -->
        <span>{{ isEdit ? "编辑菜单" : "添加菜单" }}</span>
      </div>
      <!-- Form 组件 -->
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="编号" width="100">
          <el-input v-model="form.id"></el-input
        ></el-form-item>
        <el-form-item label="资源名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="资源路径">
          <el-input v-model="form.url"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button v-if="!isEdit">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getResourcePages, createOrUpdateMenu } from '@/services/resource'

export default {
  name: 'CreateOrEdit',
  // 通过props 接受父组件传值，判断当前是哪种功能（添加或编辑）
  props: {
    isEdit: {
      type: Boolean,
      // 默认为添加功能
      default: false
    }
  },
  data () {
    return {
      // 存储菜单数据
      form: {
        id: '',
        name: '',
        url: '',
        description: ''
      }
    }
  },
  created () {
    // 加载上级菜单信息
    this.loadMenuInfo()
  },
  methods: {
    async onSubmit () {
      // console.log('submit')
      // 1. 表单验证
      // 2. 发送请求
      const { data } = await createOrUpdateMenu(this.form)
      console.log(data)
      // if (data.code === '000000') {
      //   this.$message.success('提交成功')
      //   this.$router.push({
      //     name: 'menu'
      //   })
      // }
    },
    async loadMenuInfo () {
      // console.log(this.$route.params.id)
      // 检测是否存在路由参数 id , 并进行对应处理
      // 请求菜单数据（上级菜单数据）
      const { data } = await getResourcePages({})
      console.log(data)
      if (data.code === '000000') {
        // 将上级菜单数据保存，进行数据绑定
        // 检测是否存在菜单数据，menuInfo,如果存在，更新给from 即可
        if (data.data.records) {
          // console.log(this.$route.params.id)
          console.log(data.data.records)

          // 用对象的属性查找数组里的对象 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/find#%E7%94%A8%E5%AF%B9%E8%B1%A1%E7%9A%84%E5%B1%9E%E6%80%A7%E6%9F%A5%E6%89%BE%E6%95%B0%E7%BB%84%E9%87%8C%E7%9A%84%E5%AF%B9%E8%B1%A1
          this.form = data.data.records.find((index) => {
            return index.id === parseInt(this.$route.params.id)
          })
          console.log(this.form)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
