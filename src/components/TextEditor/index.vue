<template>
  <div class="text-editor" ref="editor"></div>
</template>

<script>
import { uploadCourseImage } from '@/services/course'
import E from 'wangeditor'

export default {
  name: 'TextEditor',
  props: {
    value: {
      trye: String,
      default: ''
    }
  },
  components: {},
  data () {
    return {
      editor: null,
      // 用于标记编辑的数据是否加载完毕
      isLoaded: false
    }
  },
  // 生命周期 - 创建完成（访问当前this实例）
  created () {},
  methods: {
    initEditor () {
      const editor = new E(this.$refs.editor)
      // 创建富文本编辑器之前，设置时间设置
      editor.config.onchange = (value) => {
        this.$emit('input', value)
      }
      // 配置自定义的图片上传功能
      editor.config.customUploadImg = async (resultFiles, insertImgFn) => {
        // resultFiles 是 input 中选中的文件列表
        // insertImgFn 是获取图片 url 后，插入到编辑器的方法
        // 上传图片，返回结果，将图片插入到编辑器中
        const fd = new FormData()
        fd.append('file', resultFiles[0])
        const { data } = await uploadCourseImage(fd)
        // console.log(data)
        if (data.code === '000000') {
          // 通过insertImgFn 传回给富文本编辑器进行显示
          insertImgFn(data.data.name)
        }
      }
      editor.create()
      editor.txt.html(this.value)
      this.editor = editor
    }
  },
  // 生命周期 - 挂载完成（访问DOM元素）
  // 组件的初始化操作
  mounted () {
    // 初始化富⽂本编辑器
    this.initEditor()
  },
  watch: {
    value () {
      if (this.isLoaded === false) {
        this.editor.txt.html(this.value)
        this.isLoaded = true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
/* @import url(); 引入css类 */
</style>
