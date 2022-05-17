<template>
  <div class="user-container">
    <!-- 用户基本信息面板 -->
    <div class="user-card">
      <!-- 用户头像、姓名 -->
      <van-cell>
        <!-- 使用 title 插槽来自定义标题 -->
        <template #icon>
          <img :src="userInfoList.photo" alt="" class="avatar">
        </template>
        <template #title>
          <span class="username">{{ userInfoList.name }}</span>
        </template>
        <template #label>
          <van-tag color="#fff" text-color="#007bff" v-if="userInfoList.is_media === 0">申请认证</van-tag>
          <van-tag color="#fff" text-color="#007bff" v-else>自媒体</van-tag>
        </template>
        <template #extra>
          <span class="info">{{ userInfoList.intro }}</span>
        </template>
      </van-cell>
      <!-- 动态、关注、粉丝 -->
      <div class="user-data">
        <div class="user-data-item">
          <span>{{ userInfoList.art_count }}</span>
          <span>动态</span>
        </div>
        <div class="user-data-item" @click="$router.push('/user_follow')">
          <span>{{ userInfoList.follow_count }}</span>
          <span>关注</span>
        </div>
        <div class="user-data-item" @click="$router.push('/user_fan')">
          <span>{{ userInfoList.fans_count }}</span>
          <span>粉丝</span>
        </div>
      </div>
    </div>

    <!-- 操作面板 -->
    <van-cell-group class="action-card">
      <van-cell icon="edit" title="编辑资料" is-link to="/user_edit" />
      <van-cell icon="chat-o" title="小思同学" is-link to="/chat" />
      <van-cell icon="warning-o" title="退出登录" is-link @click="quitLogin" />
    </van-cell-group>
  </div>
</template>

<script>
import { Dialog, Notify } from 'vant'
// 导入封装的api方法
import { getUserInfoAPI } from '../../api/index'
// 导入封装token的方法
import { removeToken } from '../../utils/token'

export default {
  name: 'User',
  data () {
    return {
      // 用于存储用户个人信息
      userInfoList: []
    }
  },
  methods: {
    // 当点击退出登录时
    quitLogin () {
      Dialog.confirm({
        title: '提示',
        message: '确定退出登录吗？'
      }).then(() => {
        // 调用方法的方法，清空token
        removeToken()
        // 跳转到登录页面
        this.$router.replace('/login')
        // 提示退出登录成功
        Notify({ type: 'success', message: '退出成功' })
      }).catch(() => {})
    }
  },
  async created () {
    // 调用获取用户自己信息
    const res = await getUserInfoAPI()
    if (res.status === 200) {
      this.userInfoList = res.data.data
    }
  }
}
</script>

<style scoped lang="less">
.user-container {
  .user-card {
    background-color: #007bff;
    color: white;
    padding-top: 20px;
    .van-cell {
      background: #007bff;
      color: white;
      &::after {
        display: none;
      }
      .avatar {
        width: 60px;
        height: 60px;
        background-color: #fff;
        border-radius: 50%;
        margin-right: 10px;
      }
      .username {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
  .user-data {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    font-size: 14px;
    padding: 30px 0;
    .user-data-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 33.33%;
    }
  }
}
.info {
  position: absolute;
  left: 23%;
  top: 72%;
  width: 50%;
  // 强制在一行上显示
  white-space: nowrap;
  // 超出部分用省略号代替
  text-overflow: ellipsis;
  // 超出部分隐藏
  overflow: hidden;
}
</style>
