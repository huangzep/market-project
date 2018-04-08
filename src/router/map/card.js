/**
 * 大转盘 刮刮卡
 */
export default [
	{
	  path: '/table',
	  name: 'table',
	  component: resolve => {
	    // 使用 Webpack 的 Code-Splitting
	    require(['views/card/table'], resolve)
	  },
	},
	{
	  path: '/card',
	  name: 'card',
	  component: resolve => {
	    require(['views/card/card'], resolve)
	  },
	}
]
