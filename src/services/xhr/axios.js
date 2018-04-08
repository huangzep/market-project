import Vue from 'vue'
import axios from 'axios'
import { rootPath } from './config'
import Store from '@/store/store'
import {defineConfig} from 'common/js/util'
/**
 * Axios 是一个基于 promise 的 HTTP 库
 * 默认配置为get方法，get方法用params传参，post方法用data传参
 * 更多详细配置请看：https://www.kancloud.cn/yunye/axios/234845
 */

// axios 配置
axios.defaults.timeout = 300000000;
axios.defaults.baseURL = rootPath;
// axios.defaults.transformRequest = [(data) => {
//   let str = [];
//   for (let i in data) {
//     str.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]));
//   }
//   return str.join('&');
// }];

// http request 拦截器
axios.interceptors.request.use(
  config => {
    defineConfig(config)
    return config;
  },
  error => {
    return Promise.reject(error);
  });

// http response 拦截器
axios.interceptors.response.use(
  response => {
    /*隐藏loading图*/
    setTimeout(() => {Vue.$vux.loading.hide()}, 200)
    /*处理接口返回码*/
    if (response.data.return_code === 30006) {
      Store.setIsLogin(false)
    } else if (response.data.return_code !== 0 && !(/get.*Prize/gi.test(response.config.url))) {
      setTimeout(() => {Vue.$vux.toast.text(response.data.return_msg)}, 500)
    }
    return response.data;
  },
  error => {
    Vue.$vux.loading.hide()
    Vue.$vux.toast.text('网络连接失败，请稍后<br/>重试')
    console.log(error)
  });

export default axios;
