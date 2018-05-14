<template>
	<div class="home" :class="{'m1': res.TemplateType}">
		<scroll class="home-content" ref="scroll" 
		:data="[...wordList, ...prizeList]" 
		:listenScroll="true" :pulldown="true" @pullingDown="refresh">
			<div>
				<header>
					<div class="bg">
						<img :src="bgImg" alt="">
					</div>
					<div class="explain" @click="showInfo(res.RuleText)" v-light>
						<span class="text">活动说明</span>
						<span class="icon">?</span>
					</div>
					<div class="news">
						<newslide v-if="messageList.length" :messageList="messageList"></newslide>
					</div>
				</header>
				<div class="playing-container">
					<div class="cishu" v-if="res.Type !== 0">
						您拥有<span>{{res.Freenum}}</span>次抽字次数
					</div>
					<div class="btn" :class="{'on': canPlay}"
					@click="showTips" v-light>
						点击抽字
						<img v-if="canPlay" src="~common/imgs/mb_btn1.png" alt="">
						<img v-else src="~common/imgs/mb_btn2.png" alt="">
					</div>
				</div>
				<word-list v-if="wordList.length" :wordList="wordList"></word-list>
				<div v-else class="" style="padding: 20px;"></div>
				<div class="prize-container" ref="prizeContainer">
					<div class="top">
						<p class="p1">兑奖区</p>
						<p class="p2">（每种字各一张就可兑换一份奖品）</p>
					</div>
					<prize-list :prizeList="prizeList" :hasGift="hasGift"
					@exchange="showEx"></prize-list>
					<div class="bottom">
						<a :href="res.MyPrizeLink" v-light @click="_getAll">我的奖品</a>
					</div>
				</div>
				<div class="copy-container">
					<copy-right></copy-right>
				</div>
			</div>
		</scroll>
    <!-- 消息弹框 -->
		<inform ref="inform"
		:title="infoTitle" :content="infoContent"></inform>
		<!-- 操作弹框 -->
		<confirm ref="confirm" @confirm="action" :confirmBtnText="confirmBtnText"
		:hasCancel="hasCancel" :text="confirmContent"></confirm>
		<!-- 兑奖区域 -->
		<win-gift ref="gift" :prizeLink="returnLink"
		:giftImg="giftImg" :giftText="giftText"></win-gift>
		<!-- 集字区域 -->
		<win-word ref="word" :keyWord="word" :lack="lack"
		@goPrize="goPrize"></win-word>
		<!-- loading动画 -->
		<loading ref="loading" :model="res.TemplateType || ''"></loading>
		<!-- 滑块验证 -->
		<!-- <pop ref="pop" @success="showWord"></pop> -->
	</div>
</template>

