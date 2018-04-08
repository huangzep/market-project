import xhr from './xhr/'

/**
 * 签到模块API
 */

/**
 * 获取签到信息接口
 * @param  {} 
 * @return {}
 */
export function getSignActInfo(aid) {
  return xhr({
    url: `Sign/GetSignActInfo`,
    params: {
      aid
    }
  })
}

/**
 * 签到拓展信息接口
 * @param  {} 
 * @return {}
 */
export function getSignExpand(aid) {
  return xhr({
    url: `Sign/GetSignExpand`,
    params: {
      aid
    }
  })
}

/**
 * 获取已经签到信息 根据月份筛选
 * @param  {} 
 * @return {}
 */
export function getSign(aid,days) {
  return xhr({
    url: `Sign/GetSign`,
    params: {
      aid,
      days
    }
  })
}

/**
 * 签到
 * @param  {} 
 * @return {}
 */
export function setSign(aid) {
  return xhr({
    url: `Sign/SetSign`,
    params: {
      aid
    }
  })
}

/**
 * 补签
 * @param  {} 
 * @return {}
 */
export function setSupplySign(aid,days) {
  return xhr({
    url: `Sign/SetSupplySign`,
    params: {
      aid,
      days
    }
  })
}

/**
 * 获取可补签日期
 * @param  {} 
 * @return {}
 */
export function getSupplyInfo(aid) {
    return xhr({
      url: `Sign/GetSupplyInfo`,
      params: {
        aid
      }
    })
  }

/**
 * 获取补签卡 （兑换）
 * @param  {} 
 * @return {}
 */
export function getSupplyCard(aid,num) {
  return xhr({
    url: `Sign/GetSupplyCard`,
    params: {
      aid,
      num
    }
  })
}
  