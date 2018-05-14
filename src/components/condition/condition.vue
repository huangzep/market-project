<template>
	<transition name="condition">
		<div class="condition" v-show="showFlag" @click="hide">
			<div class="condition-wrapper" @click.stop>
				<div class="condition-content">
					<div class="title">
						<i class="lb"></i>
						<span>兑换条件</span>
						<i class="rb"></i>
					</div>
					<div class="txt-head" v-html="htxt"></div>
					<div class="specific-wrapper" v-show="combineCards.length">
						<ul class="" :style="{'justify-content': (combineCards.length > 2 ? 'space-between' : 'space-around')}">
							<li v-for="item in combineCards">
								<img class="" :src="item.img" alt="" @error="loadImg(item)">
								<span>{{item.num}}</span>
							</li>
						</ul>
					</div>
					<div class="will-wrapper" v-show="!combineCards.length">
						<div class="num"><span>{{totalCard}}</span>张</div>
						<div class="txt">当前拥有卡牌数量</div>
					</div>
					<div class="txt-bottom" v-html="btxt"></div>
					<div class="operate">
						<div @click="cancel" class="operate-btn"
						v-show="hasCancel">{{cancelBtnText}}</div>
						<div @click="confirm" class="operate-btn right">{{confirmBtnText}}</div>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
	
	export default {
		props: {
			prizeName: {
				type: String
			},
			combineCards: {
				type: Array,
				default: []
			},
			totalCard: {
				type: Number,
			},
			needNum: {
				type: Number,
			}
		},
		data: () => ({ 
			showFlag: false,
			ready: false,
			htxt: '集齐以下卡牌，即可兑换',
			btxt: '亲，您已集齐本组合卡牌，可以兑换了哦~',
			confirmBtnText: '确认兑换',
			cancelBtnText: '再想想',
			hasCancel: true
		}),
    computed: {
     
    },
    watch: {
			combineCards(newList) {
				let ready = true
				if (newList.length) {
					this.htxt = `集齐以下卡牌，即可兑换<span style="color: #FED57C; font-weight: 700;">${this.prizeName}</span>`
					newList.forEach(n => {if (!n.num) ready = false})
					if (ready) {
						this.btxt = '亲，您已集齐本组合卡牌，可以兑换了哦~'
						this.hasCancel = true
						this.confirmBtnText = '确认兑换'
					} else {
						this.btxt = '亲，您还没集齐相应的卡牌哦~'
						this.hasCancel = false
						this.confirmBtnText = '继续去抽卡'
					}
					this.ready = ready
					return;
				}
				//数量兑换
				this.htxt = `任意<span style="color: #F84E3D;"> ${this.needNum} </span>张卡牌，即可兑换<span style="color: #FED57C; font-weight: 700;">${this.prizeName}</span>`
				if (this.totalCard >= this.needNum) {
					this.btxt = '亲，您已拥有相应卡牌数量，可以兑换了哦~'
					this.hasCancel = true
					this.confirmBtnText = '去选择卡牌兑换'
				} else {
					this.btxt = '亲，您还没集齐相应的卡牌数量哦~'
					this.hasCancel = false
					this.confirmBtnText = '继续去抽卡'
				}				
				this.ready = (this.totalCard >= this.needNum)	
				return;
			}
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
			cancel() {
				this.hide()
				this.$emit('cancel')
			},
			confirm() {
				this.hide()
				if (!this.combineCards.length && this.ready) {
					this.$emit('choice')
					return;
				}
				if (this.combineCards.length && this.ready) {
					this.$emit('exchange')
					return;
				}				
			},
			loadImg(item) {
				item.img = this.pimg('fate-card.png')
			}		
		},
		components: {
		
		}
	}
</script>

