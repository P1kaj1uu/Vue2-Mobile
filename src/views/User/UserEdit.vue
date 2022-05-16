<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar title="编辑资料" left-arrow @click-left="$router.back()" fixed />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image round class="avatar" :src="userDataList.photo" @click="imgFileFn" />
          <!-- 文件选择框，默认先隐藏 -->
          <input type="file" ref="fileRef" v-show="false" accept="image/*" @change="onFileChange">
        </template>
      </van-cell>
      <van-cell title="名称" :value="userDataList.name" is-link @click="editNameFn"  />
      <!-- 修改名称弹出框，默认先隐藏 -->
      <van-dialog v-model="isDialogName" title="修改名称" show-cancel-button :before-close="onNameDialogBeforeClose" >
        <van-field ref="editNameRef" v-model.trim="username" input-align="center" autocomplete="off" maxlength="7" placeholder="请输入名称" />
      </van-dialog>
      <van-cell title="生日" :value="userDataList.birthday" is-link @click="editAgeFn" />
      <!-- 修改生日弹出框，默认先隐藏 -->
      <van-popup v-model="isDialogAge" position="bottom" style="height: 50%" round>
        <!-- 日期选择控件 -->
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          title="选择出生年月日"
          :show-toolbar="true"
          :min-date="minDate"
          :max-date="maxDate"
          @cancel="isDialogAge = false"
          @confirm="onAgePopupBeforeClose"
        />
      </van-popup>
      <van-cell title="性别" :value="userDataList.gender === 0 ? '男' : '女'" is-link @click="editSexFn" />
      <!-- 修改性别弹出框，默认先隐藏 -->
      <van-dialog v-model="isDialogSex" title="修改性别" show-cancel-button :before-close="onSexDialogBeforeClose" >
        <van-radio-group class="editSex" v-model="radio" direction="horizontal">
          <van-radio name="0">
            男
            <template #icon="props">
              <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
            </template>
          </van-radio>
          <van-radio name="1">
            女
            <template #icon="props">
              <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
            </template>
          </van-radio>
        </van-radio-group>
      </van-dialog>
      <van-field
        v-model.trim="message"
        rows="2"
        autosize
        class="textArea"
        label="签名"
        type="textarea"
        maxlength="50"
        placeholder="请输入个性签名"
        show-word-limit
        clearable
        input-align="right"
        @blur="editIntroFn"
      />
    </van-cell-group>
  </div>
</template>

<script>
import { Notify } from 'vant'
// 导入封装的时间格式化方法
import { moment } from '../../utils/day'
// 导入封装的api方法
import { getUserDataAPI, editUserPhotoAPI, editUserDataAPI } from '../../api/index'

