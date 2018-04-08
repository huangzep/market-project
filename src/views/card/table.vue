<template>
	<div class="table" :class="templateClass">
		<scroll class="scroll" ref="scroll"
		:data="[...messageList, ...prizeList]"
		:pulldown="true" @pullingDown="refresh">
		<div class="yestable">
			<div class="main">
				<img :src="bgImg" alt="">
				<div class="explain">
					<p class="time">{{res.DateTimeCopy}}</p>
					<p class="info">
						{{res.Cost > 0 ? `每次消耗${res.Cost}积分` : ``}}
						{{res.DayLimit ? ` 每天最多参与${res.DayLimit}次` : ``}}
					</p>
				</div>
				<div class="table-container">
					<turn-table :prizeList="prizeList" :go="canPlay"
					@done="showResult" @disable="disable" @end="end"></turn-table>
				</div>
			</div>
			<div class="prize-wrapper">
				<h3>
					<div class="left">
						奖项内容
					</div>
					<div class="right" @click="showInfo(res.Rule)">
						活动说明
					</div>
				</h3>
				<ul class="pul">
					<li v-for="item in prizeList" v-if="item.ID">
						<div class="pl">
							<img :src="item.AwardPicture" alt="">
						</div>
						<div class="pr">
							<h4>{{item.Name}}</h4>
							<p>{{item.ProductName}}</p>
						</div>
					</li>
				</ul>
			</div>
			<div class="gift-wrapper">
				<p class="company">发行方：{{res.CompanyName}}</p>
				<div class="information">
					<roll :messageList="messageList"></roll>
				</div>
			</div>
			<div class="copy-container">
				<copy-right></copy-right>
			</div>
		</div>
		</scroll>
		<div class="yestable">
			<div class="link-wrapper">
				<a :href="res.MyPrizeLink" class="prize-link" v-light>我的奖品</a>
				<a :href="res.ShopMallLink" class="shop-link" v-light>进店逛逛</a>
			</div>
		</div>
		<!-- 消息弹框 -->
		<inform ref="inform"
		:title="infoTitle" :content="infoContent"></inform>
		<!-- 操作弹框 -->
		<confirm ref="confirm" @confirm="action" @cancel="cancel"
		:confirmBtnText="confirmBtnText" :hasCancel="hasCancel" :cancelBtnText="cancelBtnText" :text="confirmContent"></confirm>
	</div>
</template>

<script>
	import TurnTable from 'components/turn-table/turn-table'
	import Roll from 'components/roll/roll'
	import {timeOut, timeIn} from 'common/js/util'
	import actMixin from '@/mixins/actMixin'
	import scrollMixin from '@/mixins/scrollMixin'
	import moment from 'moment'

	export default {
		mixins: [actMixin, scrollMixin],
		data: () => ({ 
			productId: 0,
		}),
    computed: {
    },
    watch: {

    },
    created() {
    },
    mounted() {
    },
		methods: {
			action() {
				if (this.actionId === 11) {  //积分立即使用跳转链接
					window.location.href = this.res.SetPointLink
				} else if (this.actionId === 2) {   //积分不足跳转链接
					window.location.href = this.res.PointLink 
				} else if (this.actionId === 12) {  //购物券商城跳转链接
					window.location.href = this.res.ShopMallLink
				} else if (this.actionId === 10) {  //领取产品跳转链接
					window.location.href = this.res.SetProductLink + '&id=' + this.productId  
				} else if (this.actionId === 13) {  //会员中心跳转链接
					window.location.href = this.res.PersonalLink
				}
			},
			cancel() {
				if (this.actionId === 11) {  //查看我的积分
					window.location.href = this.res.SelectPointLink
				} else if (this.actionId === 12) {  //查看我的购物劵
					window.location.href = this.res.CouponsLink
				}
			},
			end(msg, opts) {
				if (msg === 30047) {
					this.showEnd('请稍后重试，活动马上开始~~')
					return;
				}
				if (msg === 30061) {
					this.limitLabel(opts)
					return;
				}
				this.canPlay = false
				if (msg === 30049) {
					this.ishavepoint = false
					this.showWay()
					return;
				}
				//存储抽奖失败提示语
				this.endMsg = msg
				this.showEnd(msg)
			},
			showSorry() {
				this.actionId = 0
				this.hasCancel = false
				this.confirmBtnText = '知道了'
				this.confirmContent = '亲，未中奖，下次再来哦~'
				this.$refs.confirm.show()
			},
		},
		components: {
			TurnTable,
			Roll,
		}
	}
