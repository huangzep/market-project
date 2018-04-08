<template>
	<div class="vapplicant">
		<div class="passing" v-if="pass === 1">
	  	<div class="vtop">
		   	<img :src="res.VoteInfo.VoteImage" alt="">
		   	<!-- <span>正在进行</span> -->
		   </div>
		   <div class="activity-info">
		   	<div class="name"><div class="left">活动名称：</div><div class="right">{{res.VoteInfo.Title}}</div></div>
		   	<div class="name"><div class="left">活动时间：</div><div class="right">{{res.VoteInfo.StartTime}} ~ {{res.VoteInfo.EndTime}}</div></div>
		   	<div class="name"><div class="left">主办单位：</div><div class="right">{{res.VoteInfo.HostName}}</div></div>
		  </div>
		  <div class="apply-info">
		  	<h3>{{res.UserName}}</h3>
		  	<p class="bianhao">编号：{{res.UserNum}}</p>
		  	<ul class="poll">
		  		<li><p>{{res.Votes}}</p><p>当前票数</p></li>
		  		<li><p>{{res.Rank}}</p><p>当前排名</p></li>
		  	</ul>
		  </div>
		  <div class="distance" v-html="disRank">{{res.Rank == 1 ?  `` : `离上一名还差<span style="color: red;">${res.LastRank}</span>票呢，赏一票呗`}}</div>
		  <div class="photo"><img :src="res.UserImage" alt=""></div>
		  <div class="article">
		  	<h4>参选宣言：</h4>
	      <div class="manifesto">{{res.Declaration}}</div>
		  </div>
		  <div class="article" style="margin-top: 10px;">
		  	<h4>详细介绍：</h4>
		    <div class="manifesto" v-html="res.Remark">
		    <!--编辑器来的内容-->
		   	</div>
		  </div>
		  <div class="article" style="margin-top: 10px;" v-if="res.Pic">
		  	<h4>风采展示：</h4>
		    <div class="manifesto" v-for="item in res.Pic.split(',')">
		    	<img :src="item" alt="">
		   	</div>
		  </div>
		  <div class="voters-wrapper">
		  	<h5>看看谁给TA投了票</h5>
		  	<div class="voters">
		  		<ul v-if="userList.length">
		  			<li v-for="item in userList">
		  				<img :src="item.ImgPath" alt="">
		  				<div class="info">
		  					<div class="name">{{item.NickName}}</div>
		  					<div class="time">{{item.AddTime}}</div>
		  				</div>
		  			</li>
		  		</ul>
		  		<div class="no-one" v-else>暂无人投票哦，帮TA拉票吧！</div>
		  	</div>
		  	<div class="all" v-show="userTotal > 6"><span v-light
		  		@click="checkAll">查看全部投票</span></div>
		  </div>
			<div class="toupiao">
				<span :class="{'disable': (res.VoteInfo.Status === 3)}"
			@click="_voteForHim" v-light>{{res.VoteInfo.Status !== 3 ? '帮Ta投一票' : '活动已结束'}}</span>
			</div>
	  </div>
	  <div class="nopass" v-if="pass === 2" v-min-h>
	  	<img src="~common/imgs/vote-cancel.png" alt="">
	  	<p class="p1">该参选者已退出本次评选</p>
      <p class="p2">如有疑问，请联系主办方哦</p>
      <a :href="'tel: ' + state.voteInfo.Tel"><p class="p3" v-if="state.voteInfo.Tel">{{state.voteInfo.Tel}}</p></a>
	  </div>
	  <div class="copy-container" v-show="pass">
			<copy-right></copy-right>
		</div>
	  <transition name="slide">
			<div class="all-voters" v-show="showFlag" v-load="loadMore">
		  	<h4>给{{res.UserName}}投票的人（<span>{{userTotal}}</span>）</h4>
		  	<div class="voters">
		  		<ul>
		  			<li v-for="item in totalList">
		  				<img :src="item.ImgPath" alt="">
		  				<div class="info">
		  					<div class="name">{{item.NickName}}</div>
		  					<div class="time">{{item.AddTime}}</div>
		  				</div>
		  			</li>
		  		</ul>
		  		<div class="daodi" v-show="userTotal === totalList.length">
						人家是有底线的~~
					</div>
		  	</div>
		  </div>
		</transition>
  </div>
