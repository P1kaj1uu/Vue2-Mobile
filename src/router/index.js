import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入封装的token方法
import { getToken } from '../utils/token'

// 导入所需要的组件
// import Login from '../views/Login/index.vue'
// import Layout from '../views/Layout/index.vue'
// import Home from '../views/Home/index.vue'
// import User from '../views/User/index.vue'
// import Search from '../views/Search/index.vue'
// import SearchResult from '../views/Search/SearchResult.vue'
// import ArticleDetail from '../views/ArticleDetail/index.vue'
// import UserEdit from '../views/User/UserEdit.vue'
// import UserFollow from '../views/User/UserFollow.vue'
// import UserFan from '../views/User/UserFan.vue'
// import Chat from '../views/Chat/index.vue'

// 路由懒加载
// 目的：为了让第一个页面，加载的app.js小一点，打开网页快一点
// 思路：把组件对应的js，分成若干个js，路由切换到哪个页面，才去加载对应的js文件
// 解决：当路由路径匹配规则时，才去import引入对应的组件js文件

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/layout' },
  { path: '/login', component: () => import(/* webpackChunkName: "Login" */ '../views/Login/index.vue') },
  {
    path: '/layout',
    component: () => import(/* webpackChunkName: "Layout" */ '../views/Layout/index.vue'),
    redirect: '/layout/home',
    children: [
      {
        path: 'home',
        component: () => import(/* webpackChunkName: "Home" */ '../views/Home/index.vue'),
        // 添加额外信息，以便切换返回滚动条位置
        meta: {
          // 滚动条位置
          scrollT: 0
        }
      },
      {
        path: 'user',
        component: () => import(/* webpackChunkName: "User" */ '../views/User/index.vue')
      }
    ]
  },
  { path: '/search', component: () => import(/* webpackChunkName: "Search" */ '../views/Search/index.vue') },
  { path: '/search/:keywords', component: () => import(/* webpackChunkName: "SearchResult" */ '../views/Search/SearchResult.vue') },
  { path: '/detail', component: () => import(/* webpackChunkName: "ArticleDetail" */ '../views/ArticleDetail/index.vue') },
  { path: '/user_edit', component: () => import(/* webpackChunkName: "UserEdit" */ '../views/User/UserEdit.vue') },
  { path: '/user_follow', component: () => import(/* webpackChunkName: "UserFollow" */ '../views/User/UserFollow.vue') },
  { path: '/user_fan', component: () => import(/* webpackChunkName: "UserFan" */ '../views/User/UserFan.vue') },
  { path: '/chat', component: () => import(/* webpackChunkName: "Chat" */ '../views/Chat/index.vue') }
]

const router = new VueRouter({
  routes
})

// 路由前置全局守卫（在路由发生真正跳转之前，会执行该函数）
router.beforeEach((to, from, next) => {
  // 有token, 不能去登录页
  // 无token, 需要用户"权限"的才需要去登录页
  if (getToken()?.length > 0 && to.path === '/login') {
    // 返回到首页
    next('/layout/home')
  } else {
    next()
  }
})

export default router
