// 统一封装接口方法
// 每个方法负责请求一个url地址

// 导入axios
import axios from '../utils/request'

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
