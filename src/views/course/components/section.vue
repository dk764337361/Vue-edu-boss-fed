<template>
  <div class="course-section">
    <div class="header" :data="course">
      <el-page-header
        @back="
          $router.push({
            name: 'course-index',
          })
        "
        :content="course.courseName"
      >
      </el-page-header>
      <el-button
        style="float: right; margin-top: -10px"
        type="primary"
        @click="handleAdd()"
        >添加课程</el-button
      >
    </div>
    <el-card>
      <el-tree
        v-loading="isLoading"
        :data="sections"
        :props="defaultProps"
        draggable
        :allow-drop="handleAllowDrop"
        @node-drop="handleNodeDrop"
      >
        <div class="inner" slot-scope="{ node, data }">
          <!-- 内容设置 -->
          <span>{{ node.label }}</span>
          <!-- 后续按钮结构 -->
          <span v-if="data.sectionName" class="actions">
            <el-button @click="handleEdit(node, data)">编辑</el-button>
            <el-button>添加课时</el-button>
            <el-button>状态</el-button>
          </span>
          <span v-else class="actions">
            <el-button @click="handleAgainEdit(node, data)">编辑</el-button>
            <el-button
              @click="
                $router.push({
                  name: 'course-video',
                  params: {
                    courseId,
                  },
                })
              "
              >上传视频</el-button
            >
            <el-button>状态</el-button>
          </span>
        </div>
      </el-tree>

      <el-dialog
        :title="isEdit ? '编辑章节' : '添加章节'"
        :visible.sync="dialogFormVisible"
      >
        <el-form>
          <el-form-item
            label="课程名称"
            :label-width="formLabelWidth"
            prop="name"
          >
            <el-input
              v-model="course.courseName"
              autocomplete="off"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="章节名称"
            :label-width="formLabelWidth"
            prop="name"
          >
            <el-input
              v-model="courses.sectionName"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="章节描述" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="courses.description"></el-input>
          </el-form-item>
          <el-form-item label="章节排序" :label-width="formLabelWidth">
            <!-- <el-input v-model="form.name" autocomplete="off"></el-input> -->
            <el-input type="number" :min="0" v-model="courses.orderNum">
              <template slot="append">数字控制排序，数字越大越靠后</template>
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="sectiondatapost">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="课时基本信息" :visible.sync="classDialogFormVisible">
        <el-form>
          <el-form-item
            label="课程名称"
            :label-width="formLabelWidth"
            prop="name"
          >
            <el-input
              v-model="course.courseName"
              autocomplete="off"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="章节名称"
            :label-width="formLabelWidth"
            prop="name"
          >
            <el-input
              v-model="courses.sectionName"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="课时名称"
            :label-width="formLabelWidth"
            prop="name"
          >
            <el-input autocomplete="off" v-model="lessonDTOS.theme"></el-input>
          </el-form-item>
          <el-form-item label="时长" :label-width="formLabelWidth">
            <el-input v-model="lessonDTOS.duration"></el-input>
          </el-form-item>
          <el-form-item label="是否开放试听" :label-width="formLabelWidth">
            <template>
              <el-switch
                v-model="lessonDTOS.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value="1"
                :inactive-value="0"
              >
              </el-switch>
            </template>
          </el-form-item>

          <el-form-item
            label="课时排序"
            :label-width="formLabelWidth"
            prop="name"
          >
            <!-- <el-input autocomplete="off" v-model="lessonDTOS.orderNum"></el-input> -->
            <el-input type="number" :min="0" v-model="lessonDTOS.orderNum">
              <template slot="append">数字控制排序，数字越大越靠后</template>
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button
            @click="(classDialogFormVisible = false), (lessonDTOS = '')"
            >取 消</el-button
          >
          <el-button type="primary" @click="lessondatapost">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  getSectionAndLesson,
  saveOrUpdateSection,
  saveOrUpdateLesson
} from '@/services/course-section'
import { getCourseById } from '@/services/course'
export default {
  name: 'CourseSection',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  components: {},
  data () {
    return {
      // el-dialog组件 开关
      dialogFormVisible: false,
      classDialogFormVisible: false,
      formLabelWidth: '120px',
      isEdit: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      rules: {
        name: [{ required: true, message: '请输入章节名称', trigger: 'blur' }]
      },
      // 课程元数据
      course: [],
      // 课程详细信息
      courses: {
      },
      lessonDTOS: {},
      // 章节信息
      sections: [],
      defaultProps: {
        children: 'lessonDTOS',
        // label: 'sectionName'
        label (data) {
          // data 是章节或课时的时候，label 的属性名不同，需要检测后使用
          return data.sectionName || data.theme
        }
      },
      isLoading: false
    }
  },
  // 生命周期 - 创建完成（访问当前this实例）
  created () {
    this.loadSection()
    // 加载课程信息
    this.loadCourse()
  },
  methods: {
    async handleNodeDrop (draggingNode, dropNode, type, event) {
      // console.log(draggingNode, dropNode)
      console.log(draggingNode)
      console.log(draggingNode.data.sectionId)
      console.log(dropNode.data)
      // console.log(dropNode.parent.childNodes)
      this.isLoading = true
      try {
        // Promise.all([])，等待数组里所有操作都完成（或第一个失败），再进行输出
        await Promise.all(
          dropNode.parent.childNodes.map((item, index) => {
            // 由于有很多章节与课时，需要给每个章节与课时都进行最新的排序的请求
            if (draggingNode.data.sectionId) {
              // 课时接口处理
              return saveOrUpdateLesson({
                id: item.data.id,
                orderNum: index
              })
            } else {
              // 章节接口处理
              return saveOrUpdateSection({
                id: item.data.id,
                orderNum: index
              })
            }
          })
        )
        this.$message.success('数据更新成功')
      } catch (err) {
        this.$message.error('数据更新失败', err)
      }
      this.isLoading = false
    },
    // 节点拖拽处理函数
    // draggingNode 要移动的目标
    // dropNode 移动到的目标地
    handleAllowDrop (draggingNode, dropNode, type) {
      // 规则1：只能同级移动，type 不能为'inner'
      // 规则2：课时不能移动到其他章节中
      // type !=== 'inner'
      // console.log(draggingNode, dropNode)
      // return true
      return (
        type !== 'inner' &&
        draggingNode.data.sectionId === dropNode.data.sectionId
      )
    },
    handleEdit (node, data) {
      // console.log(node, data)
      this.dialogFormVisible = true
      this.isEdit = true
      // this.roleId = role.id
      // console.log(data.id)
      if (this.sections) {
        this.courses = this.sections.find((index) => {
          return index.id === parseInt(data.id)
        })
        // console.log(this.courses)
        // console.log(this.courses.courseId)
      }
    },
    // 保存章节
    async sectiondatapost () {
      const { data } = await saveOrUpdateSection({
        id: this.courses.id,
        courseId: this.courses.courseId,
        description: this.courses.description,
        sectionName: this.courses.sectionName,
        orderNum: this.courses.orderNum,
        status: this.courses.status
      })
      // console.log(data)
      if (data.code === '000000') {
        this.$message.success('数据更新成功')
      } else {
        this.$message.error('数据更新失败')
      }
      this.dialogFormVisible = false
      this.loadSection()
    },
    // 二级编辑按钮
    handleAgainEdit (node, data) {
      // console.log(data)
      this.classDialogFormVisible = true
      this.loadSection()
      // this.courses = this.sections.find((item) => {
      //   // 成功代码1
      //   if (item.lessonDTOS) {
      //     this.lessonSnapData = item.lessonDTOS.find((item) => {
      //       // console.log(item.theme)
      //       return item.theme === node.label
      //     })
      //   }
      //   return item.lessonDTOS.find((item) => {
      //     // console.log(item.theme)
      //     return item.theme === node.label
      //   })
      // })

      this.courses = this.sections.find((item) => {
        // 成功代码2
        return item.lessonDTOS.find((index) => {
          // console.log(index)
          if (index.theme === data.theme) {
            // console.log(index)
            // item.lessonDTOS = []
            this.lessonDTOS = {}
            return (this.lessonDTOS = index)
          }
          return 0
        })
      })

      // console.log(this.lessonDTOS)
      // console.log(this.courses)
    },
    // 保存课时
    async lessondatapost () {
      const { data } = await saveOrUpdateLesson({
        id: this.lessonDTOS.id,
        courseId: this.lessonDTOS.courseId,
        sectionId: this.lessonDTOS.sectionId,
        theme: this.lessonDTOS.theme,
        duration: this.lessonDTOS.duration,
        durationNum: this.lessonDTOS.durationNum,
        isFree: this.lessonDTOS.isFree,
        orderNum: this.lessonDTOS.orderNum,
        status: this.lessonDTOS.status
      })
      // console.log(data)
      if (data.code === '000000') {
        this.$message.success('数据更新成功')
      } else {
        this.$message.error('数据更新失败')
      }
      this.classDialogFormVisible = false
      this.loadSection()
    },
    handleAdd (id) {
      this.dialogFormVisible = true
      this.isEdit = false
      this.courses = ''
    },
    // 根据课程ID 查询课程题目
    async loadCourse () {
      const { data } = await getCourseById(this.courseId)
      // console.log(data)
      if (data.code === '000000') {
        // 将要编辑的分类数据保存到 course 中
        this.course = data.data
      }
    },
    goBack () {
      console.log('go back')
    },
    // 根据课程ID 查询此课程详细信息
    async loadSection () {
      const { data } = await getSectionAndLesson(this.courseId)
      // console.log(data)
      if (data.code === '000000') {
        this.sections = data.data
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}
.inner {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ebeef5;
}

::v-deep .el-tree-node__content {
  height: auto;
}
</style>
