<template>
  <div>
    <!-- 弹出层的头部区域 -->
    <van-nav-bar title="频道管理">
      <template #right>
        <van-icon name="cross" size="0.37333334rem" color="white" @click="$emit('close')" />
      </template>
    </van-nav-bar>
    <!-- 我的频道 -->
    <div class="my-channel-box">
      <div class="channel-title">
        <span>我的频道
          <span class="small-title">
            {{ isEdit ? '点击删除频道' : '点击进入频道' }}
          </span>
        </span>
        <span @click="onEdit">{{ isEdit ? '完成' : '编辑' }}</span>
      </div>
      <!-- 我的频道列表 -->
      <van-row type="flex">
        <van-col span="6" v-for="item in userChannel" :key="item.id" @click="removeChannel(item)">
          <div class="channel-item van-hairline--surround">
            {{ item.name }}
            <!-- 删除的徽标 -->
            <van-badge color="transparent" class="cross-badge" v-show="isEdit && item.id !== 0">
              <template #content>
                <van-icon
                  name="cross"
                  class="badge-icon"
                  color="#cfcfcf"
                  size="0.32rem"
                />
              </template>
            </van-badge>
          </div>
        </van-col>
      </van-row>
    </div>

    <!-- 更多频道 -->
    <div class="more-channel-box">
      <div class="channel-title">
        <span>点击添加更多频道：</span>
      </div>
      <!-- 更多频道列表 -->
      <van-row type="flex">
        <van-col span="6" v-for="item in notChannelList" :key="item.id" @click="more(item)">
          <div class="channel-item van-hairline--surround">{{ item.name }}</div>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
// 导入封装的api方法
import { getAllChannelsAPI } from '../../api/index.js'

export default {
  name: 'ChannelEdit',
  props: {
    userChannel: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      // 用于存储所有频道列表
      allChannelList: [],
      // 用于控制删除的徽标是否显示
      isEdit: false
    }
  },
  async created () {
    const res = await getAllChannelsAPI()
    if (res.status === 200) {
      this.allChannelList = res.data.data.channels
    }
  },
  computed: {
    // 计算提取出未选中的频道列表数据
    notChannelList () {
      return this.allChannelList.filter(bigItem => {
        const index = this.userChannel.findIndex(smallItem => smallItem.id === bigItem.id)
        if (index === -1) return true
      })
    }
  },
  methods: {
    // 我的频道点击事件
    onEdit () {
      this.isEdit = !this.isEdit
    },
    // 更多频道点击事件
    more (channelObj) {
      // 处于编辑状态下
      if (this.isEdit === true) {
        this.$emit('addChannel', channelObj)
      }
    },
    // 点击删除频道
    removeChannel (item) {
      // 处于编辑状态下
      if (this.isEdit === true) {
        if (item.name !== '推荐') {
          this.$emit('remove', item)
        }
      } else {
        // 跳转对应的频道
        this.$emit('changeChannel', item)
        // 关闭弹出层
        this.$emit('close')
      }
    }
  }
}
</script>

<style scoped lang="less">
.van-nav-bar {
  background-color: #007bff;
}

/deep/ .van-nav-bar__title {
  color: white;
}

.van-popup,
.popup-container {
  background-color: transparent;
  height: 100%;
  width: 100%;
}

.popup-container {
  display: flex;
  flex-direction: column;
}

.pop-header {
  height: 90px;
  background-color: #007bff;
  color: white;
  text-align: center;
  font-size: 14px;
  position: relative;
  .title {
    width: 100%;
    position: absolute;
    bottom: 15px;
  }
}

.pop-body {
  flex: 1;
  overflow: scroll;
  padding: 8px;
  background-color: white;
}

.my-channel-box,
.more-channel-box {
  .channel-title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    line-height: 28px;
    padding: 0 6px;
  }
}

.channel-item {
  font-size: 12px;
  text-align: center;
  line-height: 36px;
  background-color: #fafafa;
  margin: 5px;
}

/*删除的微标 */
.cross-badge {
  position: absolute;
  right: -3px;
  top: 0;
  border: none;
}

/*提示文字 */
.small-title {
  font-size: 10px;
  color: gray;
}
</style>
