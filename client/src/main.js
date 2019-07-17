import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import moment from 'moment'

import iView from 'iview'
import 'iview/dist/styles/iview.css'
import 'animate.css'

import App from './App.vue'
import LoginRegisterPage from './page/LoginRegister'
import HomePage from './page/home'
import isAuth from './api/auth'
import { store } from './store'


Vue.use(iView)
Vue.use(VueRouter)

Vue.config.productionTip = false

//添加路由
const routes = [
    { path: '/login', component: LoginRegisterPage },
    { path: '/home', component: HomePage }
]

const router = new VueRouter({
    mode: 'history',
    routes
})

//全局前置守卫路由 对于非白名单的页面进行登录验证
router.beforeEach(async (to, from, next) => {
    const path = to.path
    console.log('path',path)
    const whiteList = ['/login']
    if(whiteList.includes(path)){
        next()
    }else{
        const res = await isAuth()
        console.log('res',res.data);
        if(res.data.status){
            store.user=res.data.data;
            next()
        }else{
            next('/login')
        }
    }
})

//添加全局属性
Vue.use({
    install(Vue, options){
        Vue.prototype.$http=axios;
        Vue.prototype.$store=store;
        Vue.prototype.$moment=moment;
        moment.locale('zh-cn');
    }
})

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