<script>
	import Newslide from 'components/newslide/newslide'
	import WordList from 'components/word-list/word-list'
	import PrizeList from 'components/prize-list/prize-list'
	import WinGift from 'components/win-gift/win-gift'
	import WinWord from 'components/win-word/win-word'
	import Loading from 'components/loading/loading'
	import Scroll from 'components/scroll/scroll'
	// import Pop from 'components/pop/pop'
	import actMixin from '@/mixins/actMixin'
	import {getActInfo, getPrize, exchangePrize} from 'services/wordActApi'
	import {getWxdata} from 'services/wxApi'
	import {timeOut, difSeconds} from 'common/js/util'

	// c1dc66cb-69ba-4d82-95ca-23b091b8ce48
	
	export default {
		mixins: [actMixin],
		data: () => ({
			wordList: [],
			copyWordList: [],
			word: '',
			pid: 0,
			giftImg: '',
			giftText: '',
			scrollY: 0,
			returnLink: ''
		}),
    computed: {
    	bgImg() {
    		if (JSON.stringify(this.res) === "{}") {
    			return ''
    		} else if (this.res.ThemeImage) {
    			return this.res.ThemeImage
    		} else if (this.res.TemplateType) {
    			return this.pimg('mb_bg.jpg')
    		} else {
    			return this.pimg('bg_jizi.jpg')
    		}
    	},
      hasGift() {
	     	return !this.wordList.some(item => {
	     		return item.Count < 1
	     	})
      },
      lack() {
	     	return this.copyWordList.reduce((accu, cur) => {
	     		return cur.Count < 1 ? accu + 1 : accu
	     	}, 0)
      }
    },
    watch: {
    },
    created() {
    },
    mounted() {
  		if (this.n = this.$route.query.num) this.showNum(this.n)
    },
		methods: {
			_getAll() {
				getActInfo(this.aid).then(res => {
	    		if (res.return_code === 0) {
	    			document.title = res.return_data.Title
	    			this.res = res.return_data
	    			this.wordList = res.return_data.WordList
	    			this.copyWordList = this.wordList.map(item => {
	    				return {Count: item.Count}
	    			})
	    			this.messageList = res.return_data.MessageList
	    			this.prizeList = res.return_data.PrizeList
	    			if (timeOut(this.res.EndTime)) {
	    				this.canPlay = false
	    			}
	    			if (!timeOut(this.res.StartTime)) {
	    				this.showBefore(this.res.StartTime)
	    			}
	    		} else  {
	    			this.canPlay = false
	    		}
	    	})
			},
			refresh() {
				clearTimeout(this.timer)
				this.timer = setTimeout(() => {
					this.$vux.loading.show({text: 'Loading'})
					this.messageList = []
					this._getAll()
					this.$refs.scroll.finishPullDown()
				}, 20)
			},
			showTips() {
				if (!this.canPlay && timeOut(this.res.EndTime)) {
  				this.$vux.toast.text('抱歉，活动时间已结束')
					return;
  			}
  			//积分不足弹框
  			if (!this.canPlay && !this.ishavepoint) {
  				this.showWay()
					return;
  			}
				//活动时间未开始弹框
				if (!timeOut(this.res.StartTime)) {
					this.showBefore(this.res.StartTime)
					return;
				}
				//扫码抽字次数已用完，继续抽字消耗积分
				if (!this.res.Freenum && this.res.Type !== 1 && this.canPlay) {
					this.actionId = 1
					this.hasCancel = true
					this.confirmBtnText = '确认'
					this.confirmContent = `本次将消耗&nbsp;<span style="color: red;">${this.res.Point}</span>&nbsp;积分，继续<br>抽字？`
					this.$refs.confirm.show()
					return;
				}
				//扫码活动次数已用完
				if (!this.res.Freenum && this.res.Type === 1) {
					this.canPlay = false
					this.showEnd('抱歉，当前抽字次数已用完，请扫码获取次数后再来~')
					return;
				}
				//扫码活动抽字
				if (this.res.Freenum) {
					this.res.Freenum--;
					this.showWord()	
					return;
				}
				//提示弹框
				if (!this.canPlay) {
					this.showEnd(this.endMsg)
					return;
				}		  							
			},
			showWord() {
				this.$refs.loading.show() 
				getPrize(this.aid).then(res => {
					if (res.return_code === 0) {
						let index = -1
						this.wordList.forEach((n, i) => {
							if (n.ID == res.return_index) index = i
						})
						if (index > -1) {
							this.word = this.wordList[index].Name
							this.copyWordList[index].Count++
							setTimeout(() => {
								this.$refs.loading.hide() 
								this.$refs.word.show()
							}, 1000)			
							setTimeout(() => {
								this.wordList[index].Count++
							}, 2000)	
						} 
					} else if (res.return_code === 30049) {
						this.canPlay = false
						this.ishavepoint = false
						setTimeout(() => {
							this.$refs.loading.hide() 
						}, 1000)
						setTimeout(() => {
							this.showWay()
						}, 1500)
					} else {
						this.canPlay = false
						setTimeout(() => {
							this.$refs.loading.hide() 
						}, 1000)
						setTimeout(() => {
							this.endMsg = res.return_msg
							this.showEnd(res.return_msg)
						}, 1500)
					}	
				}).catch(error => {
					this.$refs.loading.hide() 
					setTimeout(() => {
						this.$vux.toast.text('网络连接失败，请稍后<br/>重试')
					}, 500)
				})
			},
			action() {
				if (this.actionId === 1) {
					this.showWord()
					// this.$refs.pop.show()
				} else if (this.actionId === 2) {
					window.location.href = this.res.PointLink
				} else if (this.actionId === 3) {
					this.exchange()
				} else if (this.actionId === 4) {
					window.location.href = this.res.MyPrizeLink
				} 
			},
			showEx(pid, giftImg, item) {
				this.pid = pid
				this.giftImg = giftImg
				this.aliance = item
				this.actionId = 3
				this.hasCancel = true
				this.confirmBtnText = '确定'
				this.confirmContent = '确定兑换该奖品吗？'
				this.$refs.confirm.show()
			},
			exchange() {
				this.$vux.loading.show({text: 'Loading'})
				exchangePrize(this.aid, this.pid).then(res => {
					if (res.return_code === 0) {
						this.returnLink = res.return_link ? res.return_link : this.res.MyPrizeLink
						this.giftText = res.return_msg
						if (this.aliance.Type === 5) {
							this.showAliance(this.aliance)
						} else {
							setTimeout(() => { this.$refs.gift.show() }, 500)
						}
					}
					this._getAll()
				}).catch(error => {
					this.$vux.toast.text('网络连接失败，请稍后<br/>重试')
				})				
			},
			showAliance(prize) {
	      this.actionId = 4
	      this.hasCancel = false
	      this.confirmBtnText = '立即查看'
	      this.confirmContent = 
	      `<div class="card-prize-confirm">
	        <h3 class="pname">联盟卡券</h3>
	        <h5 class="pt">您获得的奖励如下：</h5>
	        <div class="pcon">
	          <img src="${prize.Image}" alt="" >
	          <p>
	            ${prize.Name}
	          </p>
	          <span>x1</span>
	        </div>
	        <h6 class="ptip"><span>* </span>请到个人中心 - 我的奖品查看到账情况</h6>
	       </div>`
	      this.$refs.confirm.show()
	    },
			//滚动到兑奖区
			goPrize() {
				this.$refs.scroll.scrollToElement(this.$refs.prizeContainer, 200)
			}
		},
		components: {
			Newslide,
			WordList,
			PrizeList,
			WinGift,
			WinWord,
			Loading,
			Scroll,
			// Pop
		}
	}
