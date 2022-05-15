<template>
  <div>
    <!-- 评论列表 -->
    <div
      class="cmt-list"
      :class="isShowComInput ? 'art-cmt-container-2' : 'art-cmt-container-1'"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        :immediate-check="false"
        finished-text="没有更多评论了，请发表评论"
        @load="onLoad"
      >
        <!-- 评论的 Item 项 -->
        <div class="cmt-item" v-for="item in commentList" :key="item.com_id">
          <!-- 头部区域 -->
          <div class="cmt-header">
            <!-- 头部左侧 -->
            <div class="cmt-header-left">
              <img :src="item.aut_photo" alt="" class="avatar" />
              <span class="uname">{{ item.aut_name }}</span>
            </div>
            <!-- 头部右侧 -->
            <div class="cmt-header-right">
              <van-icon
                name="like"
                size="16"
                color="red"
                @click="likeFn(true, item)"
                v-if="item.is_liking === true"
              />
              <van-icon
                name="like-o"
                size="16"
                color="gray"
                @click="likeFn(false, item)"
                v-else
              />
            </div>
          </div>
          <!-- 主体区域 -->
          <div class="cmt-body">
            {{ item.content }}
          </div>
          <!-- 尾部区域 -->
          <div class="cmt-footer">{{ timeAgo(item.pubdate) }}</div>
        </div>
      </van-list>
    </div>

    <!-- 发表评论区域 -->
    <div>
      <!-- 底部添加评论区域 - 1 -->
      <div
        class="add-cmt-box van-hairline--top"
        v-if="isShowComInput === false"
      >
        <van-icon name="arrow-left" size="0.48rem" @click="$router.back()" />
        <div class="ipt-cmt-div" @click="isShowComInput = true">发表评论</div>
        <div class="icon-box">
          <van-badge :content="totalCount" max="99">
            <van-icon name="comment-o" size="0.53333334rem" @click="moveFn" />
          </van-badge>
          <van-icon name="star-o" size="0.53333334rem" />
          <van-icon name="share-o" size="0.53333334rem" />
        </div>
      </div>
      <!-- 底部添加评论区域 - 2 -->
      <div class="cmt-box van-hairline--top" v-else>
        <textarea
          placeholder="友善评论、理性发言、阳光心灵"
          v-model.trim="comValue"
          v-autoFocus
          @blur="blurFn"
        ></textarea>
        <van-button
          type="default"
          @click="sendCommentFn"
          :disabled="comValue.length === 0"
          >发布</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
// 导入封装的api方法
import { commentListAPI, sendCommentAPI, commentLikingAPI, commentDisLikingAPI } from '../../api/index'
// 导入时间格式化方法
import { timeAgo } from '../../utils/day'

export default {
  name: 'CommentList',
  data () {
    return {
      // 用于存储评论列表数据
      commentList: [],
      // 评论框是否展示
      isShowComInput: false,
      // 评论总数
      totalCount: '',
      // 发布的评论内容
      comValue: '',
      // 底部加载状态
      loading: false,
      // 数据是否全部加载完成
      finished: false,
      // 分页
      lastId: null
    }
  },
  methods: {
    // 获取文章评论数据的方法
    async getCommentList () {
      const res = await commentListAPI({
        source: this.$route.query.aid
      })
      // 当网络请求成功时
      if (res.status === 200) {
        this.commentList = res.data.data.results
        this.lastId = res.data.data.last_id
        // 有评论则展示评论数，无评论则不展示评论数
        this.totalCount = res.data.data.total_count || ''
        // 当没有评论时，默认显示提示文本
        if (res.data.data.results.length === 0) {
          this.finished = true
        }
      }
    },
    timeAgo: timeAgo,
    // 评论点赞或者取消点赞
    async likeFn (bool, obj) {
      if (bool === true) {
        obj.is_liking = false
        await commentDisLikingAPI({
          target: obj.com_id
        })
      } else {
        obj.is_liking = true
        await commentLikingAPI({
          target: obj.com_id
        })
      }
    },
    // 点击评论小图标快速滚动到评论内容区域
    moveFn () {
      document.querySelector('.like-box').scrollIntoView({
        behavior: 'smooth'
      })
    },
    // 当文本框失去焦点时
    blurFn () {
      // v-if会动态移除与否DOM，应延迟执行，以便能正常发布评论
      setTimeout(() => {
        this.isShowComInput = false
      }, 0)
    },
    // 当点击发布评论按钮时
    async sendCommentFn () {
      const res = await sendCommentAPI({
        target: this.$route.query.aid,
        content: this.comValue
      })
      if (res.status === 201) {
        // 将发布的评论对象添加到评论列表最前面
        this.commentList.unshift(res.data.data.new_obj)
        // 评论数量增加
        this.totalCount++
        // 清空发布的评论内容
        this.comValue = ''
        // 调用方法滚到到当前发布评论内容处
        this.moveFn()
      }
    },
    // 底部加载事件
    async onLoad () {
      if (this.commentList.length > 0) {
        // 请求下一页数据
        const res = await commentListAPI({
          source: this.$route.query.aid,
          offset: this.lastId
        })
        // 当网络请求成功时
        if (res.status === 200) {
          this.commentList = [...this.commentList, ...res.data.data.results]
          this.lastId = res.data.data.last_id
          // 有评论则展示评论数，无评论则不展示评论数
          this.totalCount = res.data.data.total_count || ''
          // 没有下一页数据了
          if (res.data.data.last_id === null) {
            this.finished = true
          }
          this.loading = false
        }
      } else {
        this.loading = false
      }
    }
  },
  created () {
    // 调用获取文章评论数据的方法
    this.getCommentList()
  }
}
</script>

<style scoped lang="less">
.cmt-list {
  padding: 10px;
  .cmt-item {
    padding: 15px 0;
    + .cmt-item {
      border-top: 1px solid #f8f8f8;
    }
    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cmt-header-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }
        .uname {
          font-size: 12px;
        }
      }
    }
    .cmt-body {
      font-size: 14px;
      line-height: 28px;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
    }
    .cmt-footer {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }
}

.art-cmt-container-1 {
  padding-bottom: 46px;
}
.art-cmt-container-2 {
  padding-bottom: 80px;
}

// 发布评论的盒子 - 1
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  line-height: 46px;
  padding-left: 10px;
  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    padding-left: 15px;
    margin-left: 10px;
    background-color: #f8f8f8;
  }
  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}

.child {
  width: 20px;
  height: 20px;
  background: #f2f3f5;
}

// 发布评论的盒子 - 2
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;
  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }
  .van-button {
    height: 100%;
    border: none;
  }
}
</style>
