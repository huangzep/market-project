<template>
	<div class="card"  :class="templateClass">
		<scroll class="scroll" ref="scroll"
		:data="[...messageList, ...prizeList]"
		:pulldown="true" @pullingDown="refresh">
		<div class="yescard">
			<div class="box">
				<div class="bg">
					<img :src="bgImg" alt="">
				</div>
				<div class="gua-container">
					<guagua ref="gua" :prizeList="prizeList" :txt="txt" 
					:canPlay="canPlay" @end="end" @disable="disable"></guagua>
				</div>
			</div>
			<div class="prize-container">
				<h3>奖项内容</h3>
				<ul class="prize-list">
					<li v-for="(item, index) in prizeList" v-if="item.ID">
						<img :src="item.AwardPicture" alt="">
						<span class="name">{{item.Name}}</span>：
						<span class="info">{{item.ProductName}}</span>
					</li>
				</ul>
			</div>
			<div class="time-container">
				<h3>活动有效时间</h3>
				<div class="rewardcon">
					 {{res.DateTimeCopy}}<br>发行人：{{res.CompanyName}}
				</div>
			</div>
			<div class="lucky-container">
				<h3>中奖名单</h3>
				<div class="lucky-men">
					<div class="lucky">
						<roll :messageList="messageList"></roll>
					</div>
				</div>
			</div>
			<div class="introduce" @click="showInfo(res.Rule)">
				<span>活动说明>></span>
			</div>
			<div class="copy-container">
				<copy-right></copy-right>
			</div>
		</div>
		</scroll>
		<div class="yescard">
			<div class="link-wrapper">
				<a :href="res.MyPrizeLink" class="prize-link" v-light>我的奖品</a>
				<a :href="res.ShopMallLink" class="shop-link" v-light>进店逛逛</a>
			</div>
		</div>
		<!-- 消息弹框 -->
		<inform ref="inform"
		:title="infoTitle" :content="infoContent"></inform>
		<!-- 操作弹框 -->
		<confirm ref="confirm" @confirm="action" @cancel="cancel" @hide="hide"
		:confirmBtnText="confirmBtnText" :hasCancel="hasCancel" :cancelBtnText="cancelBtnText" :text="confirmContent"></confirm>
	</div>
</template>

<script>
	import Guagua from 'components/guagua/guagua'
	import Roll from 'components/roll/roll'
	import actMixin from '@/mixins/actMixin'
	import scrollMixin from '@/mixins/scrollMixin'
	import {getActivityInfo} from 'services/cardActApi'
	import {timeOut, timeIn} from 'common/js/util'
	import moment from 'moment'

	export default {
		mixins: [actMixin, scrollMixin],
		data: () => ({ 
			productId: 0
		}),
    computed: {
     txt() {
     	return (this.res.Cost > 0 ? `每次消耗${this.res.Cost}积分` : ``) + (this.res.DayLimit ? ` 每天最多参与${this.res.DayLimit}次` : ``)
     },
    },
    watch: {

    },
    created() {
    },
    mounted() {

    },
		methods: {
			action() {
				if (this.actionId === 10) {  //领取产品跳转链接
					window.location.href = this.res.SetProductLink + '&id=' + this.productId  
				} else if (this.actionId === 11) { //积分立即使用跳转链接
					window.location.href = this.res.SetPointLink
				} else if (this.actionId === 12) { //购物券商城跳转链接
					window.location.href = this.res.ShopMallLink
				} else if (this.actionId === 2) { //积分不足跳转链接
					window.location.href = this.res.PointLink 
				} else if (this.actionId === 13) { //会员中心跳转链接
					window.location.href = this.res.PersonalLink
				}
			},
			cancel() {
				if (this.actionId === 11) {  //查看我的积分链接
					window.location.href = this.res.SelectPointLink
				} else if (this.actionId === 12) {  //查看我的购物券
					window.location.href = this.res.CouponsLink
				}
			},
			hide() {
				this.$refs.gua.init()
			},
			end(pix, opts) {
				//活动时间未开始
				if (this.isBefore) {
					this.showBefore(this.res.StartDateTime)
					return;
				}
				//当日活动时间未开始
				if (this.isDayOut) {
					this.limitTime(this.res.TimeStartDateTime, this.res.TimeEndDateTime)
            return; 
				}
				//会员限制 
				if (this.isLimitVip) {
					this.limitVip(this.res.MemberList)
            return;
				}
				//标签限制
				if (this.isLimitLabel) {
					this.limitLabel(this.res.LimitExplain)
          return;
				}
				//积分不足
				if (pix === 30049) {
					this.ishavepoint = false
					this.showWay()
					return;
				}
				if (pix === 30047) {
					this.showEnd('请稍后重试，活动马上开始~~')
					return;
				}
				if (pix === 30061) {
					this.limitLabel(opts)
					return;
				}
				if (Number.isInteger(pix)) {
					this.showResult(pix, opts)
					return;
				}
				this.endMsg = pix
				this.showEnd(pix)
			},
			showSorry() {
				this.actionId = 0
	      this.hasCancel = false
	      this.confirmBtnText = '知道了'
	      this.confirmContent = `很遗憾，未中奖！<br/>换个姿势试试吧~`
	      this.$refs.confirm.show()
			},
		},
		components: {
			Guagua,
			Roll,
		}
	}
</script>

