<template>
  <div>
    <!-- 一条文章单元格 -->
    <van-cell @click="cellClickFn">
      <!-- 标题区域的插槽 -->
      <template #title>
        <div class="title-box">
          <!-- 标题 -->
          <span>{{ obj.title }}</span>
          <!-- 单图 -->
          <!-- <img
            class="thumb"
            :src="obj.cover.images[0]"
            v-if="obj.cover.type === 1"
          /> -->
          <van-image class="thumb" :src="obj.cover.images[0]" v-if="obj.cover.type === 1">
            <template v-slot:error>暂无图片</template>
          </van-image>
        </div>
        <!-- 三张图片 -->
        <div class="thumb-box" v-if="obj.cover.type > 1">
          <!-- <img
            class="thumb"
            v-for="(imgUrl, index) in obj.cover.images"
            :key="index"
            :src="imgUrl"
          /> -->
          <van-image
          class="thumb"
          v-for="(imgUrl, index) in obj.cover.images"
          :key="index"
          :src="imgUrl">
            <template v-slot:error>暂无图片</template>
          </van-image>
        </div>
      </template>
      <!-- label 区域的插槽 -->
      <template #label>
        <div class="label-box">
          <div>
            <span>{{ obj.aut_name }}</span>
            <span>{{ obj.comm_count }}评论</span>
            <span>{{ obj.pubdate }}</span>
          </div>
          <!-- 反馈按钮 -->
          <van-icon name="cross" @click.stop="onCloseClick" v-if="isShow" />
        </div>
      </template>
    </van-cell>
    <!-- 反馈面板 -->
    <van-action-sheet
      v-model="show"
      :actions="actions"
      get-container="body"
      :cancel-text="cancelText"
      close-on-click-action
      @select="onSelect"
      @cancel="onCancel"
      @close="onClose"
    />
  </div>
</template>

<script>
import { Notify } from 'vant'
import { firstActions, secondActions } from '../api/report.js'
import { articleDislikeAPI, articleReportsAPI } from '../api/index.js'

export default {
  name: 'ArticleItem',
  props: {
    // 文章对象信息
    obj: {
      type: Object,
      default () {
        return {}
      }
    },
    isShow: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      show: false,
      actions: firstActions,
      // 反馈面板中的取消框内容
      cancelText: '取消'
    }
  },
  methods: {
    // 当点击了反馈面板时
    async onSelect (action) {
      // 默认情况下点击选项时不会自动收起
      if (action.name === '不感兴趣') {
        const res = await articleDislikeAPI(this.obj.art_id)
        console.log(res)
        if (res.status === 201) {
          Notify({ type: 'success', message: '反馈成功' })
        } else {
          Notify({ type: 'danger', message: '反馈失败-请联系管理员' })
        }
      } else if (action.name === '反馈垃圾内容') {
        this.actions = secondActions
        this.cancelText = '返回'
        this.show = true
      } else {
        const res = await articleReportsAPI({
          target: this.obj.art_id,
          type: action.value
        })
        console.log(res)
        if (res.status === 201) {
          Notify({ type: 'success', message: '举报成功' })
        } else {
          Notify({ type: 'danger', message: '举报失败-请联系管理员' })
        }
      }
    },
    // 点击叉叉弹出反馈面板
    onCloseClick () {
      this.show = true
    },
    // 取消事件
    onCancel () {
      if (this.cancelText === '返回') {
        this.actions = firstActions
        this.cancelText = '取消'
        this.show = true
      }
    },
    // 当关闭面板时
    onClose () {
      this.actions = firstActions
      this.cancelText = '取消'
    },
    // 点击文章单元格时，跳转文章详情页面
    cellClickFn () {
      this.$router.push(`/detail?aid=${this.obj.art_id}`)
    }
  }
}
</script>

<style scoped lang="less">
/* 标题样式 */
.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

/* label描述样式 */
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 文章信息span */
.label-box span {
  margin: 0 3px;
  &:first-child {
    margin-left: 0;
  }
}

/* 图片的样式, 矩形黄金比例：0.618 */
.thumb {
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}

/* 三图, 图片容器 */
.thumb-box {
  display: flex;
  justify-content: space-between;
}
</style>
