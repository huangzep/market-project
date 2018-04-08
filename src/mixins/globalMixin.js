import Vue from 'vue'
import {prefixStyle} from 'common/js/dom'
import CopyRight from 'components/copy-right/'

/*图片路径前缀*/
const staticurl = window.staticurl ? window.staticurl + 'act/wap/dist/' : '/'

/*样式前缀*/
const transform = prefixStyle('transform')

/*全局指令*/
Vue.mixin({
	methods: {
    pimg(name) {
      return staticurl + 'static/images/' + name
    }
  },
  directives: {
    'fresh': {
      bind(el, binding) {
      	const distance = 200
      	let flag = false
      	let initialY, finalY
        el.style.transition = 'all .5s'
      	document.addEventListener('touchstart', (e) => {
      		flag = window.scrollY === 0 ? true : false
      		el.style[transform] = ``
      		initialY = e.touches[0].pageY
      	}, false)
      	document.addEventListener('touchmove', (e) => {
	    		finalY = e.touches[0].pageY
	    		if (flag && (finalY - initialY > 0)) {
	    			el.style[transform] = `translate3d(0, ${finalY - initialY}px, 0)`
	    			e.preventDefault()
	    		}
	    		if (flag && (finalY - initialY > distance)) {
	    			binding.value()
	    		}
	    	}, false)
	    	document.addEventListener('touchend', (e) => {
	    		el.style[transform] = ``
      	}, false)
      }
    },
    'load': {
      bind(el, binding) {
        el.addEventListener('touchmove', (e) => {
         let scrollTop = window.scrollY
         let clientHeight = window.innerHeight
         let scrollHeight = document.body.scrollHeight
         if (scrollTop + clientHeight > scrollHeight - 50) {
          binding.value()
         }
        }, false)
      }
    },
    'light': {
    	bind(el, binding) {
    		el.addEventListener('touchstart', () => {
    			el.style[transform] = `scale(1.1)`
    		}, false)
    		el.addEventListener('touchend', () => {
    			el.style[transform] = ``
    		}, false)
    	}
    },
    'min-h': {
      bind(el, binding) {
        el.style.minHeight = (window.innerHeight) + 'px'
      }
    }
  }
})

/*全局注册版权组件*/
Vue.use(CopyRight)