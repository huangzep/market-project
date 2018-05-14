<template>
	<div class="fate">
		<!-- scroll内容 -->
		<scroll class="scroll" ref="scroll" :probe-type="3"
		:data="prizeList" :listen-scroll="true" :pulldown="true"
		 @scroll="scroll" @pullingDown="refresh">
			<div>
				<header>
					<div class="bg">
						<img :src="res.ThemeImage" alt="">
					</div>
					<!-- <div class="music-btn"></div> -->
					<div class="explain" @click="showInfo(res.RuleText)">
						<span class="text">活动说明</span>
						<span class="icon">?</span>
					</div>
					<div class="news">
						<newslide v-if="messageList.length" :messageList="messageList"></newslide>
					</div>
					<div class="playing-container">
						<div class="cishu" v-html="numTxt"></div>
						<div class="btn" @click="showTips" v-light>
							点击抽卡
							<img v-if="canPlay" src="~common/imgs/fate-btn.png" alt="">
							<img v-else src="~common/imgs/fate-btn-hui.png" alt="">
						</div>
					</div>
				</header>
				<!-- 内层tab移动栏 -->
				<div class="fate-tab" ref="fateTap">
					<div class="tab0" :class="{'active': tabIndex === 0}"
					@click="tabIndex = 0">奖品兑换区</div>
					<div class="triangle" :class="{'right': tabIndex === 1}"></div>
					<div class="tab1" :class="{'active': tabIndex === 1}" 
					@click="tabIndex = 1">我的卡牌（<span>{{keepNum}}</span>/<span>{{cardList.length}}</span>）</div>
				</div>
				<div class="tab-wrapper">
					<div class="tab0-container" v-show="!tabIndex">
						<ftlist :ftlist="prizeList" @selectPrize="selectPrize"></ftlist>
						<a :href="res.MyPrizeLink" v-light class="mine">我的奖品</a>
					</div>
					<div class="tab1-container" v-show="tabIndex">
						<cardlist ref="cardlist" :cardList="copyCards"></cardlist>
					</div>
				</div>
				<div class="copy-container">
					<copy-right></copy-right>
				</div>
			</div>
			<!-- 外层tab移动栏 -->
			<div class="fate-tab out" v-show="fixShow">
				<div class="tab0" :class="{'active': tabIndex === 0}"
					@click="tabIndex = 0">奖品兑换区</div>
				<div class="triangle" :class="{'right': tabIndex === 1}"></div>
				<div class="tab1" :class="{'active': tabIndex === 1}" 
					@click="tabIndex = 1">我的卡牌（<span>{{keepNum}}</span>/<span>{{cardList.length}}</span>）</div>
			</div>
		</scroll>
		<!-- 顶部按钮 -->
		<div class="back-top" @click="gotop" v-show="fixShow"></div>
		<fate-choice ref="choice" v-show="showFlag" 
		:cardList="cardList" :needNum="needNum"
		@sure="exchange"></fate-choice>
		<!-- 消息弹框 -->
		<inform ref="inform" :content="infoContent"></inform>
		<!-- 操作弹框 -->
		<confirm ref="confirm" @confirm="action" :confirmBtnText="confirmBtnText"
		:hasCancel="hasCancel" :text="confirmContent"></confirm>
		<!-- 抽卡动画 -->
		<win-fate ref="winfate" :cardImg="cardImg" :cardTxt="cardTxt" 
		:ready="ready"
		@destinate="destinate" @toEx="tabIndex = 0"></win-fate>
		<!-- 兑换条件 -->
		<condition ref="condition" :prizeName="prizeName" :combineCards="combineCards" :totalCard="keepTotal" :needNum="needNum"
		@choice="choice" @exchange="exchange"></condition>
		<!-- 兑奖区域 -->
		<win-gift ref="gift" :atxt="giftAtxt" :prizeLink="giftLink"
		:giftImg="giftImg" :giftText="giftText"></win-gift>
		<!-- loading动画 -->
		<fate-loading ref="loading"></fate-loading>
		<!-- 滑块验证 -->
		<pop ref="pop" @success="showFate"></pop>
	</div>
</template>