</script>

<style scoped lang="scss">
.home {
	background-color: #d11d3a;
	header {
		position: relative;
		.bg {
			position: relative;
			padding-top: 90.6%;
			img {
				position: absolute;
				width: 100%;
				height: 100%;
				top: 0;
				left: 0;
			}
		}
		.explain {
			width: 2.666667rem;
			height: 0.933333rem;
			font-size: 0.373333rem;
			color: #fff;
			background-color: #e62542;
			border-radius: 20px 0 0 20px;
			position: absolute;	
			top: 0.4rem;
			right: 0;
			display: flex;	
			align-items: center;
			.text {
				line-height: 0.933333rem;
		    padding-left: 0.4rem;
		    box-sizing: border-box;
			}
			.icon {
				width: 0.48rem;
				height: 0.48rem;
				border-radius: 50%;
				line-height: 0.48rem;
				text-align: center;
				color: #ed2841;
				font-style: normal;
		    font-weight: 700;
		    background-color: #fff;
		    margin-left: 0.106667rem;
			}
		}
		.news {
			position: absolute;
			top: 50%;
			left: 0;
			transform: translateY(-50%);
		}
	}
	.playing-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-bottom: 0.4rem;
		.cishu {
			font-size: 14px;
			color: #fcf3bd;
			padding-top: 0.266667rem;
			z-index: 1;
			span {
				color: #fff70f;
		    font-weight: 700;
		    padding: 0 3px;
		    font-size: 18px;
			}
		}
		.btn {
			width: 6.4rem;
			height: 1.226667rem;
			font-size: 0.746667rem;
			line-height: 1.173333rem;
			text-align: center;
			color: #ccc;
			background-color: #eee;
			border: 1px solid #fff;
	    margin: 0.266667rem auto 0;
			border-radius: 0.8rem;
			z-index: 1;
			img {
				display: none;
			}
			&.on {
				color: #fe0117;
				border: 1px solid #ffea00;
				background: linear-gradient(0, #f7efae, #fed275);
		    box-shadow: 0 5px 5px #af0109;
			}
		}
		.more-chance {
			text-align: center;
			color: #ffcc00;
			padding-top: 0.4rem;
		}
	}
	.prize-container {
		margin: 0 0.4rem;
		background-color: #fcf0d2;
		border-radius: 0.133333rem;
		padding: 0.533333rem 0 0.666667rem;
		.top {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.p1 {
				font-size: 0.48rem;
				color: #333;
				text-align: center;
				font-weight: 700;
			}
			.p2 {
				text-align: center;
				color: #999;
				padding-top: 0.133333rem;
			}
		}
		.bottom {
			a {
				display: block;
				width: 4.0rem;
				height: 0.933333rem;
				margin: 0.666667rem auto 0;
				border-radius: 0.533333rem;
				color: #fff;
				border: 1px solid #ff824f;
				text-align: center;
				line-height: 0.88rem;
				background-color: #de1e42;
				box-shadow: 0 0 0.106667rem #fd0029;
				font-size: 0.426667rem;
			}
		}
	}
}
.home-content {
	position: fixed;
	width: 100%;
	height: 100%;
	overflow: hidden;
	background-color: #d11d3a;
	.pullup-wrapper {
		position: absolute;
		top: -50px;
		width: 100%;
		text-align: center;
		line-height: 1.333333rem;
		font-size: 0.373333rem;
		z-index: -1;
		color: pink;
		.pullup-content {
			display: flex;
			justify-content: center;
			align-items: center;
			i {
				transition: all .5s;
			}
			p {
				margin-left: 4px;
			}
		}
	}
}
.home.m1 {
	.home-content {
		background-color: #ffe483;
	}
	header {
		.bg {
			padding-top: 82.6%;
			img {
			}
		}
		.explain {
			background-color: rgba(106,15,161,0.8);
			.text {
			}
			.icon {
				color: #fff;
				background: none;
		    border: 1px solid #fff;
		    margin-bottom: 2px;
		    line-height: 0.426667rem;
			}
		}
		.news {
		}
	}
	.playing-container {
		.cishu {
			font-size: 14px;
			color: #e54c0e;
			span {
				color: #ff2525;
		    font-weight: 700;
		    padding: 0 3px;
		    font-size: 18px;
			}
		}
		.btn {
			position: relative;
			box-shadow: none;
			img {
				display: block;
				position: absolute;
				top: -2px;
				left: -1.013333rem;
				width: 8.4rem;
			}
		}
		.more-chance {
		}
	}
	.prize-container {
		background-color: #fff2c1;
		border-radius: 0.133333rem;
		padding: 0.533333rem 0 0.666667rem;
		border: 1px solid #cf8630;
		.top {
			margin-top: -1.066667rem;
			.p1 {
				color: #ff5104;
				background-color: #fff2c1;
				padding: 0.16rem 0.666667rem;
				border: 1px solid #cf8630;
				border-radius: 0.133333rem;
			}
			.p2 {
				color: #93561b;
			}
		}
		.bottom {
			a {
				color: #e4310d;
				border: 1px solid #ff4f11;
				box-shadow: 0 0 6px rgba(204,91,0,.5);
				background: -webkit-gradient(linear, 0 0, 0 bottom, from(#fff), to(#ffe58b));

			}
		}
	}
}
</style>