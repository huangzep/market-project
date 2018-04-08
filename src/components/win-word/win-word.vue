<template>
	<transition name="word">
		<div class="win-word" v-show="showFlag" @click="hide" @touchmove.prevent>
			<div class="word-wrapper" @click.stop>
				<div class="word-content">
					<div class="g2"></div>
					<div class="g1"></div>
					<div class="g3"></div>
					<div class="g4"></div>
					<div class="g6"></div>
					<div class="bg">
						<div class="bgc"></div>
					</div>
					<div class="g5"></div>
					<div class="top">恭喜您获得</div>
					<div class="word-container">
						<div class="wbg">
							<div class="wbgc"></div>
						</div>
						<div class="word-name">
							{{keyWord}}
						</div>
					</div>
					<p class="word-txt" v-html="text"></p>
					<div class="btn" @click="confirm">{{lack > 0 ? '确定' : '立即兑换'}}</div>
				</div>
				<div class="del" @click="hide"></div>
			</div>
		</div>
	</transition>
</template>

<script>
	
	export default {
		props: {
			keyWord: {
				type: String,
				default: ''
			},
			lack: {
				type: Number
			}
		},
		data: () => ({ 
			showFlag: false, 
		}),
    computed: {
     text() {
     	if (this.lack > 0) {
     		return `还差&nbsp;<span style="color:red;">${this.lack}</span>&nbsp;种字即可兑换奖品`
     	} else {
     		return `恭喜您集满所有字了<br/>快去兑换奖品吧`
     	}
     }
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
			confirm() {
				this.hide()
				if (!this.lack) this.$emit('goPrize')
			}
		},
		components: {
		
		}
	}
</script>

<style lang="scss" scoped>
@import '~common/scss/mixin';
.win-word {
	@include cover();
	&.word-enter-active {
		animation: fadein 1s;
		.word-content {
			animation: word-zoom 1s;
		}
	}
	&.word-leave-active {
		animation: .5s;
		.word-content {
			transition: all .5s;
			transform-origin: 100% 0;
		}
	}
	&.word-leave-to {
		.word-content {
			transform: scale(0);
		}
	}
	.word-wrapper {
		@include wrapper();
		.word-content {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 6.933333rem;
			position: relative;
			.g1 {
				position: absolute;
				width: 2.933333rem;
				height: 2.0rem;
				background: url(~common/imgs/h1.png) no-repeat center center /100%;
				top: 0;
				left: 50%;
				transform: translate(-50%, -100%);
			}
			.g2 {
				position: absolute;
				width: 7.066667rem;
				height: 2.32rem;
				background: url(~common/imgs/h2.png) no-repeat center center /100%;
				top: 0;
				left: 50%;
				transform: translate(-50%, -100%);
			}
			.g3 {
				position: absolute;
				width: 2.133333rem;
				height: 1.52rem;
				background: url(~common/imgs/h3.png) no-repeat center center /100%;
				right: -0.266667rem;
				bottom: -0.213333rem;
			}
			.g4 {
				position: absolute;
				width: 0.533333rem;
				height: 0.533333rem;
				background: url(~common/imgs/h4.png) no-repeat center center /100%;
				top: 0;
				left: 0;
				transform: translate(-50%, 150%);
			}
			.g5 {
				position: absolute;
				width: 4.133333rem;
				height: 3.2rem;
				background: url(~common/imgs/h5.png) no-repeat center center /100%;
				top: 1.333333rem;
				left: 50%;
				transform: translate(-50%, 0);
				z-index: -1;
			}
			.g6 {
				position: absolute;
				width: 4.453333rem;
				height: 4.453333rem;
				background: url(~common/imgs/h6.png) no-repeat center center /100%;
				top: -1.706667rem;
				left: 1.6rem;
				z-index: -1;
			}
			.bg {
				@include bg();
			}
			.top {
				font-size: 0.533333rem;
				font-weight: 700;
				color: #333;
				line-height: 1;
				margin: 0.533333rem 0 0.666667rem;
			}
			.word-container {
				position: relative;	
				width: 2.826667rem;
				height: 2.826667rem;
				.wbg {
					@include bg();
				}
				.word-name {
					font-size: 1.333333rem;
					line-height: 2.613333rem;
					font-weight: 700;
					color: #df3645;
					text-align: center;
				}
			}
			.word-txt {
				margin-top: 0.266667rem;
				text-align: center;
				font-size: 0.453333rem;
				line-height: 0.613333rem;
				color: #333;
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
	.win-word {
		.word-wrapper {
			.word-content {
				.g1 {
					display: none;
					background: none;
				}
				.g2 {
					width: 7.066667rem;
					background: url(~common/imgs/mb_6.png) no-repeat center center /100%;
					top: 0.613333rem;
				}
				.g3 {
					background: url(~common/imgs/mb_5.png) no-repeat center center /100%;
				}
				.g4 {
					background: url(~common/imgs/mb_4.png) no-repeat center center /100%;
				}
				.g5 {
					background: url(~common/imgs/mb_9.png) no-repeat center center /100%;
					top: 1.466667rem;
					left: 52%;
				}
				.g6 {
				}
				.bg {
					background: linear-gradient(#fda13e, #ffeb3f);
				}
				.top {
					margin: 0 0 0.933333rem;
					font-weight: normal;
					z-index: 1;
				}
				.word-container {
					.wbg {
						background: linear-gradient(#fda13e, #ffeb3f);
					}
					.word-name {
					}
				}
				.word-txt {
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