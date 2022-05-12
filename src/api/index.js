// 统一封装接口方法
// 每个方法负责请求一个url地址

// 导入axios
import axios from '../utils/request.js'
// 导入封装token的方法
import { getToken } from '../utils/token.js'

// 登录注册
export const loginAPI = ({ mobile, code }) => axios({
  url: '/v1_0/authorizations',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  data: {
    mobile,
    code
  }
})

// 获取所有频道
export const getAllChannelsAPI = () => axios({
  url: '/v1_0/channels',
  method: 'GET'
})

// 获取用户的频道
export const getUserChannelAPI = () => axios({
  url: '/v1_0/user/channels',
  method: 'GET',
  headers: {
    Authorization: 'Bearer ' + getToken()
  }
})

// 获取文章新闻推荐
export const articlesListAPI = ({ channel_id, timestamp }) => axios({
  url: '/v1_0/articles',
  method: 'GET',
  headers: {
    Authorization: 'Bearer ' + getToken()
  },
  params: {
    channel_id,
    timestamp
  }
})

// 获取对文章不喜欢的
export const articleDislikeAPI = (target) => axios({
  url: '/v1_0/article/dislikes',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + getToken()
  },
  data: {
    target
  }
})

// 获取举报文章
export const articleReportsAPI = ({ target, type }) => axios({
  url: '/v1_0/article/reports',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + getToken()
  },
  data: {
    target,
    type,
    remark: '暂无'
  }
})