export default {
  name: 'UserEdit',
  data () {
    return {
      // 用于存储用户个人资料
      userDataList: [],
      // 个性签名输入框中的内容
      message: '',
      // 控制是否显示弹出框
      isDialogName: false,
      isDialogSex: false,
      isDialogAge: false,
      // 编辑用户名称
      username: '',
      // 控制性别单选框
      radio: '',
      // 编辑用户性别
      gender: '',
      // 激活项性别图标
      activeIcon: 'https://img01.yzcdn.cn/vant/user-active.png',
      // 失活项性别图标
      inactiveIcon: 'https://img01.yzcdn.cn/vant/user-inactive.png',
      // 最小的可选的日期
      minDate: new Date(1900, 0, 1),
      // 最大的可选日期
      maxDate: new Date(),
      // 当前日期
      currentDate: new Date(),
      // 定时器
      timer: null
    }
  },
  methods: {
    // 当点击图片时
    imgFileFn () {
      // 模拟点击文件上传输入框
      this.$refs.fileRef.click()
    },
    // 当点击修改头像时
    async onFileChange (e) {
      // 用户选中的文件对象e.target.files[0]
      // 当未选择任何图片文件时，阻止后续代码执行
      if (e.target.files.length === 0) return
      // 创建一个FormData表单对象
      const formData = new FormData()
      // 请求体里加入一对参数对象
      formData.append('photo', e.target.files[0])
      // 发送网络请求
      const res = await editUserPhotoAPI(formData)
      // 当网络请求成功时
      if (res.status === 200) {
        this.userDataList.photo = res.data.data.photo
      } else {
        // 当网络请求失败时
        // 提示用户
        Notify({ type: 'warning', message: '网络错误，修改头像失败，请稍后重试' })
      }
    },
    // 当点击修改名称时
    editNameFn () {
      // 弹出弹出框
      this.isDialogName = true
      // 显示默认原始名称
      this.username = this.userDataList.name
      // 开启定时器使输入框聚焦
      this.timer = setInterval(() => {
        this.$refs.editNameRef.focus()
      })
    },
    // 名称修改弹出层-关闭前方法
    async onNameDialogBeforeClose (action, done) {
      // 当点击确定时
      if (action === 'confirm') {
        // 正则表达式校验名称格式
        const reg = /^[A-Za-z0-9\u4e00-\u9fa5]{1,7}$/
        // 当满足正则条件时
        if (reg.test(this.username)) {
          // 发起网络请求
          const res = await editUserDataAPI({
            name: this.username
          })
          // 当网络请求成功时
          if (res.status === 200) {
            // 更新页面显示的名字
            this.userDataList.name = this.username
            // 清除定时器
            clearInterval(this.timer)
            // 关闭弹窗
            done()
          } else {
            // 当网络请求失败时
            // 提示用户
            Notify({ type: 'warning', message: '网络错误，修改名称失败，请稍后重试' })
            // 阻止弹窗关闭
            done(false)
          }
        } else {
          // 提示用户
          Notify({ type: 'warning', message: '用户名中英文和数字1-7位' })
          // 阻止弹窗关闭
          done(false)
        }
      } else {
        // 当点击取消时
        // 清除定时器
        clearInterval(this.timer)
        // 关闭弹窗
        done()
      }
    },
    // 当点击修改性别时
    editSexFn () {
      // 显示弹出框
      this.isDialogSex = true
      // 展示初始状态下的性别
      this.radio = this.userDataList.gender.toString()
    },
    // 性别修改弹出层-关闭前方法
    async onSexDialogBeforeClose (action, done) {
      // 当点击确定时
      if (action === 'confirm') {
        // 发起网络请求
        const res = await editUserDataAPI({
          gender: this.radio
        })
        // 当网络请求成功时
        if (res.status === 200) {
          // 更新页面显示的性别
          this.userDataList.gender = Number(this.radio)
          // 关闭弹窗
          done()
        } else {
          // 当网络请求失败时
          // 提示用户
          Notify({ type: 'warning', message: '网络错误，修改性别失败，请稍后重试' })
          // 阻止弹窗关闭
          done(false)
        }
      } else {
        // 当点击取消时
        // 关闭弹窗
        done()
      }
    },
    // 当点击修改生日时
    editAgeFn () {
      // 显示弹出框
      this.isDialogAge = true
      // 默认展示当前生日的年月日
      this.currentDate = new Date(this.userDataList.birthday)
    },
    // 当点击修改生日的确定按钮时
    async onAgePopupBeforeClose () {
      // 发起网络请求
      const res = await editUserDataAPI({
        birthday: moment(this.currentDate)
      })
      // 当网络请求成功时
      if (res.status === 200) {
        // 更新页面显示的生日
        this.userDataList.birthday = moment(this.currentDate)
        // 关闭弹出框
        this.isDialogAge = false
      } else {
        // 当网络请求失败时
        // 提示用户
        Notify({ type: 'warning', message: '网络错误，修改生日失败，请稍后重试' })
        // 关闭弹出框
        this.isDialogAge = false
      }
    },
    // 当修改个性签名时
    async editIntroFn (e) {
      // 当输入框内容为空时，阻止代码继续执行
      if (e.target.value.length === 0) return false
      // 发送网络请求
      const res = await editUserDataAPI({
        intro: this.message
      })
      // 当网络请求成功时
      if (res.status === 200) {
        // 更新页面显示的签名
        this.userDataList.intro = this.message
      } else {
        // 当网络请求失败时
        // 提示用户
        Notify({ type: 'warning', message: '网络错误，修改签名失败，请稍后重试' })
      }
    }
  },
  async created () {
    const res = await getUserDataAPI()
    if (res.status === 200) {
      this.userDataList = res.data.data
    }
    // 默认显示原始个性签名中的内容
    this.message = this.userDataList.intro
  }
}
</script>

<style lang="less" scoped>
.van-nav-bar {
  background-color: #007bff;
}
/deep/ .van-nav-bar__title {
  color: white;
}
/deep/ .van-nav-bar .van-icon {
  color: white;
}
/deep/ .van-field__label {
  color: #323233;
  font-size: 0.37333rem;
}
/deep/ .textArea textarea::placeholder {
  float: right;
}
/deep/ .textArea .van-field__control {
  color: #969799;
}
/deep/ .textArea .van-field__word-limit {
  color: #969799;
}
.img-icon {
    height: 15px;
}
.editSex {
  margin: 15px 0px 10px 112px;
}
.user-edit-container {
  padding-top: 46px;
  .avatar {
    width: 50px;
    height: 50px;
  }
}
</style>
