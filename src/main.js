import Vue from 'vue'
import App from './App'
import store from './store'
// 时间格式化
import './utils/monent'
// 原型方法
import './utils/prototype'
// 全局混入
import { mixins } from './utils/mixins'

Vue.mixin(mixins)
Vue.config.productionTip = false

new Vue({
  mpType: 'app',
  store,
  ...App
}).$mount()
