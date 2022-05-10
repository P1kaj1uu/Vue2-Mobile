<template>
 <div>
   <van-nav-bar title="IT头条-登录"/>
   <div>
     <van-form @submit="onSubmit">
        <van-field
          v-model="user.mobile"
          required
          name="mobile"
          label="手机号"
          autocomplete="off"
          placeholder="请输入11位的手机号"
          :rules="[{ required: true, message: '请填写正确的手机号', pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/ }]"
        />
        <van-field
          v-model="user.code"
          required
          type="password"
          name="code"
          label="密码"
          autocomplete="off"
          placeholder="请输入6位的密码"
          :rules="[{ required: true, message: '请填写正确的密码', pattern: /^\d{6}$/ }]"
        />
        <div style="margin: 16px;">
          <van-button round block type="info" :disabled="isLoading" :loading="isLoading" loading-text="正在登录中..." native-type="submit">登录</van-button>
        </div>
      </van-form>
    </div>
 </div>
</template>

<script>
// 导入封装的接口方法
import { loginAPI } from '../../api/index.js'
// 导入封装token的方法
import { setToken } from '../../utils/token.js'
import { Notify } from 'vant'

export default {
  name: 'Login',
  data () {
    return {
      user: {
        // 手机号
        mobile: '13888888888',
        // 验证码(此处用密码代替，密码必须是246810)
        code: '246810'
      },
      // 节流防抖，避免频繁发起网络请求，并增加用户体验
      // 登录按钮加载状态，默认false，不显示loading提示
      isLoading: false
    }
  },
  methods: {
    async onSubmit (values) {
      // 开启节流阀
      this.isLoading = true
      console.log('submit', values)
      try {
        const res = await loginAPI({
          mobile: this.user.mobile,
          code: this.user.code
        })
        // 登录成功后关闭
        this.isLoading = false
        Notify({ type: 'success', message: '登录成功' })
        // 调用设置token的方法
        setToken(res.data.data.token)
        console.log(res)
      } catch (err) {
        Notify({ type: 'danger', message: '手机号或密码错误' })
        // 登录失败也关闭
        this.isLoading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.van-nav-bar {
  background-color: #007bff;
}
// 覆盖第三方组件库内部的样式用/deep/
/deep/ .van-nav-bar__title {
  color: white;
}
</style>
