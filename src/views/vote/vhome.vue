<template>
	<div class="vhome">
		<scroll class="vscroll" ref="scroll" 
		:data="vlist" :update="update"
		:listenScroll="true" pulldown="stop" :pullup="true"
		@pullingDown="refresh" @pullingUp="loadMore">
			<div>
			  <div class="vtop">
			   	<img :src="state.voteInfo.VoteImage" alt="">
			   	<!-- <span>正在进行</span> -->
			   </div>
			   <div class="activity-info">
			   	<div class="name"><div class="left">活动名称：</div><div class="right">{{state.voteInfo.Title}}</div></div>
			   	<div class="name"><div class="left">活动时间：</div><div class="right">{{state.voteInfo.StartTime}} ~ {{state.voteInfo.EndTime}}</div></div>
			   	<div class="name"><div class="left">主办单位：</div><div class="right">{{state.voteInfo.HostName}}</div></div>
			  </div>
			  <ul class="number">
			   	<li><p>{{state.voteInfo.CxTotal}}</p><p>参选数</p></li>
			   	<li><p>{{state.voteInfo.TpTotal}}</p><p>累计投票</p></li>
			   	<li><p>{{state.voteInfo.ViewTotal}}</p><p>浏览量</p></li>
			  </ul>
			  <div class="search-wrapper">
			   	<div class="input"><input type="text" v-model="keyword" placeholder="输入名称或编号搜索" @focus="goup"><i v-show="keyword" @click="keyword = ''"></i></div>
			   	<div class="btn" @click="search">搜索</div>
			  </div>
		    <div class="no-vote" :class="nonews.clsname" v-if="!total">
			   	<i></i>
			   	<p class="p1">{{nonews.p1}}</p>
			   	<p class="p2">{{nonews.p2}}</p>
			   	<button @click="apply" v-light v-show="state.voteInfo.IsOpenSign">立即报名</button>
			  </div>
				<div class="voters-wrapper" v-else>
				 	<voters :vlist="vlist" :canVote="canVote"></voters>
				 	<div class="daodi" v-show="total !== 0 && total === vlist.length">
						人家是有底线的~~
					</div>
				</div>
				<!-- 底部版权 -->
		    <div class="copy-container">
		      <copy-right></copy-right>
		    </div>
	    </div>
    </scroll>
		<!-- 分享模态框 -->
		<!-- <div class="vote-share"></div> -->
	</div>
</template>

<script>
	import Voters from 'components/voters/voters'
	import scrollMixin from '@/mixins/scrollMixin'
	import wxMixin from '@/mixins/wxMixin'
	import {getVoteInfo, getVoteUserList} from 'services/voteApi'
	import Store from '@/store/store'
	import {timeOut} from 'common/js/util'

	export default {
		mixins: [scrollMixin, wxMixin],
		data: () => ({ 
			state: Store.state,
			vlist: [],  //参选用户列表
			canVote: true, 
			nonews: {clsname: 'no2', p1: '哎呀，还没有人参与评选呢', p2: '快来报名参加吧！'},  //搜索无内容提示语
			keyword: '', //搜索关键词
			page: 1, 
			total: 0,
		}),
    computed: {
    },
    watch: {
    	$route(val, oldVal) {
    		if (/apply/.test(oldVal.path)) {
    			this._getVoteInfo()
	    		this._getVoteUserList()
    		}
    	},
    	'state.voteInfo'(val) {
    		this.setTimeNews(val)
    	}
    },
    created() {
    	this.aid = this.$route.query.aid
    	this._getVoteUserList()
    },
    mounted() {

    },
    activated() {
    	if (this.$route.query.refresh) {
    		this._getVoteInfo()
    		this._getVoteUserList()
    	}
    },
		methods: {
			_getVoteInfo() {
				this.update = true
				getVoteInfo(this.aid).then(res => {
					if (res.return_code === 0) {
						this.res = res.return_data
						document.title = this.res.Title
						Store.setVoteInfo(this.res)
						this.setTimeNews(this.res)						
					}
				}).catch(error => {
	    		console.log(error)
					this.update = false
	        this.$refs.scroll.forceUpdate(true)
				})	
			},
			_getVoteUserList() {
				this.update = true
				this.$vux.loading.show({text: 'Loading'})
				getVoteUserList(this.aid, this.keyword, false, this.page).then(res => {
					if (res.return_code === 0) {
						this.vlist = (this.page === 1 ? res.return_data : [...this.vlist, ...res.return_data]) || []
						this.total = res.totalCount 
						if (this.keyword && !this.vlist.length) {
							this.nonews = {clsname: 'no1', p1: '哎呀，没有找到相关内容呢', p2: '换个关键词再试试！'}
						}
					}
				}).catch(error => {
	    		console.log(error)
					this.$vux.toast.text('网络连接失败，请稍后<br/>重试')
					this.update = false
	        this.$refs.scroll.forceUpdate(true)
				})	
			},
			setTimeNews(voteInfo) {
				if (timeOut(voteInfo.EndTime)) {
					this.canVote = false
					this.nonews = {clsname: '', p1: '很遗憾，没有人报名评选呢', p2: '下次要抓紧机会了哦！'}
					return;
				}
				if (!timeOut(voteInfo.StartTime)) {
					this.canVote = false
					this.nonews = {clsname: '', p1: '评选活动还没开始呢', p2: '过阵子再来瞧瞧吧！'}
					return;
				}
			},
			refresh() {
				this.keyword = ''
				this.page = 1
				this._getVoteInfo()
	    	this._getVoteUserList()
			},
			loadMore() {
				if (this.vlist.length >= this.total) return;
				this.page++
				this.$vux.loading.show({text: 'Loading'})
				this._getVoteUserList()
			},
			search() {
				this.page = 1
				this._getVoteUserList()
			},
			apply() {
				document.getElementById('vjoin').click()
			},
			goup(e) {
				if (/android/gi.test(window.navigator.userAgent)) {
					this.$refs.scroll.scrollToElement(e.target, 400)
				}
			}
		},
		components: {
			Voters
		}
	}
