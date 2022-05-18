import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入flexible.js，设置移动端根标签字体大小
import 'amfe-flexible'
// 注册Vant组件库
import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.css'
// 引入文章详情页面代码高亮的样式
import 'highlight.js/styles/default.css'

Vue.use(Vant)
// 将图片懒加载注册为插件
Vue.use(Lazyload, {
  // 预加载高度的比例
  preLoad: 0.8,
  // 设置错误时的图片
  error: 'https://img2.baidu.com/it/u=3751095442,3459205618&fm=253&fmt=auto&app=138&f=JPEG?w=499&h=375'
})

Vue.config.productionTip = false

// 自定义全局自定义指令
Vue.directive('focus', {
  inserted (el) {
    // 获取input输入框元素
    const theInput = el.querySelector('input')
    theInput.focus()
  }
})
Vue.directive('autoFocus', {
  inserted (el) {
    // 为textarea自动聚焦
    el.focus()
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