<script>
	import Newslide from 'components/newslide/newslide'
	import Ftlist from 'components/ftlist/ftlist'
	import Cardlist from 'components/cardlist/cardlist'
	import WinFate from 'components/win-fate/win-fate'
	import Condition from 'components/condition/condition'
	import WinGift from 'components/win-gift/win-gift'
	import FateLoading from 'components/fate-loading/fate-loading'
	import FateChoice from 'components/fatechoice/fatechoice'	
	import Confirm from 'components/confirm/confirm'
	import Inform from 'components/inform/inform'
	import Pop from 'components/pop/pop'
	import actMixin from '@/mixins/actMixin'
	import scrollMixin from '@/mixins/scrollMixin'
	import {timeOut, difSeconds} from 'common/js/util'
	import {getCollectCardInfo, getPrizeList, getUserCardList, getACard, getAPrize, getMessagInfoList, pushMessage} from 'services/wordActApi'

	export default {
		mixins: [actMixin, scrollMixin],
		data: () => ({ 
			res: {},
			scrollY: -1,
			canPlay: true,   
			fixShow: false,  //外层tab显示隐藏
			cardList: [], 
			copyCards: [],
			tabIndex: 0,		 //tab索引
			keepTotal: 0,    //用户拥有卡牌总数
			prizeName: '',   //特定奖品名称
			combineCards: [],//特定奖项的卡牌组合
			needNum: 0,      //任意奖项的所需卡牌数量
			showFlag: false, //卡牌选择页面
			giftImg: '',		 //兑奖图片
			giftText: '',		 //兑奖文案
			giftAtxt: '',    //兑奖按钮
			giftLink: null,  //兑奖链接
			cardImg: '',		 //抽卡图片
			cardTxt: '', 		 //抽卡文案
			ready: false,    //是否集齐一套 
		}),
    computed: {
     	keepNum() {      //用户拥有卡牌种类数
     		let num;
     		this.keepTotal = 0
     		num = this.cardList.reduce((accu, cur, index) => {
     			this.keepTotal += cur.num
     			this.combineId[cur.id].num = cur.num
     			if (this.copyNow) this.copyCards[index].num = cur.num
	     		return cur.num ? accu + 1 : accu
	     	}, 0)
	     	this.maplist();
	     	return num;
     	},
     	numTxt() {
     		if (!this.res.Title) return '';
     		if (this.res.Type === 1) return `您当前剩余<span>${this.res.Freenum}</span>次抽卡机会`;
     		return this.res.Freenum ? `您当前剩余<span>${this.res.Freenum}</span>次抽卡机会` : `每次消耗<span>${this.res.Point}</span>积分<br/>每天最多参与<span>${this.res.Pointnum}</span>次`
     	}
    },
    watch: {
			scrollY(newY) {
				this.fixShow = (-newY - this.tabTop > 0)
			},
			tabIndex(val) {
				if (this.fixShow) {
					this.$refs.scroll.scrollTo(0, -this.tabTop)
					this.scrollY = -this.tabTop
				}
			},
    },
    created() {
    },
    mounted() {
    	if (this.n = this.$route.query.num) this.showNum(this.n)
    	this.tabTop = this.$refs.fateTap.offsetTop
    	this.listenHistory()
    },
		methods: {
			_getAll() {
	    	Promise.all([getCollectCardInfo(this.aid), getPrizeList(this.aid), getUserCardList(this.aid)]).then(res => {
	    		this.handleCardInfo(res[0]) 
	    		this.handlePrizeList(res[1])
	    		this.handleCardList(res[2])
	    	})
	    	this._getMessagInfoList()
			},
			handleCardInfo(res) {
				if (res.return_code === 10000) this.isVerify = true;
  			this.res = res.return_data
  			document.title = this.res.Title
  			if (timeOut(this.res.EndTime)) {
  				this.canPlay = false
  				this.isLate = true
  			}
  			//活动时间未开始
  			if (!timeOut(this.res.StartTime)) {
  				this.canPlay = false
          this.isBefore = true
  				this.showBefore(this.res.StartTime)
  			}
			},
			handlePrizeList(res) {
				if (res.return_code === 0) {
					let list = res.return_data || []
					list.forEach(n => {
						if (n.ShowHbSum == 1 && n.PrizeType == 5) {
							n.ProductName = n.RedPacketType ? `￥${n.HbMinPrice}微信红包` : `￥${n.HbMinPrice}~￥${n.HbMaxPrice}微信红包`
						} 
						if (n.ShowHbSum == 0 && n.PrizeType == 5) {
							n.ProductName = '1个微信红包'
						}
						if (n.ShowHbSum == 1 && n.PrizeType == 6) {
							n.ProductName = n.RedPacketType ? `￥${n.HbMinPrice}微信红包` : `￥${n.HbMinPrice}~￥${n.HbMaxPrice}红包零钱`
						}
						if (n.ShowHbSum == 0 && n.PrizeType == 6) {
							n.ProductName = '1个红包零钱'
						}
					})
					this.prizeList = list.map(n => ({...n, exlist: (n.ExchangeRemark.replace(/\s+/g, '').split(',')) ,ready: false}))
				}
			},
			handleCardList(res) {
				if (res.return_code === 0) {
					this.cardList = res.return_data || []
					this.combineId = {}
					this.cardList.forEach((n, i) => {this.combineId[n.id] = {index: i, num: n.num}})
					this.copyCards = this.cardList.map(n => ({img: n.img, num: n.num}))
					this.copyNow = true
				}
			},
			_getMessagInfoList() {
				getMessagInfoList(this.aid).then(res => {
					if (res.return_code === 0) {
						this.messageList = res.return_data || []
					}
				})
			},
			maplist() {
				//ExchangeType兑换条件 0：组合兑换  1：数量兑换 
				this.prizeList.forEach(n => {
					if (n.ExchangeType === 0) {
						n.ready = this.combineJudge(n)
					} else {
						n.ready = (this.keepTotal >= n.ExchangeNum)
					}
				})
				//判断是否集齐一套
				this.ready = this.prizeList.some(n => (n.ready))
			},
			combineJudge(item) {
				let flag = true
				item.exlist.forEach(id => {
					if (!this.combineId[id].num) flag = false;
				})
				return flag;
			},
			scroll(pos) {
				this.scrollY = pos.y
			},
			gotop() {
				this.$refs.scroll.scrollTo(0, 0, 400)
			},
			showInfo(text) {
	      this.infoContent = text
	      this.$refs.inform.show()
	    },
	    //点击奖品查看
	    selectPrize(prize) {
	    	this.prizeName = prize.ProductName
	    	this.prize = prize
	    	//组合兑换
	    	if (prize.ExchangeType === 0) {
	    		let exCombine = {}
		    	prize.exlist.forEach(id => {exCombine[id] = true})
		    	this.combineCards = this.cardList.filter(n => {return exCombine[n.id]})
		    	this.$refs.condition.show()
		    	return;
	    	}
	    	//数量兑换
	    	this.combineCards = []
	    	this.needNum = prize.ExchangeNum
	    	this.$refs.condition.show()
	    },
	    choice() {
	    	window.history.pushState({title: 'title', url: '#'}, "title", "#"); 
	    	this.showFlag = true
	    },
	    listenHistory() {
	    	let self = this
			  window.addEventListener("popstate", function(e) { 
          self.showFlag = false 
        }, false); 
			},
			action() {
				if (this.actionId === 1) {
					this.showFate()
				} else if (this.actionId === 2) {
					window.location.href = this.res.PointLink
				}
			},
			showTips() {
				//Type 活动类型：0：常规活动  1：扫码活动  2: 混合活动
				if (!this.canPlay) {
					this.disable()
					return;
				}
				//扫码活动消耗次数
				if (this.res.Freenum) {
					this.isVerify ? this.$refs.pop.show() : this.showFate()
					return;
				}
				if (this.res.Type === 1) {
					this.actionId = 0
					this.hasCancel = false
					this.confirmBtnText = '朕知道了'
					this.confirmContent = `抱歉，您当前剩余次数已为0，请扫码获取次数后再来~`
					this.$refs.confirm.show()
					return;
				}
				this.isVerify ? this.$refs.pop.show() : this.showFate()
				// if (this.res.Type === 2 && this.res.Pointnum) {
				// 	//弹出积分抽卡确认提示框
				// 	this.res.Pointnum--
				// 	this.actionId = 1
				// 	this.hasCancel = false
				// 	this.confirmBtnText = '确定'
				// 	this.confirmContent = `您扫码已获得的抽卡机会用完了，本次抽卡将消耗您&nbsp;<span style="color: red;">${this.res.Point}</span>&nbsp;积分，<br>继续抽卡？`
				// 	this.$refs.confirm.show()
				// 	return;
				// }
				// if (this.res.Type === 2) {
				// 	this.actionId = 0
				// 	this.hasCancel = false
				// 	this.confirmBtnText = '朕知道了'
				// 	this.confirmContent = `抱歉，您当前剩余次数已为0，请扫码获取次数或明天再来~`
				// 	this.$refs.confirm.show()
				// 	return;
				// }
				//常规活动消耗积分
				// if (this.res.Type === 0 && this.res.Pointnum) {
				// 	//判断是否满足参与限制
				// 	this.res.Pointnum--
				// 	this.actionId = 1
				// 	this.hasCancel = false
				// 	this.confirmBtnText = '确定'
				// 	this.confirmContent = `本次抽卡将消耗您&nbsp;<span style="color: red;">${this.res.Point}</span>&nbsp;积分，<br>继续抽卡？`
				// 	this.$refs.confirm.show()
				// 	return;
				// }		

			},
			bindLink() {
				let self = this
				Array.from(document.querySelectorAll('a')).forEach(a => {
					a.addEventListener('click', () => {self._getAll()}, false)
				})
			},
			//抽卡动画
			showFate() {
				if (this.res.Freenum > 0) this.res.Freenum--
				this.$refs.loading.show() 
				getACard(this.aid).then(res => {
					//积分不足
					if (res.return_code === 30049) {
						this.canPlay = false
						this.ishavepoint = false
						this.$refs.loading.$el.style.opacity = 0
						this.$refs.loading.hide()
						this.showWay()
						setTimeout(() => {this.$refs.loading.$el.style.opacity = 1}, 2000) 
						return;
					}
					//接口异常信息提示
					if (res.return_code !== 0) {
						this.canPlay = false
						this.endMsg = res.return_msg
						this.$refs.loading.$el.style.opacity = 0
						this.$refs.loading.hide()
						this.showEnd(this.endMsg)
						setTimeout(() => {this.$refs.loading.$el.style.opacity = 1}, 2000)
						return;
					}
					//正常抽奖
					let index, rect, cx, cy;
					index = this.combineId[res.return_id].index
					this.copyNow = false
					this.cardList[index].num++
					this.cardImg = this.cardList[index].img
					this.$nextTick(() => {
						this.cardTxt = this.ready ? '您已集齐一套卡牌，快去兑奖吧~' : `${this.cardList[index].name}卡牌一张`
						//集齐卡牌推送消息
						if (this.ready) pushMessage(this.aid);
					})
					setTimeout(() => {this.$refs.loading.hide()}, 1500)	
					setTimeout(() => {
						if (this.tabIndex == 0) {
							cx = window.innerWidth / 4
							cy = this.tabTop - window.innerHeight / 2 + this.scrollY + (45/2)
							this.$refs.winfate.show(cx, cy, false);
						} else {
							rect = this.$refs.cardlist.$el.children[index].getBoundingClientRect()
							cx = rect.right - window.innerWidth / 2
							cy = rect.top - window.innerHeight > 0 ? (rect.top - window.innerHeight / 2) / 3 : rect.top - window.innerHeight / 2
							this.$refs.winfate.show(cx, cy, rect.top - window.innerHeight > 0);
						}
					}, 2500)		 
					setTimeout(() => {
						this.copyCards[index].num = this.cardList[index].num; 
						this.copyNow = true
					}, 3000)	
					//微信浏览器存在跳转页面后不更新接口数据问题，解决为页面上所有a标签绑定事件
					this.bindLink()
				})
			},
			destinate(cy) {
				this.$refs.scroll.scrollTo(0, this.scrollY - (cy * 2), 500)
			},
			//兑奖
			exchange(ids) {
				this.$vux.loading.show({text: 'Loading'})
				getAPrize(this.aid, this.prize.ID, ids).then(res => {
					if (res.return_code === 0) {
						this.handleNum()
						this.handleGift(res)
						setTimeout(() => { this.$refs.gift.show() }, 500)
					} else {
						this.$vux.toast.text(res.return_msg)
					}
				})
			},
			handleNum() {
				//ExchangeType兑换条件 0：组合兑换  1：数量兑换 
				if (this.prize.ExchangeType == 0) {
					this.prize.exlist.forEach(id => {
						let index = this.combineId[id].index
						this.cardList[index].num--
					})
				} else {
					this.$refs.choice.over()
				}
			},
			handleGift(res) {
				//PrizeType (integer, optional): 0:产品1：积分2：购物券3：第三方卡券4：金币5：微信红包6：红包零钱 ,
				this.giftImg = this.prize.PrizeImage
				switch (this.prize.PrizeType) {
					case 0: //产品 联盟卡券
						if (this.prize.IsUnionCard) {
							this.giftLink = res.return_link
							this.giftText = `恭喜您获得<span style="color: #F84D40">${this.prize.ProductName}</span><br/><p style="font-size:12px;color: #666;padding-top: 8px;">(请到个人中心 - 我的奖品查看到账情况)</p>`
							this.giftAtxt = '立即查看'
						} else {
							this.giftLink = res.return_link
							this.giftText = `恭喜您获得<span style="color: #F84D40">${this.prize.ProductName}</span><br/><p style="font-size:12px;color: #666;padding-top: 8px;">(请到个人中心 - 我的奖品里领取)</p>`
							this.giftAtxt = '立即领取'
						}
						break;
					case 1: //积分
						this.giftLink = null
						this.giftText = `恭喜您获得<span style="color: #F84D40">${this.prize.ProductName}</span>`
						this.giftAtxt = '知道了'
						break;
					case 2: //购物券
						this.giftLink = res.return_link
						this.giftText = `恭喜您获得<span style="color: #F84D40">${this.prize.ProductName}</span><br/><p style="font-size:12px;color: #666;padding-top: 8px;">(请到个人中心 - 我的卡包里查看)</p>`
						this.giftAtxt = '查看购物券'
						break;
					case 3: //第三方卡券
						this.giftLink = res.return_link
						this.giftText = `恭喜您获得<span style="color: #F84D40">${this.prize.ProductName}</span><br/><p style="font-size:12px;color: #666;padding-top: 8px;">(请到个人中心 - 我的奖品查看到账情况)</p>`
						this.giftAtxt = '立即查看'
						break;
					case 4: //金币
						this.giftLink = null
						this.giftText = `恭喜您获得<span style="color: #F84D40">${this.prize.ProductName}</span>`
						this.giftAtxt = '知道了'
						break;
					case 5: //微信红包
						this.giftLink = null
						this.giftText = `恭喜您获得<span style="color: #F84D40">${this.prize.ProductName}</span><br/><p style="font-size:12px;color: #666;padding-top: 8px;">(${res.return_grantstate == 1 ? '微信红包请到公众号里领取' : '抱歉，人太多了，红包发放不成功，请联系客服进行补发'})</p>`
						this.giftAtxt = '知道了'
						break;
					case 6: //红包零钱
						this.giftLink = null
						this.giftText = `恭喜您获得<span style="color: #F84D40">${this.prize.ProductName}</span><br/><p style="font-size:12px;color: #666;padding-top: 8px;">(${res.return_grantstate == 1 ? '请到个人中心 - 我的零钱中查看' : '抱歉，人太多了，红包发放不成功，请联系客服进行补发'})</p>`
						this.giftAtxt = '知道了'
						break;
				}
			}
		},
		components: {
			Newslide,
			Ftlist,
			Cardlist,
			WinFate,
			Condition,
			WinGift,
			Confirm,
	    Inform,
	    FateLoading,
	    FateChoice,
	    Pop
		}
	}