<style lang="scss" scoped>
@import '~common/scss/mixin';
.condition {
	@include cover();
	&.condition-enter-active {
		animation: fadein 0.3s;
		.condition-content {
			animation: inform-zoom 0.3s;
		}
	}
	.condition-wrapper {
		@include wrapper();
		.condition-content {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			width: 8.8rem;
			@include content();
			.title {
				display: flex;
				justify-content: center;
				align-items: center;
				padding-top: 0.48rem;
				.lb {
					width: 1.866667rem;
					height: 1px;
					background-image: linear-gradient(to right,rgba(229,229,229,0) 0%,rgba(229,229,229,1) 70%,rgba(229,229,229,1) 100%);
					position: relative;
					&::before {
						content: '';
				    width: 6px;
				    height: 6px;
				    background: #ffc853;
				    transform: rotate(45deg);
				    position: absolute;
				    right: 0;
				    top: -3px;
					}
				}
				.rb {
					width: 1.866667rem;
					height: 1px;
					background-image: linear-gradient(to right,rgba(229,229,229,1) 0%,rgba(229,229,229,1) 30%,rgba(229,229,229,0) 100%);
					position: relative;
					&::before {
						content: '';
				    width: 6px;
				    height: 6px;
				    background: #ffc853;
				    transform: rotate(45deg);
				    position: absolute;
				    left: 0;
				    top: -3px;
					}
				}
				span {
					font-size: 0.426667rem;
					color: #ff9409;
					font-weight: 700;
					white-space: nowrap;
					margin: 0 0.266667rem;
				}
			}
			.txt-head {
				padding-top: 0.533333rem;
				padding-left: 0.453333rem;
				padding-right: 0.453333rem;
				color: #333;
				font-size: 0.373333rem;
				line-height: 0.586667rem;
			}
			.txt-bottom {
				color: #666;
			}
			.specific-wrapper	{
				width: 100%;
				padding-top: 0.213333rem;
				padding-bottom: 0.613333rem;
				ul {
					display: flex;
					justify-content: space-between;
					padding: 0 0.986667rem;
					flex-wrap: wrap;
					max-height: 4.986667rem;
					overflow-y: auto;
					padding-left: 0.986667rem;
					padding-right: 0.533333rem;
					margin-right: 0.453333rem;
					li {
						width: 1.173333rem;
						height: 1.546667rem;
						position: relative;
						margin-top: 22px;
						img {
							display: block;
							width: 100%;
							height: 100%;
							border-radius: 6px;
						}
						span {
							position: absolute;
							top: 0;
							right: -4px;
							transform: translate(10%, -50%);
							width: 0.48rem;
							height: 0.48rem;
							line-height: 0.46rem;
							border-radius: 50%;
							background-color: #E3403D;
							color: #fff;
							text-align: center;
							font-size: 0.32rem;
							border: 1px solid #fff;
						}	
					}
				}
			}
			.will-wrapper {
				padding-top: 0.533333rem;
				padding-bottom: 0.933333rem;
				width: 100%;
				text-align: center;
				.num {
					width: 2.506667rem;
					height: 2.506667rem;
					border: 1px dashed #F84E3D;
					padding-top: 0.586667rem;
					color: #F84E3D;
					text-align: center;
					margin: 0 auto;
					font-family:Helvetica;
					span {
						font-size: 0.933333rem;
					}
				}
				.txt {
					padding-top: 0.293333rem;
				}
			}
			.operate {
				display: flex;
				align-items: center;
				text-align: center;
				color: #646464;
				font-size: 0.4rem;
				margin-top: 0.533333rem;
				margin-bottom: 0.666667rem;
				.operate-btn {
					width: 3.466667rem;
					line-height: 0.933333rem;
					border: 1px solid #F84D40;
					color: #F84D40;
					border-radius: 8px;
					margin-right: 0.586667rem;
					&.right {
						color: #fff;
						background-color: #F84D40;
						margin-right: 0;
					}
				}
			}
		}
	}
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  border-radius: 10px;
  background-color: #EEEEEE;
}
::-webkit-scrollbar {
  width: 5px;
  height: 8px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.5);
  background-clip: padding-box;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
  min-height: 8px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
}
</style>