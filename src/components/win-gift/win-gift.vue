<template>
	<transition name="gift">
		<div class="win-gift" v-show="showFlag" @click="hide" @touchmove.prevent>
			<div class="gift-wrapper" @click.stop>
				<div class="gift-content">
					<div class="bg">
						<div class="bgc"></div>
					</div>
					<div class="top">
						<img src="~common/imgs/dui_icon.png" alt="">
						<span>兑奖成功</span>
					</div>
					<div class="gift-img">
						<img :src="giftImg" alt="">
					</div>
					<div class="gift-name" v-html="giftText"></div>
					<div class="btn">
						<a :href="prizeLink" @click="hide" v-html="atxt"></a>
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
				type: String
			},
			giftText: {
				type: String,
			},
			prizeLink: {
				type: String,
				default: null
			},
			atxt: {
				type: String,
				default: '立即领取'
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
				width: 3.2rem;
				height: 3.2rem;
				img {
					display: block;
					width: 100%;
					height: 100%;
				}
			}
			.gift-name {
				margin-top: 0.266667rem;
				text-align: center;
				font-size: 0.426667rem;
				width: 5.466667rem;
				@include ellipsis2();
			}
			.btn {
				@include btn();
			}
		}
		.del {
			@include del();
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