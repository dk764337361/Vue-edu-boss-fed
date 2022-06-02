<!--  -->
<template>
  <div class="course-video">
    <el-card>
      <div slot="header">课程相关信息</div>
      <el-form>
        <el-form-item label="视频上传">
          <input type="file" ref="video-file" />
        </el-form-item>
        <el-form-item label="封面上传">
          <input type="file" ref="image-file" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleUpload">开始上传</el-button>
          <el-button
            @click="
              $router.push({
                name: 'course-section',
                params: {
                  courseId,
                },
                query: {
                  lessonId: data.id,
                },
              })
            "
            >返回</el-button
          >
        </el-form-item>
        <el-form-item>
          <p v-if="uploadPercent !== 0">视频上传中：{{ uploadPercent }}%</p>
          <p v-if="isUploadSuccess">
            视频转码中：{{
              isTranscodeSuccess ? "完成" : "正在转码，请稍后..."
            }}
          </p>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {
  aliyunImageUploadAddressAndAuth,
  aliyunVideoUploadAddressAndAuth,
  aliyunVideoTrancode,
  getAliyunTranscodePercent
} from '@/services/aliyun-upload'
export default {
  name: 'CourseVideo',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  components: {},
  data () {
    return {
      // 图片上传后的地址，用于视频上传凭证请求
      imageURL: '',
      // 保存上传实例
      uploader: null,
      // 保存上传视频 id
      videoId: null,
      uploadPercent: 0,
      isUploadSuccess: false,
      isTranscodeSuccess: false
    }
  },
  // 生命周期 - 创建完成（访问当前this实例）
  created () {
    this.initUploader()
  },
  methods: {
    handleUpload () {
      // 点击上传时重置状态信息
      this.isTranscodeSuccess = false
      this.isUploadSuccess = false
      this.uploadPercent = 0

      const videoFile = this.$refs['video-file'].files[0]
      const imageFile = this.$refs['image-file'].files[0]
      //   console.log(videoFile, imageFile)
      const uploader = this.uploader
      // 将要上传的文件添加到上传列表中
      uploader.addFile(imageFile)
      uploader.addFile(videoFile)
      // 开始上传
      uploader.startUpload()
    },
    initUploader () {
      this.uploader = new window.AliyunUpload.Vod({
        // userID，必填，您可以使用阿里云账号访问账号中心（https://account.console.aliyun.com/），即可查看账号ID
        userId: '1618139964448548',
        // 上传到视频点播的地域，默认值为'cn-shanghai'，
        // eu-central-1，ap-southeast-1
        region: '',
        // 分片大小默认1 MB，不能小于100 KB（100*1024）
        partSize: 1048576,
        // 并行上传分片个数，默认5
        parallel: 5,
        // 网络原因失败时，重新上传次数，默认为3
        retryCount: 3,
        // 网络原因失败时，重新上传间隔时间，默认为2秒
        retryDuration: 2,
        // 开始上传
        // 开始上传（uploader.startUpload() 触发后执⾏该回调）
        // - 将回调更改为箭头函数，以便在内部通过 this 操作 Vue 实例
        onUploadstarted: async (uploadInfo) => {
          // ⼀、获取凭证
          // console.log(uploadInfo)
          // 1. 声明变量存储得到上传凭证
          let uploadAddressAndAuth = null
          // 2. 根据 isImage 检测上传⽂件类型
          if (uploadInfo.isImage) {
            const { data } = await aliyunImageUploadAddressAndAuth()
            if (data.code === '000000') {
              // 3. data.data 即为凭证信息组成的对象
              uploadAddressAndAuth = data.data
              // 5. 保存图⽚地址，给视频接⼝使⽤
              this.imageURL = uploadAddressAndAuth.imageURL
            }
          } else {
            // 4. 观察 uploadInfo 数据，根据请求参数名设置参数
            // - 由于视频接⼝要求传⼊封⾯图⽚地址 imageUrl，所以必须先发图再发视频（后端
            // - 先将图⽚数据存储给 this，便于视频接⼝使⽤
            const { data } = await aliyunVideoUploadAddressAndAuth({
              fileName: uploadInfo.file.name,
              imageUrl: this.imageURL
            })
            if (data.code === '000000') {
              // 6. 存储凭证
              // - 图⽚与视频上传的区别在于图⽚存在 imageId，视频为 videoId，其他相同
              uploadAddressAndAuth = data.data
              this.videoId = data.data.videoId
            }
          }
          // ⼆、设置凭证
          this.uploader.setUploadAuthAndAddress(
            uploadInfo,
            uploadAddressAndAuth.uploadAuth,
            uploadAddressAndAuth.uploadAddress,
            uploadAddressAndAuth.imageId || uploadAddressAndAuth.videoId
          )
          // 设置完毕，上传进度开始执⾏
        },
        // 文件上传成功
        onUploadSucceed: function (uploadInfo) {},
        // 文件上传失败
        onUploadFailed: function (uploadInfo, code, message) {},
        // ⽂件上传进度，单位：字节
        // - 修改为箭头函数，内部 this 才能访问 Vue 实例
        onUploadProgress: (uploadInfo, totalSize, loadedPercent) => {
          console.log('onUploadProgress', uploadInfo, totalSize, loadedPercent)
          // 只对视频上传进度进⾏监测即可
          if (!uploadInfo.isImage) {
            this.uploadPercent = Math.floor(loadedPercent * 100)
          }
        },
        // 上传凭证或STS token超时
        onUploadTokenExpired: function (uploadInfo) {},
        // 全部文件上传结束
        onUploadEnd: async (uploadInfo) => {
          this.isUploadSuccess = true
          //   const lessonId = this.$route.query.lessonId
          // 调⽤接⼝
          const { data } = await aliyunVideoTrancode({
            lessonId: this.$route.query.lessonId,
            coverImageUrl: this.imageURL,
            fileName: this.$refs['video-file'].files[0].name,
            fileId: this.videoId
          })
          //   console.log(data)
          if (data.code === '000000') {
            // 转码开始后，需要轮询转码进度
            const timer = setInterval(async () => {
              const { data } = getAliyunTranscodePercent(
                this.$route.query.lessonId
              )
              if (data === 100) {
                this.isTranscodeSuccess = true
                // 当上传进度为 100，停⽌定时器，并进⾏提示
                clearInterval(timer)
                this.$message.success('转码成功')
              }
            }, 1000)
          }
        }
      })
    }
  },
  // 生命周期 - 挂载完成（访问DOM元素）
  mounted () {}
}
</script>
<style lang="scss" scoped>
/* @import url(); 引入css类 */
</style>
