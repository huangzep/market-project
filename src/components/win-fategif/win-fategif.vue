<template>
	<transition name="gift">
		<div class="win-gift" v-show="0" @click="hide" @touchmove.prevent>
			<div class="gift-wrapper" @click.stop>
				<div class="gift-content">
					<div class="top">
						<img src="~common/imgs/dui_icon.png" alt="">
						<span>兑换成功</span>
					</div>
					<div class="gift-img">
						<img :src="giftImg" alt="">
					</div>
					<div class="gift-name" v-html="giftText"></div>
					<div class="btn">
						知道了
					</div>
				</div>
				<div class="del" @click="hide"></div>
			</div>
		</div>
	</transition>
</template>

<script>
	
	export default {
		props: {
			giftImg: {
				type: String,
				default: '//staticf.miduonet.com/houtai/images/jizi/bg_jizi.jpg?v=1.0.1.9'
			},
			giftText: {
				type: String,
				default: '恭喜您获得<span style="color: #F84D40">红包39元</span>'
			},
			prizeLink: {
				type: String
			}
		},
		data: () => ({ 
			showFlag: false, 
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
			show() {
				this.showFlag = true
			},
			hide() {
				this.showFlag = false
			},
		},
		components: {
		
		}
	}
</script>

<style lang="scss" scoped>
@import '~common/scss/mixin';
.win-gift {
	@include cover();
	&.gift-enter-active {
		animation: fadein 1s;
		.gift-content {
			animation: gift-zoom 1s;
		}
	}
	.gift-wrapper {
		@include wrapper();
		.gift-content {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 6.933333rem;
			position: relative;
			background-color: #fff;
			border-radius: 8px;
			.bg {
				@include bg();
			}
			.top {
				display: flex;
				align-items: center;
				font-size: 0.426667rem;
				color: #333;
				line-height: 1;
				padding: 0.586667rem 0 0.453333rem;
				img {
					display: block;
					width: 0.533333rem;
					height: 0.533333rem;
					margin-right: 0.133333rem;
				}
			}
			.gift-img {
				width: 2.506667rem;
				height: 2.533333rem;
				img {
					display: block;
					width: 100%;
					height: 100%;
					border-radius: 6px;
				}
			}
			.gift-name {
				margin-top: 0.373333rem;
				text-align: center;
				font-size: 0.426667rem;
				width: 5.466667rem;
				@include ellipsis2();
			}
			.btn {
				text-align: center;
				color: #fff;
				width: 3.466667rem;
				line-height: 0.933333rem;
				background-color: #F84D40;
				border-radius: 4px;
				font-size: 0.4rem;
				margin-bottom: 0.533333rem;
				margin-top: 0.773333rem;
			}
		}
		.del {
			position: absolute;
			width: 0.64rem;
			height: 0.64rem;
			top: -0.8rem;
		  right: -0.666667rem; 
		  background: url(~common/imgs/fate-close.png) no-repeat center center / 100%;
		}
	}
}
.m1 {
	.win-gift {
		.gift-wrapper {
			.gift-content {
				.bg {
				}
				.top {
				}
				.gift-img {
				}
				.gift-name {
				}
				.btn {
					background: linear-gradient(#ffc208 2%, #e4310d 53%);
			    box-shadow: 0 2px 5px rgba(170,16,41,.3);
				}
			}
			.del {
			}
		}
	}
}
</style>