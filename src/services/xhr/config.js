// 此处配置 根访问路径
// 更多配置请根据业务逻辑自行实现

// 后端 API 地址，最好以 http(s):// 打头

let rootPath;
if (process.env.NODE_ENV.trim() === 'development') {
	rootPath = '//ac.miduonet.com/api'
	//rootPath = '//ac.api.miduonet.com/api'
} else {
	rootPath = '/api'
}
export { rootPath };

