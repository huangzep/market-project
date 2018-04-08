// import word from 'views/word/'
// import wordlist from 'views/word/wordlist'
/**
 * 集字模块
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
		path: '/test',
		name: 'test',
		component: resolve => {
	    require(['views/word/test'], resolve)
	  },
	}
]
