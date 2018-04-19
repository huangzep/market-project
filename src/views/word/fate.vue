<template>
	<div class="fate">
		<!-- scroll内容 -->
		<scroll class="scroll" ref="scroll" :probe-type="3"
		:data="messageList" :listen-scroll="true" 
		 @scroll="scroll" >
			<div>
				<header>
					<div class="bg">
						<img :src="pimg('fate-bg.jpg')" alt="">
					</div>
					<!-- <div class="music-btn"></div> -->
					<div class="explain">
						<span class="text" @click="showInfo(res.RuleText)">活动说明</span>
						<span class="icon">?</span>
					</div>
					<div class="news">
						<newslide v-if="messageList.length" :messageList="messageList"></newslide>
					</div>
					<div class="playing-container">
						<div class="cishu">
							您当前剩余<span>10</span>次抽卡机会
						</div>
						<div class="btn" @click="showFate" v-light>
							点击抽卡
							<img v-if="1" src="~common/imgs/fate-btn.png" alt="">
							<img v-else src="~common/imgs/fate-btn-hui.png" alt="">
						</div>
					</div>
				</header>
				<!-- tab移动栏 -->
				<div class="fate-tab" ref="fateTap">
					<div class="tab0" :class="{'active': tabIndex === 0}"
					@click="tabIndex = 0">奖品兑换区</div>
					<div class="tab1" :class="{'active': tabIndex === 1}" 
					@click="tabIndex = 1">我的卡牌（<span>14</span>/<span>28</span>）</div>
				</div>
				<div class="tab-wrapper">
					<div class="tab0-container" v-show="!tabIndex">
						<ftlist></ftlist>
						<div class="mine">我的奖品</div>
					</div>
					<div class="tab1-container" v-show="tabIndex">
						<cardlist ref="cardlist"></cardlist>
					</div>
				</div>
				<div class="copy-container">
					<copy-right></copy-right>
				</div>
			</div>
			<!-- tab移动栏 -->
			<div class="fate-tab out" v-show="fixShow">
				<div class="tab0" :class="{'active': tabIndex === 0}"
					@click="tabIndex = 0">奖品兑换区</div>
				<div class="tab1" :class="{'active': tabIndex === 1}" 
					@click="tabIndex = 1">我的卡牌（<span>14</span>/<span>28</span>）</div>
			</div>
		</scroll>
		<!-- 消息弹框 -->
		<inform ref="inform" :content="infoContent"></inform>
		<!-- 顶部按钮 -->
		<div class="back-top" @click="gotop" v-show="fixShow"></div>
		<!-- 抽卡动画 -->
		<win-fate ref="winfate" @destinate="destinate"></win-fate>
		<!-- 兑换条件 -->
		<condition></condition>
		<!-- 兑奖动画 -->
		<win-fategif ref="fategif"></win-fategif>
		<!-- loading动画 -->
		<fate-loading ref="loading"></fate-loading>
	</div>
</template>

<script>
	import Newslide from 'components/newslide/newslide'
	import Ftlist from 'components/ftlist/ftlist'
	import Cardlist from 'components/cardlist/cardlist'
	import Scroll from 'components/scroll/scroll'
	import WinFate from 'components/win-fate/win-fate'
	import Condition from 'components/condition/condition'
	import WinFategif from 'components/win-fategif/win-fategif'
	import FateLoading from 'components/fate-loading/fate-loading'
	import {getActInfo, getPrize, exchangePrize} from 'services/wordActApi'
	import Confirm from 'components/confirm/confirm'
	import Inform from 'components/inform/inform'

	export default {
		data: () => ({ 
			res: {},
			scrollY: -1,
			fixShow: false,  //外层tab显示隐藏
			messageList: [], 
			tabIndex: 0,		 //tab索引
			infoContent: ''
		}),
    computed: {
     
    },
    watch: {
			scrollY(newY) {
				this.fixShow = (-newY - this.tabTop > 0)
			},
			tabIndex(val) {
				this.fixShow && this.$refs.scroll.scrollToElement(this.$refs.fateTap)
			},
    },
    created() {
this._getAll()
    },
    mounted() {
    	this.tabTop = this.$refs.fateTap.offsetTop
    	console.log(this.$refs.cardlist.$el.children[2].getBoundingClientRect())
    },
		methods: {
			_getAll() {
				this.aid = '1A6956A9-AAF6-4DAA-AAB7-F5AB9BA78B35'
				getActInfo(this.aid).then(res => {
	    		if (res.return_code === 0) {
	    			document.title = res.return_data.Title
	    			this.res = res.return_data
	    			this.messageList = res.return_data.MessageList
	    			this.prizeList = res.return_data.PrizeList
	    		} else  {
	    			this.canPlay = false
	    		}
	    	}).catch(error => {
	    		console.log(error)
					// this.$vux.toast.text('网络连接失败，请稍后<br/>重试')
				})	
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
			refresh() {
				this.list = [3, 2, 2, 4, Math.random()]
			},
			showFate() {
				let index, rect;
				this.tabIndex = 1
				this.$refs.loading.show() 
				getPrize(this.aid).then(res => {
					index = Math.floor(Math.random() * 15)
					// index = 12
					setTimeout(() => {
						this.$refs.loading.hide();
					}, 1500)	
					setTimeout(() => {
						rect = this.$refs.cardlist.$el.children[index].getBoundingClientRect()
						this.$refs.winfate.show(rect.right - window.innerWidth / 2, (rect.top - window.innerHeight / 2) / 3);
					}, 2500)		 
					
				}).catch(error => {
					this.$refs.loading.hide() 
					setTimeout(() => {
						this.$vux.toast.text('网络连接失败，请稍后<br/>重试')
					}, 500)
				})
			},
			destinate(cy) {
				this.$refs.scroll.scrollTo(0, this.scrollY - (cy * 2), 500)
			}
		},
		components: {
			Newslide,
			Ftlist,
			Cardlist,
			Scroll,
			WinFate,
			Condition,
			WinFategif,
			Confirm,
	    Inform,
	    FateLoading,
		}
	}
</script>

<style lang="scss" scoped>
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
			left: 2.32rem;
			bottom: 0.56rem;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.cishu {
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
		height: 55px;
		display: flex;
		text-align: center;
		font-size: 0.4rem;
		line-height: 55px;
		&.out {
			position: absolute;
			z-index: 1;
			top: 0;
			left: 0;
			right: 0;
		}
		.tab0 {
			width: 4.72rem;
			color: #fff;
			background-color: #D61E49;
			position: relative;
			&::before {
				content: '';
				position: absolute;
				right: -20px;
				height: 0;
				width: 0;
				border-bottom: 55px solid #D61E49;
				border-right: 20px solid transparent;
			}
			&.active {
				font-weight: 700;
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