</template>

<script>
	import Yes from 'common/imgs/dui_icon.png'
	import wxMixin from '@/mixins/wxMixin'
	import {getVoteUserInfo, getUserList, voteForHim} from 'services/voteApi'
	import Store from '@/store/store'

	export default {
		name: 'vapplicant',
		mixins: [wxMixin],
		data: () => ({ 
			state: Store.state,
			pass: 0,
			res: {VoteInfo: {}},
			userList: [],
			totalList: [],
			userTotal: 0,
			showFlag: false,
			count: 0,    //当前用户剩余投票数
			page: 1
		}),
    computed: {
     disRank() {
     	if (this.res.Rank === 1) {
     		return `哇塞，第 <span style="color: #dd2726">1</span> 名，太牛了！`
     	}
     	if (this.res.LastRank == 0) {
     		return `再赏一票，可能就前进一名哦`
     	}
     	if (this.res.LastRank) {
     		return `离上一名还差 <span style="color: #dd2726">${this.res.LastRank}票</span> 呢，赏一票呗`
     	}
     	return '';     	
     }
    },
    watch: {

    },
    created() {
    	this.aid = this.$route.query.aid  //活动ID
    	this.vid = this.$route.query.vid  //参选者ID
    	this.m = this.$route.query.m      //品牌商账号
  		this._getVoteUserInfo()
    	this._getUserList()
    },
    mounted() {
    	this.listenHistory()
    },
		methods: {
			_getVoteUserInfo() {
				this.$vux.loading.show({text: 'Loading'})
				getVoteUserInfo(this.aid, this.vid).then(res => {
					if (res.return_code === 0) {
						this.res = res.return_data
						this.count = this.res.ToCount
						document.title = this.res.VoteInfo.Title
						//IsInVote即Status 0 待审核  1 已参选已通过  2 已参选未通过 3 未参选
						//VerifyMode 0 先通过   1 先审核
						if (this.res.Status === 1 || (this.res.Status === 0 && this.res.VoteInfo.VerifyMode === 0)) {
							this.pass = 1
						} else {
							this.pass = 2
						}
					}
				}).catch(error => {
	    		console.log(error)
					this.$vux.toast.text('网络连接失败，请稍后<br/>重试')
				})	
			},
			_getUserList(page = 1, pagesize = 6) {
				if (this.flag) return;
				this.flag = true
				getUserList(this.aid, this.vid, page, pagesize).then(res => {
					this.flag = false
					if (res.return_code === 0) {
						this.userTotal = res.totalCount
						if (page === 1) {
							this.userList = res.return_data || []
							this.totalList = this.userList
							return;
						}
						this.totalList = [...this.totalList, ...res.return_data]
					}
				}).catch(error => {
	    		console.log(error)
					this.$vux.toast.text('网络连接失败，请稍后<br/>重试')
					this.flag = false
				})	
			},
			_voteForHim() {
				if (this.res.VoteInfo.Status === 3 || this.flag) return;
				this.flag = true
				this.$vux.loading.show({text: 'Loading'})
				let txt, btn, point;
				voteForHim(this.aid, this.vid).then(res => {
					this.flag = false
					if (res.return_code === 0) {
						this.count--
						point = res.return_index //投票获取的积分
						//IsDayTp: 每天重复投票：0 不开启  1 开启
						if (this.res.VoteInfo.IsDayTp === 0 && this.count === 0) {
							txt = '您的投票次数已经用完了！'
							btn = '查看排名'
						}
						if (this.res.VoteInfo.IsDayTp === 0 && this.count) {
							txt = `您还能为其他参选者投 <span style="color: red;">${this.count}</span> 票`
							btn = '继续投票'
						}
						if (this.res.VoteInfo.IsDayTp === 1 && this.count === 0) {
							txt = '您今天的投票次数已经用完了！'
							btn = '查看排名'
						}
						if (this.res.VoteInfo.IsDayTp === 1 && this.count) {
							txt = `您今天还能为其他参选者投 <span style="color: red;">${this.count}</span> 票`
							btn = '继续投票'
						}
						if (point) {
							txt += `<br/>通过本次投票，您获得了 <span style="color: red;">${point}</span> 积分。`
						}
						this.hasVoted(txt, btn)
					}
				}).catch(error => {
					console.log(error)
					this.$vux.toast.text('网络连接失败，请稍后<br/>重试')
					this.flag = false
				})
			},
			hasVoted(txt, btn) {
				this.$layer.dialog({
					title: ['投票成功', `background: url(${Yes}) no-repeat 90px 11px / 23px;`], 
          content: txt,
          btn: ['知道了',btn] 
				}).then(res => {
					//知道了：关闭弹框，刷新并停留在本页面
					if (res === 0) {
						window.scrollTo(0, 0)
						this._getVoteUserInfo()
			    	this._getUserList()
			    	return;
					}
					//继续投票：关闭弹框，并跳转到活动首页。
					let {m, aid} = this
					if (res === 1 && btn === '继续投票') {
						this.$router.push({
							path: '/vote/vhome',
							query: {m, aid, refresh: 1}
						})
					}
					//查看排名：关闭弹框，并跳转到排名榜页
					if (res === 1 && btn === '查看排名') {
						this.$router.push({
							path: '/vote/vrank',
							query: {m, aid, refresh: 1}
						})
					}
				})
			},
			checkAll() {
				window.history.pushState({title: 'title', url: '#'}, "title", "#"); 
				this.showFlag = true
				if(this.page === 1) this._getUserList(++this.page)
			},
			loadMore() {
				if (this.totalList.length >= this.userTotal || this.flag) return;
				this._getUserList(++this.page)
			},
			listenHistory() {
				let self = this
			  window.addEventListener("popstate", function(e) { 
          self.showFlag = false 
        }, false); 
			}
		},
		components: {
		}
	}