</script>

<style lang="scss">
.fate {
	.scroll {
		position: fixed;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background-color: #FED57C;
	}
	header {
		position: relative;
		.bg {
			position: relative;
			padding-top: 109%;
			img {
				position: absolute;
				width: 100%;
				height: 100%;
				top: 0;
				left: 0;
			}
		}
		.music-btn {
			position: absolute;
			left: 0.373333rem;
			top: 0.213333rem;
			width: 1.12rem;
			height: 1.12rem;
			background: url(~common/imgs/fate-music.png) no-repeat center center / 100%;
		}
		.explain {
			width: 2.346667rem;
			height: 0.8rem;
			font-size: 0.346667rem;
			color: #fff;
			background-color: rgba(0, 0, 0, .4);
			border-radius: 20px 0 0 20px;
			position: absolute;	
			top: 0.213333rem;
			right: 0;
			display: flex;	
			align-items: center;
			.text {
				line-height: 0.8rem;
		    padding-left: 0.266667rem;
		    box-sizing: border-box;
			}
			.icon {
				padding-top: 1px;
				width: 0.48rem;
				height: 0.48rem;
				border-radius: 50%;
				line-height: 0.48rem;
				text-align: center;
				color: #712522;
				font-style: normal;
		    font-weight: 700;
		    background-color: #fff;
		    margin-left: 0.106667rem;
			}
		}
		.news {
			position: absolute;
			top: 50%;
			left: 0.426667rem;
			transform: translateY(-50%);
		}
		.playing-container {
			position: absolute;
			bottom: 0.56rem;
	    left: 0;
	    right: 0;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.cishu {
				text-align: center;
				font-size: 15px;
				text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.6);
				color: #fff;
				padding-top: 0.266667rem;
				z-index: 1;
				span {
					color: #D61E49;
			    font-weight: 700;
			    padding: 0 3px;
			    font-size: 18px;
				}
			}
			.btn {
				position: relative;
				width: 5.333333rem;
				height: 1.2rem;
				font-size: 0.453333rem;
				line-height: 1.2rem;
				text-align: center;
				color: #fff;
		    margin: 0.266667rem auto 0;
				z-index: 0;
				img {
					display: block;
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					z-index: -1;
				}
			}
		}
	}
	.tab-wrapper {
		.tab0-container {
			padding-bottom: 0.533333rem;
			background: linear-gradient(to bottom, #D61E49, #E35C3D);
			.mine {
				display: block;
				width: 5.333333rem;
				line-height: 0.933333rem;
				background-color: #fff;
				color: #DA2F46;
				margin: 0 auto;
				font-size: 0.373333rem;
				text-align: center;
				border-radius: 8px;
			}
		}
		.tab1-container {
			background-color: #fff;
			padding-bottom: 0.613333rem;
		}
	}
	.fate-tab {
		height: 45px;
		line-height: 45px;
		display: flex;
		text-align: center;
		font-size: 0.4rem;
		&.out {
			position: absolute;
			z-index: 1;
			top: 0;
			left: 0;
			right: 0;
		}
		.tab0 {
			flex: 1;
			color: #fff;
			background-color: #D61E49;
			position: relative;
			&.active {
				font-weight: 700;
			}
		}
		.triangle {
			width: 16px;
			height: 45px;
			position: relative;
			background-color: #fff;
			&::before {
				content: '';
				position: absolute;
				height: 0;
				width: 0;
				left: 0;
				top: 0;
				border-bottom: 45px solid #D61E49;
				border-right: 16px solid transparent;
			}
			&.right {
				background-color: #D61E49;
				&::before {
					border-bottom: 45px solid #fff;
					border-left: 16px solid transparent;
				}
			}
		}
		.tab1 {
			flex: 1;
			color: #666;
			background-color: #fff;
			span:nth-of-type(1) {
				color: #D72448;
			}
			&.active {
				color: #E3403D;
				font-weight: 700;
				span:nth-of-type(2) {
					color: #666;
				}
			}
		}
	}
	.back-top {
		position: fixed;
		right: 0.4rem;
		bottom: 10%;
		width: 1.466667rem;
		height: 1.466667rem;
		background: url(~common/imgs/fate-top.png) no-repeat center center / 100%;
	}
}
</style>