</script>

<style lang="scss" scoped>
@import '~common/scss/mixin';
.vhome {
	.vscroll {top: 0;}
	ul.number {
		display: flex;
		background-color: #fff;
		margin-top: 0.053333rem;
		li {
			flex: 1;
			overflow: hidden;
			height: 55px;
			display: flex;
			flex-direction: column;
			align-items: center;
			p {
				max-width: 100%;
				font-size: 12px;
				line-height: 20px;
				@include ellipsis();
				&:nth-of-type(1) {
					color: #dd2726;
			    padding-top: 8px;
			    font-size: 18px;
				}
			}
		}
	}
	.search-wrapper	{
    padding: 10px 8px 0;
    background: url(~common/imgs/bottom_line.png) no-repeat scroll left top / 100% 1px #fff;
		display: flex;
		margin-top: 10px;
		.input {
			width: 75%;
	    height: 34px;
	    line-height: 34px;
	    border: 1px solid #e5e5e5;
	    border-radius: 4px;
	    margin-right: 1%;
	    background: url(~common/imgs/vote-search.png) no-repeat 11px center / auto 18px;
	    position: relative;
			input {
		    outline: none;
		    padding: 8px 34px 8px 39px;
		    height: 34px;
		    line-height: 18px;
		    border: none;
		    width: 100%;
		    vertical-align: top;
		    background: rgba(0,0,0,0);
		    font-size: 14px;
			}
			i {
		    position: absolute;
		    width: 14px;
		    height: 14px;
		    background: url(~common/imgs/vote-search-cancel.png) no-repeat center / auto 14px;
		    right: 11px;
		    top: 10px;
			}
		}
		.btn {
			margin-left: 0.106667rem;
			width: 20%;
	    height: 34px;
	    line-height: 34px;
	    border: 1px solid #e5e5e5;
	    outline: none;
	    vertical-align: top;
	    background: #fff;
	    font-size: 14px;
	    color: #2a2a2a;
	    border-radius: 4px;
	    text-align: center;
	    &:active {
	    	background-color: #ccc;
	    }
		}
	}
	.no-vote {
		padding: 80px 0;
    background: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;
		line-height: 22px;
		i {
			width: 114px;
			height: 114px;
			background: url(~common/imgs/no-vote-list.png) no-repeat center center/ 100% 100%;
		}
		.p1 {
	    color: #2a2a2a;
	    font-size: 15px;
	    margin-top: 8px;
		}
		.p2 {
			color: #b5b2b2;
	    font-size: 14px;
		}
		button {
			display: none;
			width: 134px;
	    height: 30px;
	    border: 1px solid #f15a0c;
	    color: #f15a0c;
	    font-size: 14px;
	    text-align: center;
	    border-radius: 4px;
	    background: #fff;
	    margin-top: 8px;
		}
		&.no1 {
			i {background-image: url(~common/imgs/no-vote.png);}
		}
		&.no2 {
			button {display: block;}
		}
	}
	.voters-wrapper {
		background-color: #fff;
		margin-bottom: 60px;
		.daodi {
			text-align: center;
			line-height: 1.066667rem;
			background: url(~common/imgs/bottom_line.png) no-repeat scroll left top / 100% 1px #fff;
		}
	}
}
</style>