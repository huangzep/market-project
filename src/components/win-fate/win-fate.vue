<template>
	<transition name="fate" 
	@leave="leave"  @after-leave="afterLeave">
		<div class="win-fate" ref="winFate" v-show="showFlag" @touchmove.prevent>
			<div class="fate-wrapper" @click.stop>
				<div class="fate-content" ref="content">
					<div class="top">
						<img :src="pimg('fate-head.png')" alt="">
						<div class="modal"></div>
						<span @click="hide"></span>
					</div>
					<div class="middle">
						<img :src="cardImg" alt="">
						<span v-html="cardTxt"></span>
					</div>
					<div class="bottom" @click="confirm">{{ready ? '立即兑换' : '确定'}}</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
	
	export default {
		props: {
			cardImg: {
				type: String
			},
			cardTxt: {
				type: String
			},
			ready: {
				type: Boolean
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
			show(cx, cy, isScroll) {
				this.showFlag = true
				this.cx = cx
				this.cy = cy
				this.isScroll = isScroll
				this.canHide = false
				setTimeout(() => {this.canHide = true}, 1000)
			},
			hide() {
				if (!this.canHide) return;
				this.showFlag = false
			},
			leave(el, done) {
				this.$refs.content.style.transition = 'all 0.5s'
        this.$refs.content.style['transform'] = `translate3d(${this.cx}px, ${this.cy}px, 0) scale(0)`
        this.$refs.content.addEventListener('transitionend', done)
        if (this.isScroll) this.$emit('destinate', this.cy)
			},
			afterLeave() {
				this.$refs.content.style.transition = ''
        this.$refs.content.style['transform'] = ''
			},
			confirm() {
				this.hide()
				if (this.ready) {
					this.isScroll = false
					this.$emit('toEx')
				}
			}
		},
		components: {
		
		}
	}
</script>

<style lang="scss" scoped>
@import '~common/scss/mixin';
.win-fate {
	@include cover();
	&.fate-enter-active {
		animation: fadein 1s;
		.fate-content {
			animation: gift-zoom 1s
		}
	}
	.fate-wrapper {
		@include wrapper();
		.fate-content {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 9.04rem;
			.top {
				width: 100%;
				height: 3.6rem;
				position: relative;
				img {
					display: block;
					width: 100%;
					height: 100%;
				}
				.modal {
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					opacity: 0;
				}
				span {
					position: absolute;
					top: 1.76rem;
					right: 0.96rem;
					width: 0.693333rem;
					height: 0.693333rem;
					background: url(~common/imgs/fate-cha.png) no-repeat 0 0 / 90%;
				}
			}
			.middle {
				width: 5.92rem;
				height: 7.04rem;
				background-color: #fff;
				margin: -1.066667rem 0 0 0.213333rem;
				display: flex;
				flex-direction: column;
				align-items: center;		
				border-radius: 0 0 0.266667rem 0.266667rem;		
				img {
					display: block;
					width: 2.666667rem;
					height: 3.466667rem;
					margin-top: 1.226667rem;
					border-radius: 8px;
				}
				span {
					font-size: 0.4rem;
					line-height: 0.666667rem;
					color: #333;
					text-align: center;
					padding: 0.266667rem 0.533333rem 0;
				}
			}
			.bottom {
				width: 4.0rem;
				line-height: 0.933333rem;
				background-color: #F84D40;
				font-size: 0.453333rem;
				color: #fff;
				text-align: center;
				margin: 0.453333rem 0 0 0.213333rem;
				border-radius: 0.746667rem;
			}
			.bg {
				@include bg();
			}
		}
		.del {
			@include del();
		}
	}
}

@keyframes fate-zoom {
  0% {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(45deg);
  }
}
</style>