</script>

<style lang="scss" scoped>
@import '~common/scss/mixin';
.table .scroll {
	position: fixed;
	width: 100%;
	height: 100%;
	overflow: hidden;
}
.yestable {
	width: 100%;
	overflow: hidden;
	.main {
		position: relative;
		z-index: 1;
		height: 13.386667rem;
		overflow: hidden;
		img {
			position: absolute;
			width: 100%;
			z-index: -1;
		}
		.explain {
			padding-top: 24.16%;
			font-size: 0.32rem;
			text-align: center;
			.time {}
			.info {
				font-size: 0.346667rem;
				font-weight: bold;
				span {}
			}
		}
		.table-container {
			padding-top: 0.133333rem;
		}
		&::after {
			content: '';
			display: block;
			width: 100%;
			height: 1.546667rem;
			background-repeat: repeat-x;
	    background-size: auto 1.546667rem;
	    background-position: 0 0;
	    position: absolute;
	    z-index: -1;
	    left: 0;
	    bottom: 0;
		}
	}
	.prize-wrapper {
		margin: 0.24rem 0.48rem 0;
		h3 {
			display: flex;
			justify-content: space-between;
			align-items: center;
			.left {
				font-size: 16px;
				padding: 0 12px;
				line-height: 30px;
				height: 30px;
				width: 89px;
				position: relative;
				&::after {
					content: '';
					position: absolute;
			    width: 0;
					height: 0;
					border: 15px dashed rgba(254, 205, 50, 0);
					border-left: 15px solid rgba(254, 205, 50, 1);
					right: -30px;
					top: 0;
				}
			}
			.right {
				font-size: 0.346667rem;
				padding-right: 0.72rem;
				position: relative;
				&::after {
					content: '?';
					position: absolute;
					top: 0;
					right: 0;
					width: 0.453333rem;
					height: 0.453333rem;
					text-align: center;
					line-height: 0.460rem;
					border-radius: 50%;
				}
			}
		}
		ul.pul {
			margin-top: 0.613333rem;
			li {
				font-size: 0.346667rem;
				padding: 0.16rem 0.693333rem 0 0;
				width: 9.04rem;
				height: 1.493333rem;
				border-radius: 0.266667rem;
				margin-bottom: 0.506667rem;
				display: flex;
				align-items: center;
				.pl {
					width: 0.826667rem;
					min-width: 0.826667rem;
					height: 0.826667rem;
					margin: 0 0.213333rem;
					img {
						display: block;
						width: 100%;
						height: 100%;
					}
				}
				.pr {
					max-width: 7.733333rem;
					flex: 1;
					h4 {
						margin: 0;
						font-size: 0.373333rem;
						line-height: 0.533333rem;
					}
					p {
						@include ellipsis();
						padding: 3px 0 8px;
					}
				}
			}
		}
	}
	.gift-wrapper {
		padding-bottom: 0.8rem;
		.company {
			font-size: 0.346667rem;
			padding-left: 0.72rem;
		}
		.information {
			margin: 0.106667rem 0.693333rem 0;
			height: 5.2rem;
			overflow: hidden;
		}
	}
	.link-wrapper	{
		@include link();
		.prize-link {
		}
		.shop-link {
		}
	}
	.copy-container {
		margin-bottom: 1.6rem;
	}
}
/* 模板0 */
.table.m-red {
	.scroll {background-color: #b3241c;}
	.yestable {
		background-color: #b3241c;
		.main {
			img {
			}
			.explain {
				color: #ffdc44;
				.time {
				}
				.info {
					span {}
				}
			}
			.table-container {
			}
			&::after {
		    background-image: url(~common/imgs/cloud-red.png);
			}
		}
		.prize-wrapper {
			h3 {
				.left {
					background-color: #fecd32;
					color: #b3241c;
					&::after {
				    border-left-color: #fecd32;
					}
				}
				.right {
					color: #fecd32;
					&::after {
						color: #b3241c;
						background-color: #fff;
					}
				}
			}
			ul.pul {
				li {
					background-color: #ffe3a9;
					box-shadow: 0 0.16rem 0 #b3241c;
					.pl {
					}
					.pr {
						h4 {
							color: #000;
						}
						p {
							color: #ff6422;
						}
					}
					&:first-child {
						p {color: #ffa500;}
					}
				}
			}
		}
		.gift-wrapper {
			.company {
		    color: #fbf087;
			}
			.information {
				
			}
		}
		.link-wrapper	{
			background-color: #e54d38;
			a {
		    box-shadow: 4px 4px 4px #bd2c19;
			}
			.prize-link {
				color: #925c00;
		    background-color: #fff000;
		    border-left-color: #fff336;
		    border-top-color: #fff65f;
		    border-right-color: #df8c00;
		    border-bottom-color: #df8c00;
			}
			.shop-link {
		    color: #fff;
		    background-color: #be3700;
		    border-left-color: #CE643C;
		    border-top-color: #D47853;
		    border-right-color: #A62100;
		    border-bottom-color: #A72002;
			}
		}
	}
}

/* 模板1 */
.table.m-pink {
	.scroll {background-color: #FA3F50;}
	.yestable {
		background-color: #FA3F50;
		.main {
			img {
			}
			.explain {
				color: #FF4A48;
				.time {
				}
				.info {
					span {}
				}
			}
			.table-container {
			}
			&::after {
		    background-image: url(~common/imgs/cloud-pink.png);
			}
		}
		.prize-wrapper {
			h3 {
				.left {
					background-color: #fecd32;
					color: #b3241c;
					&::after {
				    // border-color: #fecd32;
					}
				}
				.right {
					color: #fff;
					&::after {
						color: #fff;
						background-color: #FF8D97;
					}
				}
			}
			ul.pul {
				li {
					background-color: #fff;
					box-shadow: 0 0.16rem 0 #E31C2F;
					.pl {
					}
					.pr {
						h4 {
							color: #000;
						}
						p {
							color: #BC494E;
						}
					}
				}
			}
		}
		.gift-wrapper {
			.company {
		    color: #fbf087;
			}
			.information {
				
			}
		}
		.link-wrapper	{
			background-color: #FF696A;
			a {
		    box-shadow: 4px 4px 4px #bd2c19;
			}
			.prize-link {
				color: #F94050;
		    background-color: #fff;
		    border-left-color: #FEFDF9;
		    border-top-color: #FFFCFB;
		    border-right-color: #DE9489;
		    border-bottom-color: #DB9686;
			}
			.shop-link {
		    color: #650A0F;
		    background-color: #FFCABC;
		    border-left-color: #FED6CC;
		    border-top-color: #FFDFD4;
		    border-right-color: #DF7568;
		    border-bottom-color: #E07764;
			}
		}
	}
}

/* 模板2 */
.table.m-yello {
	.scroll {background-color: #00a032;}
	.yestable {
		background-color: #00a032;
		.main {
			img {
			}
			.explain {
				color: #7b410a;
				.time {
				}
				.info {
					span {}
				}
			}
			.table-container {
			}
			&::after {
		    background-image: url(~common/imgs/cloud-green.png);
			}
		}
		.prize-wrapper {
			h3 {
				.left {
					background-color: #fecd32;
					color: #b3241c;
					&::after {
				    // border-color: #fecd32;
					}
				}
				.right {
					color: #fff;
					&::after {
						color: #fff;
						background-color: #007023;
					}
				}
			}
			ul.pul {
				li {
					background-color: #fff;
					box-shadow: 0 0.16rem 0 #00a032;
					.pl {
					}
					.pr {
						h4 {
							color: #000;
						}
						p {
							color: #fc880f;
						}
					}
				}
			}
		}
		.gift-wrapper {
			.company {
		    color: #fbf087;
			}
			.information {
				
			}
		}
		.link-wrapper	{
			background-color: #39c565;
			a {
		    box-shadow: 4px 4px 4px rgba(2,103,34,.7);
			}
			.prize-link {
				color: #007324;
		    background-color: #fff;
		    border-left-color: #fff;
		    border-top-color: #fff;
		    border-right-color: #95aa9b;
		    border-bottom-color: #95aa9b;
			}
			.shop-link {
		    color: #925c00;
		    background-color: #fff000;
		    border-left-color: #fff336;
		    border-top-color: #fff65f;
		    border-right-color: #df8c00;
		    border-bottom-color: #df8c00;
			}
		}
	}
}
</style>