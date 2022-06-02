<template>
  <div class="course-image">
    <el-form-item :label="label">
        <!-- progress 组件 -->
        <el-progress
        v-if="isUpLoading"
        type="circle"
        :percentage="precentage"
        :width="178"
        :status="precentage === 100 ? 'success' : undefined"
        ></el-progress>
      <el-upload
      v-else
        class="avatar-uploader"
        action=""
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :http-request="handleUpload"
        :on-progress="handleProgress"
      >
        <img v-if="value" :src="value" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>
  </div>
</template>

<script>
import { uploadCourseImage } from '@/services/course'

export default {
  name: 'CourseImage',
  props: {
    // 接收⽗组件数据
    value: {
      type: String
    },
    label: {
      type: String
    },
    limit: {
      type: Number,
      default: 2
    }
  },
  components: {},
  data () {
    return {
      // 用于保存上传状态
      isUpLoading: false,
      // 用于上传进度百分比
      precentage: 0
    }
  },
  methods: {
    handleProgress (event, file) {
      console.log(event, file)
    },
    // 图片上传处理函数
    // - option 为Element的el-upload上传组件的相关信息
    // - option.file 为上传的文件信息
    async handleUpload (option) {
      this.isUpLoading = true
      // console.log(option)
      // 使用ES6提供的FormData 对象处理方法，格式化数据
      const fd = new FormData()
      fd.append('file', option.file)
      // 发送上传请求
      const { data } = await uploadCourseImage(fd, event => {
        this.precentage = Math.floor(event.loaded / event.total * 100)
      })
      // console.log(data)
      if (data.code === '000000') {
        // data.data.name 服务端相应的，图片上传成功后的线上地址
        // this.course.courseListImg = data.data.name
        this.$emit('input', data.data.name)
        // console.log(data.data.name)
        this.isUpLoading = false
        // 上传成功后，设置进度信息归零，避免下次上传出现回退效果
        this.precentage = 0
      }
    },
    // Element封装的上传图片成功回调
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    // Element封装的上传前的回调
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < this.limit

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style lang="scss" scoped>
// 只有作⽤于⾮⼦组件根元素的选择器才需要设置 ::v-deep
::v-deep .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
::v-deep .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
