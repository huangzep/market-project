<template>
	<div class="turn-table">
	<div class="wrapper" ref="wrapper">
			<!-- <img class="pan" :src="pimg('zpbg.png')" alt=""> -->
			<div class="pan"></div>
			<ul class="gift-container">
				<li v-for="(item, index) in prizeList" :style="{'transform': `rotate(${index * 360 / prizeList.length}deg)`}">
					<span>{{item.Name}}</span>
					<img :src="item.AwardPicture" alt="">
					<i :style="{'transform': `rotate(${180 / prizeList.length}deg)`}"></i>
				</li>
			</ul>
		</div>
		<ul class="light">
			<li v-for="(item, index) in dots" :style="{'transform': `rotate(${index * 360 / dots.length}deg)`}"></li>
		</ul>
		<div class="gobtn" :class="{off:!go}" @click="play" v-light>
			<!-- <img v-if="go" src="~common/imgs/go.png" alt="">
			<img v-else src="~common/imgs/go1.png" alt=""> -->
		</div>
	</div>
</template>

<script>
	import rotation from 'common/js/rotate'
	import {getActivityPrize} from 'services/cardActApi'

	export default {
		props: {
			prizeList: {
				type: Array,
				default: null
			},
			go: {
				type: Boolean,
				default: true
			}
		},
		data: () => ({ 
			dots: new Array(24),
			emit: null
		}),
    computed: {
     
    },
    watch: {

    },
    created() {
    	this.aid = this.$route.query.aid
    },
    mounted() {

    },
		methods: {
			play() {
				if (!this.go) {
					this.$emit('disable')
					return;
				}
				if (this.playing) return;
				this.playing = true
				rotation.rotate(this.$refs.wrapper, 1, -360)
				this._getActivityPrize()
			},
			_getActivityPrize() {
				getActivityPrize(this.aid).then(res => {
					if (res.return_code === 0 || res.return_code === 30007) {
						let index = -1
						this.prizeList.forEach((n, i) => {
							if (n.ID == res.return_index) index = i
						})
						if (index > -1) {
							rotation.rotate(this.$refs.wrapper, 0, (-index * 360 / this.prizeList.length), this.done.bind(this, index, res))
						}
						return;
					} 
					//未能成功抽奖
					this.emit = res.return_msg
					if (res.return_code === 30049) {
						this.emit = 30049
					}
					if (res.return_code === 30047) {
						this.emit = 30047
					}
					if (res.return_code === 30061) {
						this.emit = 30061
					}
					this.$emit('end', this.emit, res.return_msg)
					rotation.rotate(this.$refs.wrapper, 0, -360 * 4, this.done.bind(this, -1), 4000)
				}).catch(error => {
					this.playing = false
					this.$vux.toast.text('网络连接失败，请稍后<br/>重试')
				})
			},
			done(pix, res) {
			  this.playing = false
			  if (pix === -1) {
			  	return;
			  }
			  if (res.return_code === 0) {
			  	this.$emit('done', pix, {productId: res.return_id, amount: res.return_amount})
			  	return;
			  }
			  if (res.return_code === 30007) {
		  		this.$emit('done', pix, {amount: res.return_amount, msg: res.return_msg})
		  		return;
			  }
			}
		},
		components: {
		
		}
	}
</script>

<style lang="scss" scoped>
.turn-table {
	position: relative;
	z-index: 0;
	margin: 0 0.4rem;
	.wrapper {
		max-width: 9.221333rem;
		margin: 0 auto;
		.pan {
			position: absolute;
			width: 9.221333rem;
			height: 9.221333rem;
			z-index: -1;
			background-repeat: no-repeat;
			background-size: 100% auto;
			background-image: url(/static/images/zpbg.png);
		}
		.gift-container {
			position: relative;
			width: 9.221333rem;
			height: 9.221333rem;
			li {
				position: absolute;
				top: 0;
				left: 50%;
				margin-left: -1.2rem;
				width: 2.426667rem;
				height: 4.613333rem;
				display: flex;
				align-items: center;
				flex-direction: column;
				transform-origin: center bottom;
				span {
					padding-top: 0.853333rem;
					font-weight: bold;
					line-height: 0.533333rem;
					font-size: 0.346667rem;
					color: #c97e4a;
				}
				img {
					display: block;
					width: 0.72rem;
					max-height: 1.333333rem;
					margin-top: 0.266667rem;
				}
				i {
					position: absolute;
					width: 2px;
					top: 0.613333rem;
					left: 50%;
					bottom: 0;
					margin-left: -1px;
					background: -webkit-gradient(linear, 0 0, 0 bottom, from(#f0d7c9), to(#f7e1d5));
					transform-origin: center bottom;
				}
			}
		}
	}
	.light {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		li {
			position: absolute;
			top: 0.213369rem;
			left: 50%;
			margin-left: -0.114109rem;
			width: 0.228219rem;
			height:0.228219rem;
			transform-origin: center 4.4rem;
			&::after {
				content: '';
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				width: 0.16rem;
				height: 0.16rem;
				border-radius: 100px;
				box-shadow: 0 0 10px #fff;
				background-color: #fff;
			}
			&:nth-of-type(odd) {
				&::after {
					animation: lightAnimate 1s  steps(1)  infinite;
				}
			}
			&:nth-of-type(even) {
				&::after {
					animation: lightAnimate 1s  steps(1)  infinite 0.5s;
				}
			}
		}
	}
	.gobtn {
		position: absolute;
		top: 46%;
		left: 50%;
		// transform: translate(-50%, -50%);
		margin-left: -1.226667rem;
		margin-top: -1.44rem;
		width: 2.453333rem;
		height: 3rem;
		background-repeat: no-repeat;
		background-size: 100% auto;
		background-image: url(~common/imgs/go.png);
		img {
			display: block;
			width: 100%;
			height: 100%;
		}
	}
	.gobtn.off{
		background-image: url(~common/imgs/go1.png);
	}
}

@keyframes lightAnimate
{
  0% {
  	width: 0.16rem;height: 0.16rem;
  	background: #fff;box-shadow: 0 0 10px #fff;
  }
  50% {
  	width: 0.213333rem;height: 0.213333rem;
  	background: #feee99;box-shadow: 0 0 10px #feee99;
  }
  100% {
  	width: 0.16rem;height: 0.16rem;
  	background: #fff;box-shadow: 0 0 10px #fff;
  }
}
</style>