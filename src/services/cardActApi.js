import xhr from './xhr/'

/**
 * 大转盘、刮刮卡活动模块API
 */

/**
 * 获取当前登录的用户信息
 * @param  {Number,requeired} 
 * @return {Promise}
 */
export function getActivityInfo(aid) {
  return xhr({
    url: `Act/GetActivityInfo`,
    params: {
      aid
    }
  })
}

/**
 * 获取中奖信息
 * @param  {Number,requeired} 
 * @return {Promise}
 */
export function getActivityPrize(aid) {
  return xhr({
    url: `Act/GetActivityPrize`,
    params: {
      aid
    }
  })
}
