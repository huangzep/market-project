// 不同模块应代码分离
import word from './word'
import card from './card'
import sign from './sign'
import vote from './vote'

export default [
  // Vue 没有强制刷新操作，这算是 hack（使用 canReuse 可以解决部分问题）
  // {
  //   path: '/',
  //   redirect: '/word'
  // },

  // 集字模块
  ...word,
  //大转盘 刮刮卡
  ...card,
  //签到模块
  ...sign,
  //投票模块
  ...vote
]
