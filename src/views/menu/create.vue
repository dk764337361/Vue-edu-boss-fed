<template>
  <div class="menu-create">
<!-- 将添加功能封装到了单独组件 ./components/CreateOrEdit.vue 中-->
<!-- 设置组件，isEdit 默认为false，⽆需传⼊ -->
  <create-or-edit ></create-or-edit>
  </div>
</template>

<script>
import CreateOrEdit from './components/CreateOrEdit.vue'
export default {
  name: 'MenuIndex',
  components: {
    CreateOrEdit
  }
}
</script>

<style lang="scss" scoped>
</style>
