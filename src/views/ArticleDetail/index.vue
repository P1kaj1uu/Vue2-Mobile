<template>
  <div>
    <!-- Header 区域 -->
    <van-nav-bar
      fixed
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 文章信息区域 -->
    <div class="article-container">
      <!-- 文章标题 -->
      <h1 class="art-title">{{ artDetailList.title }}</h1>

      <!-- 用户信息 -->
      <van-cell center :title="artDetailList.aut_name" :label="artDetailList.pubdate">
        <template #icon>
          <img :src="artDetailList.aut_photo" alt="" class="avatar" />
        </template>
        <template #default>
          <div @click="followFn">
            <van-button type="info" size="mini" v-if="artDetailList.is_followed">已关注</van-button>
            <van-button icon="plus" type="info" size="mini" plain v-else
              >关注</van-button
            >
          </div>
        </template>
      </van-cell>

      <!-- 分割线 -->
      <van-divider></van-divider>

      <!-- 文章内容 -->
      <div class="art-content" v-html="artDetailList.content"></div>

      <!-- 分割线 -->
      <van-divider>End</van-divider>

      <!-- 点赞 -->
      <div class="like-box" @click="attitudeFn">
        <van-button icon="good-job" type="danger" size="small" v-if="artDetailList.attitude === 1"
          >已点赞</van-button
        >
        <van-button icon="good-job-o" type="danger" plain size="small" v-else
          >点赞</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
// 导入封装的api方法
import { articleDetailAPI, followedUserAPI, unFollowedUserAPI, articleLikeAPI, articleDisLikeAPI } from '../../api/index'

export default {
  name: 'ArticleDetail',
  data () {
    return {
      // 用于存储文章详情数据
      artDetailList: []
    }
  },
  methods: {
    // 点击已关注或者关注
    async followFn (e) {
      const span = e.target.querySelector('span')
      if (span.innerHTML === '已关注') {
        this.artDetailList.is_followed = false
        await unFollowedUserAPI({
          target: this.artDetailList.aut_id
        })
      } else {
        this.artDetailList.is_followed = true
        await followedUserAPI({
          target: this.artDetailList.aut_id
        })
      }
    },
    // 点击已点赞或者点赞
    async attitudeFn (e) {
      const span = e.target.querySelector('span')
      if (span.innerHTML === '已点赞') {
        this.artDetailList.attitude = 0
        await articleDisLikeAPI({
          target: this.$route.query.aid
        })
      } else {
        this.artDetailList.attitude = 1
        await articleLikeAPI({
          target: this.$route.query.aid
        })
      }
    }
  },
  async created () {
    const res = await articleDetailAPI({
      article_id: this.$route.query.aid
    })
    if (res.status === 200) {
      this.artDetailList = res.data.data
    }
  }
}
</script>

<style scoped lang="less">
.van-nav-bar {
  background-color: #007BFF;
}
/deep/ .van-nav-bar__title {
  color: white;
}
/deep/ .van-nav-bar .van-icon {
  color: white;
}
.article-container {
  padding: 10px;
  margin-top: 46px;
}
.art-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}

.art-content {
  font-size: 12px;
  line-height: 24px;
  width: 100%;
  overflow-x: scroll;
  word-break: break-all;
  /deep/ img {
    width: 100%;
  }
  /deep/ pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}

.van-cell {
  padding: 5px 0;
  &::after {
    display: none;
  }
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px;
  border: none;
}

.like-box {
  display: flex;
  justify-content: center;
}
</style>
