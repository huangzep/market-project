let store = {
	state: {
		isLogin: true,
		voteInfo: {},  //投票活动信息
		logoInfo: {},  //品牌商logo
	},
	setIsLogin(flag) {
		store.state.isLogin = flag
	},
	setVoteInfo(voteInfo) {
		store.state.voteInfo = voteInfo
	},
	setLogoInfo(logoInfo) {
		store.state.logoInfo = logoInfo
	}
}

export default store