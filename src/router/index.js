import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入所需要的组件
import Login from '../views/Login/index.vue'
import Layout from '../views/Layout/index.vue'
import Home from '../views/Home/index.vue'
import User from '../views/User/index.vue'
import Search from '../views/Search/index.vue'
import SearchResult from '../views/Search/SearchResult.vue'
import ArticleDetail from '../views/ArticleDetail/index.vue'
import UserEdit from '../views/User/UserEdit.vue'
import UserFollow from '../views/User/UserFollow.vue'
import UserFan from '../views/User/UserFan.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/layout' },
  { path: '/login', component: Login },
  {
    path: '/layout',
    component: Layout,
    redirect: '/layout/home',
    children: [
      { path: 'home', component: Home },
      { path: 'user', component: User }
    ]
  },
  { path: '/search', component: Search },
  { path: '/search/:keywords', component: SearchResult },
  { path: '/detail', component: ArticleDetail },
  { path: '/user_edit', component: UserEdit },
  { path: '/user_follow', component: UserFollow },
  { path: '/user_fan', component: UserFan }
]

const router = new VueRouter({
  routes
})

export default router
