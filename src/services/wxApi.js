import xhr from './xhr/'

/**
 * 通用API
 */

/**
 * 获取微信分享参数
 * @param  {aid: 活动ID} 
 * @return {Promise}
 */
export function getWxdata(aid, url, vid, m) {
  return xhr({
    url: `/WX/Getwxdata`,
    params: {
      aid,
      url,
      vid,
      m
    }
  })
}
/**
 * 获取微信上传图片
 * @param  {aid: 活动ID} 
 * @return {Promise}
 */
export function upload(m, media_id) {
  return xhr({
    url: `/Wx/Upload`,
    params: {
      m,
      media_id
    }
  })
}

/**
 * 获取公众号关注
 * @param  {} 
 * @return {Promise}
 */
export function uploadImg(m, data) {
  return xhr({
    method: 'post',
    url: `/WX/UploadImg?m=${m}`,
    processData:false,
    data
  })
}

/**
 * 获取底部导航
 * @param  {} 
 * @return {Promise}
 */
export function getMenuList(m, actid, type) {
  return xhr({
    url: `/Act/GetMenuList`,
    params: {
    	m,
      actid,
      type
    }
  })
}

/**
 * 获取公众号关注
 * @param  {} 
 * @return {Promise}
 */
export function getGzStatus(actid) {
  return xhr({
    url: `/Act/GetCustomerType`,
    params: {
      actid
    }
  })
}
/**
 * 获取商城信息
 * @param  {aid: 活动ID} 
 * @return {Promise}
 */
export function getMallInfo(m) {
  return xhr({
    url: `/Act/GetMallInfo`,
    params: {
      m
    }
  })
}
