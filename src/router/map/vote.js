/**
 * 投票
 */
export default [
	{
	  path: '/vote',
	  redirect: '/vote/vhome',
	  name: 'vote',
	  component: resolve => {
	    // 使用 Webpack 的 Code-Splitting
	    require(['views/vote/'], resolve)
	  },
	  children: [
	  	//首页模块
	  	{
	  		path: 'vhome',
	  		name: 'vhome',
	  		component: resolve => {
			    require(['views/vote/vhome'], resolve)
			  },
	  	},
	  	{
	  		path: 'vapply',
	  		name: 'vapply',
	  		component: resolve => {
			    require(['views/vote/vapply'], resolve)
			  },
	  	},
	  	{
	  		path: 'vapplicant',
	  		name: 'vapplicant',
	  		component: resolve => {
			    require(['views/vote/vapplicant'], resolve)
			  },
	  	},
	  	//规则模块
	  	{
	  		path: 'vinfo',
	  		name: 'vinfo',
	  		component: resolve => {
			    require(['views/vote/vinfo'], resolve)
			  },
	  	},
	  	//排行榜模块
	  	{
	  		path: 'vrank',
	  		name: 'vrank',
	  		component: resolve => {
			    require(['views/vote/vrank'], resolve)
			  },
	  	},
	  ]
	},
	//其他活动模块
	{
		path: '/voteother',
		name: 'vother',
		component: resolve => {
	    require(['views/vote/vother'], resolve)
	  },
	}
]
