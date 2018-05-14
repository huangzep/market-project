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

/**
 * 集卡牌活动模块API
 */

/**
 * 获取活动信息
 * @param  {} 
 * @return {Promise}
 */
export function getCollectCardInfo(aid) {
  return xhr({
    url: `CollectCard/GetCollectCardInfo`,
    params: {
      aid
    }
  })
}

/**
 * 获取活动最新中奖信息
 * @param  {} 
 * @return {Promise}
 */
export function getMessagInfoList(aid) {
  return xhr({
    url: `CollectCard/GetMessagInfoList`,
    params: {
      aid
    }
  })
}

/**
 * 获取活动奖项信息
 * @param  {} 
 * @return {Promise}
 */
export function getPrizeList(aid) {
  return xhr({
    url: `CollectCard/GetPrizeList`,
    params: {
      aid
    }
  })
}

/**
 * 获取用户卡牌信息
 * @param  {} 
 * @return {Promise}
 */
export function getUserCardList(aid) {
  return xhr({
    url: `CollectCard/GetUserCardList`,
    params: {
      aid
    }
  })
}

/**
 * 抽取一张卡牌
 * @param  {} 
 * @return {Promise}
 */
export function getACard(aid) {
  return xhr({
    url: `CollectCard/GetACard`,
    params: {
      aid
    }
  })
}

/**
 * 卡牌兑奖
 * @param  {} 
 * @return {Promise}
 */
export function getAPrize(aid, cid, ids) {
  return xhr({
    url: `CollectCard/GetAPrize`,
    params: {
      aid, 
      cid, 
      ids
    }
  })
}

/**
 * 集齐推送消息
 * @param  {} 
 * @return {Promise}
 */
export function pushMessage(aid) {
  return xhr({
    url: `CollectCard/PushMessage`,
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
export function getFateList(m, type, pageindex = 1, pagesize = 5) {
  return xhr({
    url: `CollectCard/GetActList`,
    params: {
      m,
      type,
      pageindex,
      pagesize
    }
  })
}