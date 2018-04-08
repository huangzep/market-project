<template>
	<transition name="confirm">
		<div class="confirm" v-show="showFlag" @click="hide">
			<div class="confirm-wrapper" @click.stop>
				<div class="confirm-content">
					<div class="text" v-html="text"></div>
					<div class="operate">
						<div @click="cancel" class="operate-btn"
						v-show="hasCancel">{{cancelBtnText}}</div>
						<div @click="confirm" class="operate-btn right">{{confirmBtnText}}</div>
					</div>
					<div class="close" @click.stop="hide"></div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
	
	export default {
		props: {
			text: {
				type: String,
				default: ''
			},
			confirmBtnText: {
				type: String,
				default: '确认'
			},
			cancelBtnText: {
				type: String,
				default: '取消'
			},
			hasCancel: {
				type: Boolean,
				default: false
			}
		},
		data: () => ({ 
			showFlag: false
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
				this.$emit('hide')
			},
			cancel() {
				this.hide()
				this.$emit('cancel')
			},
			confirm() {
				this.hide()
				this.$emit('confirm')
			}
		},
		components: {
		
		}
	}
</script>

<style lang="scss">
@import '~common/scss/mixin';
.confirm {
	@include cover();
	&.confirm-enter-active {
		animation: fadein 0.3s;
		.confirm-content {
			animation: confirm-zoom 0.3s;
		}
	}
	.confirm-wrapper {
		@include wrapper();
		.confirm-content {
			width: 7.093333rem;
			@include content();
			position: relative;
			.text {
				padding: 0.48rem;
				line-height: 0.746667rem;
				color: #2a2a2a;
				font-size: 0.426667rem;
				text-align: center;
			}
			.operate {
				display: flex;
				align-items: center;
				text-align: center;
				color: #646464;
				font-size: 0.4rem;
				.operate-btn {
					flex: 1;
					line-height: 1.333333rem;
					border-top: 1px solid #EBEBEB;
					&.right {
						border-left: 1px solid #EBEBEB;
						color: #dd2726;
					}
				}
			}
			.close {
				position: absolute;
				width: 0.613333rem;
				height: 0.613333rem;
				background: url(~common/imgs/close.png) no-repeat center center / 100%;
				text-align: center;
				top: -0.88rem;
				right: -0.613333rem;
			}
		}
	}
}

/* 刮刮卡奖品框样式 */
.card-prize-confirm {
	.pname {
		font-size: 0.426667rem;
	}
	.pt {
		padding-top: 0.426667rem;
		font-size: 0.346667rem;
		line-height: 0.613333rem;
		text-align: left;
	}
	.pcon {
		margin-top: 0.266667rem;
		display: flex;
		position: relative;
		font-size: 0.346667rem;
		line-height: 0.48rem;
		img {
			width: 1.6rem;
			height: 1.6rem;
			margin-left: 0.266667rem;
		}
		p {
			flex: 1;
			margin-left: 0.266667rem;
			margin-top: 0.106667rem;
			text-align: left;
			height: 0.96rem;
			color: #333;
			@include ellipsis2();
		}
		span {
			position: absolute;
			left: 2.133333rem;
			bottom: 0;
		}
	}
	.ptip {
		margin-top: 0.266667rem;
		color: #999;
		line-height: 0.613333rem;
		text-align: left;
		span {color: red;}
	}
}
</style>