import MyCopyRight from './copy-right.vue'
// 这里是重点
const CopyRight = {
  install: function(Vue){
    Vue.component('copy-right',MyCopyRight)
  }
}

// 导出组件
export default CopyRight