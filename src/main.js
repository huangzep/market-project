// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from 'views/App'
import router from './router'
import VConsole from 'vconsole'
var vConsole = new VConsole();
import FastClick from 'fastclick'
import './mixins/globalMixin.js'
import 'common/scss/globalStyle.scss' 
import 'vue-layer-mobile/need/layer.css'
import ToastPlugin from 'vux/src/plugins/toast'
import LoadingPlugin from 'vux/src/plugins/loading'
import WechatPlugin from 'vux/src/plugins/wechat'
import layer from 'vue-layer-mobile'


Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)
Vue.use(WechatPlugin)
Vue.use(layer)

/**
 * 移动端里面click事件要在touchstart => touchmove => touchend事件之后才会触发
 * 所以click事件在移动端使用一般会有300ms左右的延时
 * 引入fastclick可以有效解决这个问题
 */
if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function() {
    FastClick.attach(document.body);
  }, false);
}

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})


