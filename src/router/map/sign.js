/**
 * 签到
 */
export default [
	{
	  path: '/sign',
	  name: 'sign',
	  component: resolve => {
	    require(['views/sign/'], resolve)
	  }
	},
	{
	  path: '/signrepair',
	  name: 'repair',
	  component: resolve => {
	    require(['views/sign/repair'], resolve)
	  }
	}
]
