<template>
	<div class="guagua" @touchstart="initPrize" @mousedown="initPrize">
		<canvas ref="canvas" @touchstart="touchStart" @touchmove.stop.prevent="touchMove" @touchend="touchEnd"
		@mousedown="mouseDown" @mousemove="mouseMove" @mouseup="mouseUp"></canvas>
		<div class="target" v-show="prize">
			<img v-if="prize && prize.ID" src="~common/imgs/zhongjiangicon.png" alt="">
			<img v-else src="~common/imgs/weizhongjiangicon.png" alt="">
			<p v-html="lotteryMsg"></p>
		</div>
	</div>
</template>

<script>
	import guaka from 'common/imgs/guaka.png'
	import {getActivityPrize} from 'services/cardActApi'
	import {getElementLeft, getElementTop} from 'common/js/dom'

	export default {
		props: {
			prizeList: {
				type: Array,
				default: []
			},
			txt: {
				type: String
			},
			canPlay: {
				type: Boolean
			}
		},
		data: () => ({ 
			ggbg: null,
			inited: false,
			prizing: false,
			result: '',
			prize: null,
		}),
    computed: {
      lotteryMsg() { // 抽奖结果提示
      	if (!this.prize) return '';
				if (this.prize.ID) { // 中奖
					return `手气不错哦~<br>恭喜您，刮中了${this.prize.Name}`;
				} else { // 未中奖
					return `哎呀，差一点就刮到了<br>换只手指试试~`
				}
			}
    },
    watch: {
    	txt(newVal) {
    		if (newVal) this.fillText()
    	}
    },
    created() {
    	this.aid = this.$route.query.aid
    },
    mounted() {
    	this.onload()
    	this.locate()
    },
		methods: {
			onload() {
				this.ggbg = new Image()
				this.ggbg.src = guaka
				this.ggbg.onload = this.init
			},
			locate() {
				this.touch = {
					cw: this.$refs.canvas.clientWidth * 2,
					ch: this.$refs.canvas.clientHeight * 2,
					canvasLeft: getElementLeft(this.$refs.canvas),
					canvasTop: getElementTop(this.$refs.canvas)
				}
				this.mouse = this.touch
				this.$refs.canvas.width = this.touch.cw
				this.$refs.canvas.height = this.touch.ch
				this.ctx = this.$refs.canvas.getContext('2d')
				this.ctx.lineWidth = 20
				this.ctx.lineJoin = 'round'
			},
			//初始化canvas
			init() {
				if (this.inited) return;
				this.inited = true
				this.$refs.canvas.style.opacity = 1
				this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.clearRect(0,0, this.touch.cw, this.touch.ch);
        this.ctx.drawImage(this.ggbg,0,0, this.touch.cw, this.touch.ch);
        if (this.txt) this.fillText();
        this.ctx.globalCompositeOperation = 'destination-out';
			},
			initPrize() {
				if (!this.canPlay) {
					this.$emit('disable')
					return;
				}
				if (this.prizing) return;
				this.prizing = true
				this.init()
				this.prize = null
        this._getActivityPrize()
			},
			fillText() {
				this.ctx.globalCompositeOperation = 'source-over';
				this.ctx.fillStyle = "#fee123";
        this.ctx.font = "28px Microsoft YaHei ";
        this.ctx.textAlign="center";
        this.ctx.fillText(this.txt,this.touch.cw/2,this.touch.ch/2+65);
        this.ctx.globalCompositeOperation = 'destination-out';
			},
			//请求中奖信息
			_getActivityPrize() {
				getActivityPrize(this.aid).then(res => {
					if (res.return_code === 0 || res.return_code === 30007) {
						let index = -1
						this.prizeList.forEach((n, i) => {
							if (n.ID === res.return_index) {
								index = i
								this.prize = this.prizeList[i]
							}
						})
						this.result = {index, res}
						return;
					} 
					
					this.result = res.return_msg
					if (res.return_code === 30049) {
						this.result = 30049
					}
					if (res.return_code === 30047) {
						this.result = 30047
					}
					this.inited = false
					this.prizing = false
					this.init()
					this.$emit('end', this.result)
				}).catch(error => {
					this.result = '网络连接失败，请刷新<br/>页面'
				})
			},
			touchStart(e) {
				if (!this.canPlay) return;
				this.touch.clear = true
				let x = e.touches[0].pageX - this.touch.canvasLeft
		    let y = e.touches[0].pageY - this.touch.canvasTop 
		    this.ctx.beginPath();
		    this.ctx.arc(x * 2, y * 2, 10, 0, Math.PI * 2, false);
		    this.ctx.fill();
		    this.ctx.beginPath();
		    this.ctx.moveTo(x * 2, y * 2);
			},
			touchMove(e) {
				if (!this.touch.clear) return;
				let x = e.touches[0].pageX - this.touch.canvasLeft
		    let y = e.touches[0].pageY - this.touch.canvasTop 
		    this.ctx.lineTo(x * 2, y * 2)
		    this.ctx.stroke()
			},
			touchEnd() {
				if (!this.inited) return;
				this.touch.clear = false
				this.isGuaEnd()
			},
			mouseDown(e) {
				if (!this.canPlay) return;
				this.mouse.clear = true
				let x = e.pageX - this.mouse.canvasLeft
		    let y = e.pageY - this.mouse.canvasTop 
		    this.ctx.beginPath();
		    this.ctx.arc(x * 2, y * 2, 10, 0, Math.PI * 2, false);
		    this.ctx.fill();
		    this.ctx.beginPath();
		    this.ctx.moveTo(x * 2, y * 2);
			},
			mouseMove(e) {
				if (!this.mouse.clear) return;
				let x = e.pageX - this.mouse.canvasLeft
		    let y = e.pageY - this.mouse.canvasTop 
		    this.ctx.lineTo(x * 2, y * 2)
		    this.ctx.stroke()
			},
			mouseUp() {
				if (!this.inited) return;
				this.mouse.clear = false
				this.isGuaEnd()
			},
			isGuaEnd() {
				let databg = 0
				let data2d = this.ctx.getImageData(0, 0, this.touch.cw, this.touch.ch).data;
				for (let i = 0; i < data2d.length; i += 4) {
					if (data2d[i] && data2d[i + 1] && data2d[i + 2] && data2d[i + 3]) {
						databg++;
					}
				}
				if (databg < this.touch.cw * this.touch.ch * 0.8) {
					this.$refs.canvas.style.opacity = 0
					this.guaEnd()
				}
			},
			guaEnd() {
				this.inited = false
				this.prizing = false
				if (typeof this.result === 'object') {
					if (this.result.res.return_code === 0) {
						this.$emit('end', this.result.index, {productId: this.result.res.return_id, amount: this.result.res.return_amount})
					} else {
						this.$emit('end', this.result.index, {amount: this.result.res.return_amount, msg: this.result.res.return_msg})
					}
					return;
				}
				
			}
		},
		components: {
		
		}
	}
</script>

<style lang="scss" scoped>
.guagua {
	width: 7.04rem;
	height: 3.413333rem;
	margin: 0.453333rem auto 0;
	position: relative;
	overflow: hidden;
	canvas {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
	}
	.target {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 0;
		display: flex;
		align-items: center;
		img {
			width: 1.706667rem;
			height: 1.706667rem;
		}
		p {
	    white-space: nowrap;
	    padding-left: 0.266667rem;
	    color: #7b3333;
	    font-size: 0.426667rem;
	    line-height: 0.64rem;
	    padding-top: 0.213333rem;
		}
	}
}
</style>