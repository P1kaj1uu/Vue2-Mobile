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

// 所有频道
export const getAllChannelsAPI = () => axios({
  url: '/v1_0/channels',
  method: 'GET'
})

// 用户的频道
export const getUserChannelAPI = () => axios({
  url: '/v1_0/user/channels',
  method: 'GET',
  headers: {
    Authorization: 'Bearer ' + getToken()
  }
})

// 文章新闻推荐
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

// 对文章不喜欢的
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

// 举报文章
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

// 更新频道
export const updateChannelAPI = ({ channels }) => axios({
  url: '/v1_0/user/channels',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + getToken()
  },
  data: {
    channels
  }
})

// 删除指定用户频道
export const deleteChannelAPI = (target) => axios({
  url: `/v1_0/user/channels/${target}`,
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: 'Bearer ' + getToken()
  }
})

// 获取联想建议（自动补全）
export const suggestListAPI = ({ q }) => axios({
  url: '/v1_0/suggestion',
  method: 'GET',
  params: {
    q
  }
})

// 获取搜索结果
export const searchResultListAPI = ({ page, q }) => axios({
  url: '/v1_0/search',
  method: 'GET',
  params: {
    page,
    q
  }
})

// 获取新闻详情
export const articleDetailAPI = ({ article_id }) => axios({
  url: `/v1_0/articles/${article_id}`,
  method: 'GET',
  headers: {
    Authorization: 'Bearer ' + getToken()
  }
})

// 关注用户
export const followedUserAPI = ({ target }) => axios({
  url: '/v1_0/user/followings',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + getToken()
  },
  data: {
    target
  }
})

// 取消关注用户
export const unFollowedUserAPI = ({ target }) => axios({
  url: `/v1_0/user/followings/${target}`,
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: 'Bearer ' + getToken()
  }
})

// 对文章点赞
export const articleLikeAPI = ({ target }) => axios({
  url: '/v1_0/article/likings',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + getToken()
  },
  data: {
    target
  }
})

// 取消对文章点赞
export const articleDisLikeAPI = ({ target }) => axios({
  url: `/v1_0/article/likings/${target}`,
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: 'Bearer ' + getToken()
  }
})

// 获取评论
export const commentListAPI = ({ source, offset = null, limit = 10 }) => axios({
  url: '/v1_0/comments',
  method: 'GET',
  params: {
    type: 'a',
    source,
    offset,
    limit
  }
})

// 对文章发布评论
export const sendCommentAPI = ({ target, content }) => axios({
  url: '/v1_0/comments',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + getToken()
  },
  data: {
    target,
    content
  }
})

// 对评论点赞
export const commentLikingAPI = ({ target }) => axios({
  url: '/v1_0/comment/likings',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + getToken()
  },
  data: {
    target
  }
})

// 对评论取消点赞
export const commentDisLikingAPI = ({ target }) => axios({
  url: `/v1_0/comment/likings/${target}`,
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: 'Bearer ' + getToken()
  }
})
