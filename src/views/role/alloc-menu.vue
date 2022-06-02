<!--  -->
<template>
  <div class="alloc-menu">
<el-card>
    <el-tree
    ref="menu-tree"
    node-key="id"
    :data="menus"
    :props="defaultProps"
    :default-checked-keys="checkedKeys"
    show-checkbox
    default-expand-all
    ></el-tree>
    <div style="margin:20px">
        <el-button
        @click="onReset"
        >清空</el-button>
        <el-button
        type="primary"
        @click="onSave"
        >保存</el-button>
    </div>
</el-card>
</div>
</template>

<script>
import { getMenuNodeList, allocateRoleMenus, getRoleMenus } from '@/services/menu/'
export default {
  name: 'AllocMenu',
  props: {
    roleId: {
      type: [Number, String],
      required: true
    }
  },
  // 生命周期 - 创建完成（访问当前this实例）
  created () {
    // 加载所有菜单信息（用于展示tree结构）
    this.loadMenus()
    // 加载当前角色已经分配的菜单信息
    this.loadRoleMenus()
  },
  components: {

  },
  data () {
    return {
      menus: [],
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      },
      checkedKeys: []
    }
  },

  methods: {
    onReset () {
      this.$refs['menu-tree'].setCheckedKeys([])
    },
    // 自己封装的用于数据筛选的方法(筛选出被选中菜单项的ID)
    getCheckedKeys (menus) {
      // 遍历数据(将所有存在子节点的node排除，对子节点列表继续遍历进行筛选)
      menus.forEach(menu => {
        // 未选中，结束
        if (!menu.selected) {
          return
        }
        // 是否存在子节点
        if (menu.subMenuList) {
          // 对子节点进行选中状态监测.结束
          // 递归
          return this.getCheckedKeys(menu.subMenuList)
        }
        // 说明为选中的叶子节点（不存在子节点的节点），存储ID
        // this.checkedKeys.push(menu.id)
        this.checkedKeys = [...this.checkedKeys, menu.id]
      })
    },
    async loadRoleMenus () {
      const { data } = await getRoleMenus(this.roleId)
      console.log(data)
      if (data.code === '000000') {
        this.getCheckedKeys(data.data)
      }
    },
    async onSave () {
    //   console.log(this.$refs['menu-tree'].getCheckedKeys())
    //   console.log(this.$refs['menu-tree'].getCheckedNodes())
      // 发送请求，传递角色 ID 与选中的菜单项 ID
      const { data } = await allocateRoleMenus({
        roleId: this.roleId,
        menuIdList: this.$refs['menu-tree'].getCheckedKeys()
      })
      //   console.log(data)
      if (data.code === '000000') {
        this.$message.success('分配菜单成功')
        this.$router.push({
          name: 'role'
        })
      }
    },
    async loadMenus () {
      const { data } = await getMenuNodeList()
      //   console.log(data)
      if (data.code === '000000') {
        this.menus = data.data
      }
    }
  },
  // 生命周期 - 挂载完成（访问DOM元素）
  mounted () {

  }
}
</script>
<style lang="scss" scoped>
/* @import url(); 引入css类 */

</style>