<style lang="scss" scoped>
@import '~common/scss/mixin';
.card .scroll {
	position: fixed;
	width: 100%;
	height: 100%;
	overflow: hidden;
}
.yescard {
	.box {
		.bg {
			position: relative;
			padding-top: 75%;
			overflow: hidden;
			img {
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
			}
		}
		.gua-container {
			position: relative;
			z-index: 1;
			height: 4.373333rem;
			margin-top: -3.573333rem;
			overflow: hidden;
		}
	}
	.prize-container {
		padding-top: 0.96rem;
		h3 {
			@include arrow-title();
		}
		ul.prize-list {
			background-color: #f6feea;
			color: #333;
			@include card-content();
			li {
				padding-bottom: 0.373333rem;
				display: flex;
				img {
					width: 0.453333rem;
					min-width: 0.453333rem;
					height: 0.64rem;
				}
				.name {
					padding-top: 0.186667rem;
					line-height: 0.373333rem;
					max-width: 1.6rem;
					margin-left: 0.266667rem;
					@include ellipsis();
				}
				.info {
					color: #ff5742;
					flex: 1;
					padding-top: 0.186667rem;
					line-height: 0.4rem;
					@include ellipsis2();
				}
			}
		}
	}
	.time-container {
		padding-top: 0.533333rem;
		h3 {
			@include arrow-title();
		}
		.rewardcon {
			@include card-content();
			color: #333;
		}
	}
	.lucky-container {
		padding-top: 0.533333rem;
		h3 {
			@include arrow-title();
		}
		.lucky-men {
			@include card-content();
			.lucky {
				height: 5.2rem;
				overflow: hidden;
			}
		}
	}
	.introduce {
		margin: 0.4rem 0.266667rem 0;
		line-height: 0.8rem;
		border-radius: 50%;
		text-align: center;
		span {
			font-size: 0.373333rem;
			color: #ff5742;
		}
	}
	.link-wrapper {
		@include link();
		a {
			border: 1px solid #3a1315;
			height: 1.066667rem;
			line-height: 1rem;
		}
		.prize-link {
		}
		.shop-link {
		}
	}
	.copy-container {
		padding-bottom: 1.6rem;
	}
}
/* 红模板 */
.card.m-red {
	.scroll {background-color: #FFED65;}
	.yescard {
		background-color: #FFED65;
		.box {
			.bg {
			}
			.gua-container {
				background: url(~common/imgs/guakabg-red.png) no-repeat center / 100% auto;
			}
		}
		.prize-container {
			h3 {
				@include arrow-title(#E8124A);
			}
			ul.prize-list {
				background-color: #FFF7BA;
				li {
				}
			}
		}
		.time-container {
			h3 {
				@include arrow-title(#E8124A);
			}
			.rewardcon {
				background-color: #FFF7BA;
			}
		}
		.lucky-container {
			h3 {
				@include arrow-title(#E8124A);
			}
			.lucky-men {
				background-color: #FFF7BA;
			}
		}
		.introduce {
			background-color: #FFF6B2;
			span {
				color: #ff5742;
			}
		}
		.link-wrapper {
			background-color: #FFCC28;
			a {
				color: #fff;
			}
			.prize-link {
		    background-color: #E8124A;
			}
			.shop-link {
		    background-color: #FE7E00;
			}
		}
		.copy-container {
		}
	}
}

/* 绿模板 */
.card.m-green {
	.scroll {background-color: #eafdd1;}
	.yescard {
		background-color: #eafdd1;
		.box {
			.bg {
			}
			.gua-container {
				background: url(~common/imgs/guakabg-green.png) no-repeat center / 100% auto;
			}
		}
		.prize-container {
			h3 {
			}
			ul.prize-list {
				background-color: #f6feea;
				li {
				}
			}
		}
		.time-container {
			h3 {
			}
			.rewardcon {
				background-color: #f6feea;
			}
		}
		.lucky-container {
			
		}
		.introduce {
			background-color: #f9fef1;
			span {
				color: #ff5742;
			}
		}
		.link-wrapper {
			background-color: #C6F5C6;
			a {
				color: #13193a;
			}
			.prize-link {
		    background-color: #eeeb16;
			}
			.shop-link {
		    background-color: #f4ba00;
			}
		}
		.copy-container {
		}
	}
}

/* 蓝模板 */
.card.m-blue {
	.scroll {background-color: #ACE9FC;}
	.yescard {
		background-color: #ACE9FC;
		.box {
			.bg {
			}
			.gua-container {
				background: url(~common/imgs/guakabg-blue.png) no-repeat center / 100% auto;
			}
		}
		.prize-container {
			h3 {
				@include arrow-title(#0D7BC9);
			}
			ul.prize-list {
				background-color: #DAF5FE;
				li {
				}
			}
		}
		.time-container {
			h3 {
				@include arrow-title(#0D7BC9);
			}
			.rewardcon {
				background-color: #DAF5FE;
			}
		}
		.lucky-container {
			h3 {
				@include arrow-title(#0D7BC9);
			}
			.lucky-men {
				background-color: #DAF5FE;
			}
		}
		.introduce {
			background-color: #D8EFFF;
			span {
				color: #ff5742;
			}
		}
		.link-wrapper {
			background-color: #D6F4FE;
			a {
				color: #13193a;
			}
			.prize-link {
		    background-color: #eeeb16;
			}
			.shop-link {
		    background-color: #f4ba00;
			}
		}
		.copy-container {
		}
	}
}

</style>