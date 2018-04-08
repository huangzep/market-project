import xhr from './xhr/'

/**
 * 投票模块API
 */

/**
 * 获取投票活动信息
 * @param  {aid: 活动ID} 
 * @return {Promise}
 */
export function getVoteInfo(aid) {
  return xhr({
    url: `/Vote/GetVoteInfo`,
    params: {
      aid
    }
  })
}
/**
 * 获取投票参选用户
 * @param  {aid: 活动ID} 
 * @return {Promise}
 */
export function getVoteUserList(aid, keyword, isrank, page, pagesize) {
  return xhr({
    url: `/Vote/GetVoteUserList`,
    params: {
      aid,
      page, 
      pagesize, 
      keyword, 
      isrank
    }
  })
}
/**
 * 获取活动列表
 * @param  {aid: 活动ID} 
 * @return {Promise}
 */
export function getVoteList(m, type, page, pagesize) {
  return xhr({
    url: `/Vote/GetVoteList`,
    params: {
    	m,
    	type,
    	page, 
    	pagesize
    }
  })
}
/**
 * 获取投票参选用户详情
 * @param  {id: 用户ID} 
 * @return {Promise}
 */
export function getVoteUserInfo(aid,vid) {
  return xhr({
    url: `/Vote/GetVoteUserInfo`,
    params: {
      aid,
      vid
    }
  })
}
/**
 * 获取该用户支持者
 * @param  {id: 用户ID} 
 * @return {Promise}
 */
export function getUserList(aid, vid, page, pagesize) {
  return xhr({
    url: `/Vote/GetUserList`,
    params: {
      aid,
      vid,
      page, 
      pagesize
    }
  })
}
/**
 * 报名参选
 * @param  {id: 用户ID} 
 * @return {Promise}
 */
export function addVoteUser(data) {
  return xhr({
    method: 'post',
    url: `/Vote/AddVoteUser`,
    data
  })
}
/**
 * 投票接口
 * @param  {id: 用户ID} 
 * @return {Promise}
 */
export function voteForHim(aid, vid) {
  return xhr({
    method: 'post',
    url: `/Vote/VoteForHim`,
    params: {
      aid,
      vid
    }
  })
}