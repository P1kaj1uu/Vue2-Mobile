<template>
  <!-- 一条文章单元格 -->
  <van-cell>
    <!-- 标题区域的插槽 -->
    <template #title>
      <div class="title-box">
        <!-- 标题 -->
        <span>{{ obj.title }}</span>
        <!-- 单图 -->
        <img class="thumb" :src="obj.cover.images[0]" v-if="obj.cover.type === 1" />
      </div>
      <!-- 三张图片 -->
      <div class="thumb-box" v-if="obj.cover.type > 1">
        <img class="thumb"
        v-for="(imgUrl, index) in obj.cover.images"
        :key="index"
        :src="imgUrl" />
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
        <van-icon name="cross" />
      </div>
    </template>
  </van-cell>
</template>

<script>
export default {
  props: {
    // 文章对象信息
    obj: {
      type: Object,
      default () {
        return {}
      }
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
.label-box span{
    margin: 0 3px;
    &:first-child{
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
