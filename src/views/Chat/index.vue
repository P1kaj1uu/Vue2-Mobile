<template>
  <div class="container">
    <!-- 固定导航 -->
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小思同学"></van-nav-bar>

    <!-- 聊天主体区域 -->
    <div class="chat-list">
      <div v-for="(item, index) in list" :key="index">
          <!-- 左侧是机器人小思 -->
          <div class="chat-item left" v-if="item.name !== 'me'">
            <van-image fit="cover" round src="https://img.yzcdn.cn/vant/cat.jpeg" />
            <div class="chat-pao">{{ item.msg }}</div>
          </div>

          <!-- 右侧是当前用户 -->
          <div class="chat-item right" v-else>
            <div class="chat-pao">{{ item.msg }}</div>
            <van-image fit="cover" round :src="user.photo" />
          </div>
       </div>
    </div>

    <!-- 对话区域 -->
    <div class="reply-container van-hairline--top">
      <van-field v-model="word"  placeholder="说点什么...">
        <template #button>
          <span style="font-size:12px;color:#999" @click="sendMsg">提交</span>
        </template>
      </van-field>
    </div>
  </div>
</template>

<script>
// 导入socket.io-client包
import { io } from 'socket.io-client'
// 导入封装的token方法
import { getToken } from '../../utils/token'
// 导入封装的api方法
import { getUserInfoAPI } from '../../api/index'

export default {
  name: 'Chat',
  data () {
    return {
      // 用于存储用户信息
      user: [],
      // 设置加载不出来时的默认头像
      unImg: 'https://img2.baidu.com/it/u=1898474729,1612489909&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
      // 用户输入框中的内容
      word: '',
      // 模拟的聊天信息
      list: [
        { name: 'xs', msg: 'hi，你好！我是小思' }
      ],
      // 客户端和服务器端建立连接的socket对象,用于存储websocket实例
      socket: null
    }
  },
  async created () {
    // 发送网络请求
    const res = await getUserInfoAPI()
    if (res.status === 200) {
      this.user = res.data.data
    } else {
      this.user.photo = this.unImg
    }
    // 创建客户端websocket的实例
    this.socket = io('http://geek.itheima.net', {
      query: {
        token: getToken()
      },
      transports: ['websocket']
    })
    // 与服务器建立连接的事件
    this.socket.on('connect', () => {})
    // 接收服务器端传回来的消息
    this.socket.on('message', data => {
      // 把服务器发送过来的消息，存储到list数组中
      this.list.push({
        name: 'xs',
        msg: data.msg
      })
      // 消息滚动到底部
      this.$nextTick(() => {
        // 获取到所有的聊天Item项
        const chatItem = document.querySelectorAll('.chat-item')
        // 获取到最后一项对应的 DOM 元素
        const lastItem = chatItem[chatItem.length - 1]
        // 调用scrollIntoView()方法，显示这个元素
        lastItem.scrollIntoView({
          // 动画平滑
          behavior: 'smooth'
        })
      })
    })
  },
  methods: {
    // 当点击提交按钮时,向服务器端发送消息
    sendMsg () {
      // 判断用户输入框中内容是否为空
      if (this.word.trim().length === 0) return false
      // 添加聊天消息到list列表中
      this.list.push({
        name: 'me',
        msg: this.word
      })
      // 客户端调用socket.emit('message', 消息内容)方法把消息发送给websocket服务器
      this.socket.emit('message', {
        msg: this.word,
        timestamp: new Date().getTime()
      })
      // 消息滚动到底部
      this.$nextTick(() => {
        // 获取到所有的聊天Item项
        const chatItem = document.querySelectorAll('.chat-item')
        // 获取到最后一项对应的 DOM 元素
        const lastItem = chatItem[chatItem.length - 1]
        // 调用scrollIntoView()方法，显示这个元素
        lastItem.scrollIntoView({
          // 动画平滑
          behavior: 'smooth'
        })
      })
      // 清空用户输入框中的内容
      this.word = ''
    }
  },
  // 组件被销毁之前，清空sock对象
  beforeDestroy () {
    // 关闭连接
    this.socket.close()
    // 销毁websocket实例对象
    this.socket = null
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
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background: #fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item {
      padding: 10px;
      .van-image {
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao {
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before {
          content: '';
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top: 0.5px solid #c2d9ea;
          border-right: 0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right {
  text-align: right;
  .chat-pao {
    margin-left: 0;
    margin-right: 15px;
    &::before {
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left {
  text-align: left;
  .chat-pao {
    margin-left: 15px;
    margin-right: 0;
    &::before {
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