</script>

<style lang="scss" scoped>
@import '~common/scss/mixin';
.vapplicant {
	margin-bottom: 50px;
	.apply-info {
		text-align: center;
		background-color: #fff;
		margin-top: 10px;
		h3 {
			color: #2a2a2a;
	    font-size: 16px;
	    padding: 24px 10px 12px 10px;
	    word-break: break-all;
	    line-height: 20px;
		}
		.bianhao {
			color: #a9a9a9;
	    font-size: 14px;
	    padding-bottom: 24px;
		}
		ul.poll {
			display: flex;
	    border: 1px solid #e5e5e5;
	    border-width: 1px 0;
			li {
				flex: 1;
				height: 57px;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				&:nth-of-type(1) {
					border-right: 1px solid #dcdcdc;
				}
				p {
					&:nth-of-type(1) {
						padding-bottom: 8px;
				    font-size: 17px;
				    color: #dd2726;
					}
				}
			}
		}
	}
	.distance {
    color: #a9a9a9;
    padding: 18px 0;
    font-size: 14px;
    text-align: center;
	}
	.photo {
		padding-bottom: 1px;
    background: url(~common/imgs/bottom_line.png) no-repeat scroll left bottom / 100% 1px #fff;
    img {display: block;width: 100%;}
	}
	.article {
		color: #585858;
    line-height: 25px;
    padding: 10px 10px 10px;
    font-size: 14px;
    text-align: left;
    background-color: #fff;
    word-break: break-all;
    background: url(~common/imgs/bottom_line.png) no-repeat scroll left bottom / 100% 1px #fff;
		h4 {color: #dd2726; padding-bottom: 7px;}
		.manifesto {}
		img {display: block; width: 100%;}
	}
	.all-voters {
		@include cover();
		@include slide();
		overflow: scroll;
		bottom: 50px;
		background-color: #fff;
		h4 {
			font-size: 15px;
	    padding: 17px 0 10px 10px;
	    span {color: #dd2726;}
		}
	}
	.voters-wrapper, .all-voters	{
		background-color: #fff;
		h5 {
			padding: 17px 0 10px 10px;
	    color: #a9a9a9;
	    background-color: #fff;
	    margin-top: 10px;
	    background: url(~common/imgs/bottom_line.png) no-repeat scroll left top / 100% 1px #fff;
		}
		.voters {
			ul {
				li {
					display: flex;
					width: 100%;
					height: 55px;
					align-items: center;
					img {
						min-width: 38px;
				    height: 38px;
				    border-radius: 50%;
				    margin-left: 10px;
					}
					&:nth-last-child(1) {
						.info {background: none;}
					}
					.info {
						margin-left: 0.16rem;
						flex: 1;
						display: flex;
						align-items: center;
						height: 55px;
						background: url(~common/imgs/bottom_line.png) no-repeat scroll left bottom / 100% 1px #fff;
						.name {
							flex: 1;
							max-width: 5.20rem;
							font-size: 14px;
							@include ellipsis();
						}
						.time {
					    min-width: 3.306667rem;
					    font-size: 12px;
					    color: #a9a9a9;
						}
					}
				}
			}
			.no-one {
				padding: 38px 0 50px 0;
		    background: url(~common/imgs/bottom_line.png) no-repeat scroll left bottom / 100% 1px #fff;
		    text-align: center;
		    font-size: 14px;
			}
		}
		.all {
			background: url(~common/imgs/bottom_line.png) no-repeat scroll left bottom / 100% 1px #fff;
	    padding: 10px 0;
	    margin-bottom: 10px;
	    text-align: center;
	    font-size: 13px;
			span {
				display: inline-block;
		    width: 124px;
		    height: 23px;
		    line-height: 23px;
		    border-radius: 20px;
		    background-color: #ededed;
		    position: relative;
		    z-index: 1;
		    padding-right: 6px;
		    &::before, &::after {
		    	border: 6px solid transparent;
			    border-left: 6px solid #ededed;
			    width: 0;
			    height: 0;
			    position: absolute;
			    top: 5px;
			    right: 6px;
			    content: ' ';
		    }
		    &::before {
    	    border-left-color: #c0c0c0;
			    right: 4px;
		    }
			}
		}
		.daodi {
			text-align: center;
			line-height: 1.066667rem;
			background: url(~common/imgs/bottom_line.png) no-repeat scroll left top / 100% 1px #fff;
		}
	}
	.copy-container {
		padding-bottom: 50px;
	}
	.toupiao {
		position: fixed;
    bottom: 50px;
    left: 0;
    width: 100%;
    background: url(~common/imgs/bottom_line.png) no-repeat scroll left top / 100% 1px #fff;
    z-index: 500;
    padding: 9px 0;
		span {
			display: block;
			margin: 0 auto;
			width: 8.933333rem;
	    line-height: 38px;
	    color: #fff;
	    border-radius: 5px;
      background-color: #dd2726;
	    font-size: 15px;
	    text-align: center;
	    &.disable {background-color: #c9c9c9;}
		}
	}
	.nopass {
		padding-top: 3.2rem;
		text-align: center;
		img {
			display: block;
			height: 114px;
			margin: 0 auto;
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
		.p3 {
			color: #2a2a2a;
	    padding-right: 25px;
	    line-height: 22px;
	    font-size: 13px;
	    background: url(~common/imgs/phone.png) no-repeat right center / auto 18px;
	    display: inline-block;
	    vertical-align: top;
		}
	}
}
</style>