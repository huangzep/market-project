<template>
	<div class="verify" ref="verify" :class="color">
		<div class="bg">{{txt}}</div>
		<div class="progress" ref="progress"></div>
		<div class="destination" ref="des"></div>
		<div class="slider" ref="slider" 
		@touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd"
		@mousedown="touchStart" @mousemove="touchMove" @mouseup="touchEnd">
			<span class="icon"></span>
		</div>
	</div>
</template>

<script>
	
	export default {
		data: () => ({ 
			color: '',
			txt: '向右滑动滑块填充阴影',
			percent: 0
		}),
    computed: {
     
    },
    watch: {
    	percent(val) {
    		console.log(val)
    		if (val < 0) val = 0;
    		if (val > 1) val = 1;
    		let left = val * this.allWidth.remainWidth
    		this.$refs.slider.style.left = left + 'px'
    		this.$refs.progress.style.width = (left ? (left + this.allWidth.sliderWidth / 2) : 0) + 'px'
    	}
    },
    created() {

    },
    mounted() {
    	this.allWidth = {
    		totalWidth: this.$refs.verify.clientWidth,
    		sliderWidth: this.$refs.slider.offsetWidth,
    		remainWidth: (this.$refs.verify.clientWidth - this.$refs.slider.offsetWidth)
    	}
    	setTimeout(() => {
    		this.confirmPos()
    	}, 1000)
    },
		methods: {
			confirmPos() {
				this.txt = '向右滑动滑块填充阴影'
				this.pos = (0.2 + 0.8 * Math.random()).toFixed(2)
				this.$refs.des.style.left = this.pos * (this.allWidth.remainWidth) + 'px'
			},
			touchStart(e) {
				if (this.color === 'green') return;
				this.txt = ''
				this.color = 'blue'
				this.touch = {
					initialX: e.touches ? e.touches[0].pageX : e.pageX
				}
			},
			touchMove(e) {
				if (this.color !== 'blue') return;
				this.touch.finalX = e.touches ? e.touches[0].pageX : e.pageX
				this.percent = ((this.touch.finalX - this.touch.initialX) / this.allWidth.remainWidth).toFixed(2)
			},
			touchEnd() {
				if (this.judge()) {
					//验证成功
					this.color = 'green'
					this.percent = this.pos
					setTimeout(() => {this.$emit('success')}, 500)
				} else {
					//验证失败
					this.color = 'red'
					this.back()
				}
			},
			judge() {
				if (Math.abs(this.percent - this.pos) < 0.03) return true;
				return false;
			},
			back() {
				setTimeout(() => {
					this.color = ''
					let current, step;
					this.timer = setInterval(() => {
						current = this.percent * 100
						step = Math.ceil(current / 10)
						this.percent = (current - step) / 100
						if (Math.abs(this.percent) < Math.pow(10, -4)) {
							this.percent = 0
							clearInterval(this.timer)
							this.confirmPos()
						}
					}, 17)				
				}, 200)
			}
		},
		components: {
		
		}
	}
</script>

<style lang="scss" scoped>
.verify {
	position: relative;
  width: 8.0rem;
  height: 1.2rem;
	.bg {
		line-height: 1.2rem;
		height: 1.2rem;
		text-align: center;
    color: #fff;
    font-size: 14px;
    background-image: url(~common/imgs/verify-bg.png);
    background-size: 100%;
	}
	.progress {
		box-sizing: content-box;
		position: absolute;
    top: 0px;
    left: 0px;
		width: 0;
		height: 100%;
		background-image: url(~common/imgs/verify-bgy.png);
    background-size: 8.0rem;
	}
	.destination {
		position: absolute;
    top: 0.053333rem;
    left: 0px;
    width: 1.093333rem;
    height: 1.093333rem;
    background-image: url(~common/imgs/verify-shadow.png);
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center center;
	}
	.slider {
		position: absolute;
    top: -0.04rem;
    left: 0px;
    width: 1.28rem;
    height: 1.28rem;
    cursor: pointer;
    transition: background .2s linear;
    .icon	{
	    position: absolute;
	    top: 0;
	    left: 0;
	    width: 100%;
	    height: 100%;
	    background-image: url(~common/imgs/verify-arrow.png);
	    background-size: 100%;
    }
	}
}
.verify.blue {
	.slider {
    .icon	{
	    background-image: url(~common/imgs/verify-arrow.png);
    }
	}
}
.verify.green {
	.slider {
    .icon	{
	    background-image: url(~common/imgs/verify-yes.png);
    }
	}
}
.verify.red {
	.slider {
    .icon	{
	    background-image: url(~common/imgs/verify-no.png);
    }
	}
}
</style>