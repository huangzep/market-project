import MD5 from 'blueimp-md5'
import moment from 'moment'
// 使用zh-cn
const locale = 'zh-cn';
moment.locale(locale);

/*生成随机数*/
export function generateNumber(bit = 6) {
	const random = parseInt(Math.random() * 1000000)
	if (random < Math.pow(10, bit - 1)) {
     return generateNumber(bit);
  }
  return random
}

/*对象属性值小写*/
export function sortObjectKey(source) {
  if (!source) return;
	let target = {}
	Object.keys(source).sort().forEach(key => {
    if (source[key] !== undefined) {
      target[key.toLowerCase()] = source[key]
    }
	})
	return target
}

export function paramStringify(data) {
  if (!data) return '';
	let str = []
	for (let i in data) {
		// str.push(encodeURIComponent(i) + encodeURIComponent(data[i]))
    str.push(i + '' + data[i]) 
	}
	return str.join('')
}

/*自定义请求头*/
export function defineConfig(config) {
	// 时间戳
  const timestamp = moment().format('YYYYMMDDHHmmss');
  const random = generateNumber(6);
  const apikey = '448B027D72E9FF641ED7F1708F633C05E9DFD8F9BD1775AC3BDE406A0D9B2444E450F7062E66DB5C';
  const salt = 'EE904EB47547F62C0D97F719E96FA43633449D85';

  let sortedParams = sortObjectKey(config.params ? config.params : config.data)
  let signStr = (salt + apikey + timestamp + random + paramStringify(sortedParams)).trim()
  //报名、图片请求暂时不加参数加密
  if (/AddVoteUser|VoteForHim|UploadImg/gi.test(config.url)) {
    signStr = (salt + apikey + timestamp + random).trim()
  }

  // 增加自定义headers
  Object.assign(config.headers, {
    timestamp: timestamp, // 时间戳
    sign: MD5(signStr),
    nonc: random,
    apikey: apikey
  });
 	return config;
}

/*计算日期差*/
export function difTime(end) {
  let dif = moment(end).diff(moment(), 'minutes')
  let days = Math.floor(dif / (24 * 60))
  let hours = Math.floor(dif / 60) - days * 24
  let minutes = dif % 60
  return `${days}天${hours}小时${minutes}分结束`
}

export function difSeconds(start, end) {
  let dif = end ? moment(end).diff( moment(), 'seconds') : moment(start).diff( moment(), 'seconds')
  if (dif < 0) return 'over';
  let days = Math.floor(dif / (24 * 60 * 60))
  let hours = Math.floor(dif / (60 * 60)) - days * 24
  let minutes = Math.floor(dif / 60) - days * 24 * 60 - hours * 60
  let seconds = dif % 60
  return `距离活动开始还有<br /><span style="color:red;">${days}</span> 天 <span style="color:red;">${hours}</span> 小时 <span style="color:red;">${minutes}</span> 分 <span style="color:red;">${seconds}</span> 秒`
}

/*计算时间差*/
export function timeOut(end) {
  if (moment(end).diff(moment()) < 0) {
    return true
  }
  return false
}

/*在某段时间内*/
export function timeIn(s, e) {
  let t = moment().format('YYYY-MM-DD')
  if (moment(t + ' ' + s).diff(moment()) < 0 && moment(t + ' ' + e).diff(moment()) > 0) {
    return true
  }
  return false
}

