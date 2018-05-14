/**
 * 集字、集卡模块
 */
export default [
	{
	  path: '/word',
	  name: 'word',
	  component: resolve => {
	    require(['views/word/'], resolve)
	  },
	  meta: {},
	  children: []
	},
	{
		path: '/wordlist',
		name: 'wordlist',
		component: resolve => {
	    require(['views/word/wordlist'], resolve)
	  },
		meta: {}
	},
	{
		path: '/fate',
		name: 'fate',
		component: resolve => {
	    require(['views/word/fate'], resolve)
	  },
	},
	{
		path: '/fatelist',
		name: 'fatelist',
		component: resolve => {
	    require(['views/word/fatelist'], resolve)
	  },
	},
	{
		path: '/test/mo',
		name: 'test',
		component: resolve => {
	    require(['views/word/test'], resolve)
	  },
	}
]
