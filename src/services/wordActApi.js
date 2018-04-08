import xhr from './xhr/'

/**
 * 集字活动模块API
 */

/**
 * 获取当前登录的用户信息
 * @param  {Number,requeired} 
 * @return {Promise}
 */
export function getActInfo(aid) {
  return xhr({
    url: `WordAct/GetActInfo`,
    params: {
      aid
    }
  })
}

/**
 * 获取活动列表
 * @param  {} 
 * @return {Promise}
 */
export function getActList(m, type, pageindex = 1, pagesize = 5) {
  return xhr({
  	url: `WordAct/GetActList`,
    params: {
      m,
      type,
      pageindex,
      pagesize
    }
  })
}

/**
 * 获取抽奖信息
 * @param  {} 
 * @return {Promise}
 */
export function getPrize(aid) {
  return xhr({
  	url: `WordAct/GetPrize`,
    params: {
      aid
    }
  })
}

/**
 * 获取兑奖接口
 * @param  {} 
 * @return {Promise}
 */
export function exchangePrize(aid, pid) {
  return xhr({
    url: `WordAct/ExchangePrize`,
    params: {
      aid, 
      pid
    }
  })
}

