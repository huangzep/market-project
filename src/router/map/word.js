// import word from 'views/word/'
// import wordlist from 'views/word/wordlist'
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
		path: '/fatechoice',
		name: 'fatechoice',
		component: resolve => {
	    require(['views/word/fatechoice'], resolve)
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
		path: '/test',
		name: 'test',
		component: resolve => {
	    require(['views/word/test'], resolve)
	  },
	}
]
