import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home';
Vue.use(Router)

// 引入收银
import shouyin from '@/components/shouyin'
// 引入登录
import login from '@/components/login'
// 引入商品列表
import goods from '@/components/goods'
// 引入收银记录
import orders from '@/components/orders'


export default new Router({
  routes: [
    {
      path: '/index',
      component: home,
      children:[
        {
          path: 'shouyin',
          name: 'shouyin',
          component: shouyin  
        },
        {
          path: 'goods',
          name: 'goods',
          component: goods  
        },
        {
          path: 'orders',
          name: 'orders',
          component: orders  
        },
      ]
    },
    {
      path: '/',
      component: login,
    }
  ]
})
