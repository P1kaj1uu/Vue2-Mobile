import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入flexible.js，设置移动端根标签字体大小
import 'amfe-flexible'
// 注册Vant组件库
import Vant from 'vant'
import 'vant/lib/index.css'

Vue.use(Vant)

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
