<template>
	<div ref="wrapper">
		<slot></slot>
		<div ref="pulldown" class="pulldown-wrapper" :style="pullDownStyle" v-if="pullDownRefresh">
      <div class="before-trigger" v-if="beforePullDown">
        <i class="iconfont icon-xiafan"
        	:style="{'transform': bubbleY > 0 ? 'rotate(-180deg)' : ''}"></i>
				<p>释放刷新</p>
      </div>
      <div class="after-trigger" v-if="!beforePullDown && (pulldown === 'stop')">
        <div v-if="isPullingDown" class="loading">
          <div class="loadgif">
						<img src="~common/imgs/loading.gif" width="22" height="22">
						<span class="desc">刷新中，请稍后...</span>
					</div>
        </div>
        <div v-else>
        	{{update ? '刷新成功' : '刷新失败'}}
        </div>
      </div>
    </div>
	</div>
</template>

<script>
	import BScroll from 'better-scroll'

	export default {
		props: {
			probeType: {
				type: Number,
				default: 1
			},
			click: {
				type: Boolean,
				default: true
			},
			data: {
				type: Array,
				default: null
			},
			listenScroll: {
				type: Boolean,
				default: true
			}, 
			listenTouch: {
				type: Boolean,
				default: false
			}, 
			pullup: {
				default: false
			},
			pulldown: {
				default: false
			},
			beforeScroll: {
				type: Boolean,
				default: false
			},
			refreshDelay: {
				type: Number,
				default: 200
			},
			update: {
				type: Boolean,
				default: true
			}		
		},
		data() {
      return {
        beforePullDown: true,
        isRebounding: false,
        isPullingDown: false,
        isPullUpLoad: false,
        pullUpDirty: true,
        pullDownStyle: '',
        bubbleY: 0
      }
    },
		created() {
			this.pullDownInitTop = -50
			this.pullDownRefresh = this.pulldown ? {
				threshold: 50, // 当下拉到超过顶部 50px 时，触发 pullingDown 事件
				stop: 50, // 刷新数据的过程中，回弹停留在距离顶部还有 50px 的位置
				stopTime: 1000
			} : false
			this.pullUpLoad = this.pullup ? {
				threshold: -20 // 在上拉到超过底部 20px 时，触发 pullingUp 事件
			} : false
		},
		mounted() {
			setTimeout(() => {
				this._initScroll()
			}, 20)
		},
		methods: {
			_initScroll() {
				if (!this.$refs.wrapper) {
					return 
				}
				let options = {
          probeType: this.probeType,
          click: this.click,
          pullDownRefresh: this.pullDownRefresh,
          pullUpLoad: this.pullUpLoad,
        }

        this.scroll = new BScroll(this.$refs.wrapper, options)
				
				if (this.listenScroll) {
					let me = this
					this.scroll.on('scroll', (pos) => {
						me.$emit('scroll', pos)
					})
				}
				if (this.pullup) {
					this.scroll.on('scrollEnd', () => {
						if (this.scroll.y <= (this.scroll.maxScrollY + 50) ) {
							this.$emit('scrollToEnd')
						}
					})
				}
				if (this.pulldown) {
					this.scroll.on('scroll', () => {
						if (this.scroll.y >= 50) {
							this.$emit('scrollToTop')
						}
					})
				}
				if (this.beforeScroll) {
					this.scroll.on('beforeScrollStart', () => {
						this.$emit('beforeScroll')
					})
				}
				if (this.pullDownRefresh) {
          this._initPullDownRefresh()
        }
				if (this.pullUpLoad) {
          this._initPullUpLoad()
        }
			},
			disable() {
				this.scroll && this.scroll.disable()
			},
			enable() {
				this.scroll && this.scroll.enable()
			},
			refresh() {
				this.scroll && this.scroll.refresh()
			},
			scrollTo() {
				this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
			},
			scrollToElement() {
				this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
			},
			finishPullDown() {
				this.scroll && this.scroll.finishPullDown()
			},
			finishPullUp() {
				this.scroll && this.scroll.finishPullUp()
			},
			forceUpdate(dirty) {
        if (this.pullDownRefresh && this.isPullingDown) {
          setTimeout(() => {
						this.isPullingDown = false
          }, 400)
          this._reboundPullDown().then(() => {
            this._afterPullDown()
          })
        } else if (this.pullUpLoad && this.isPullUpLoad) {
          this.isPullUpLoad = false
          this.scroll.finishPullUp()
          this.pullUpDirty = dirty
          this.refresh()
        } else {
          this.refresh()
        }
      },
			_initPullDownRefresh() {
        this.scroll.on('pullingDown', () => {
          this.beforePullDown = false
          this.isPullingDown = true
          this.$emit('pullingDown')
        })

        this.scroll.on('scroll', (pos) => {
          if (this.beforePullDown) {
            this.bubbleY = Math.max(0, pos.y + this.pullDownInitTop)
            this.pullDownStyle = `top:${Math.min(pos.y + this.pullDownInitTop, 10)}px`
          } else {
            this.bubbleY = 0
          }

          if (this.isRebounding) {
            this.pullDownStyle = `top:${10 - (this.pullDownRefresh.stop - pos.y)}px`
          }
        })
      },
      _initPullUpLoad() {
        this.scroll.on('pullingUp', () => {
          this.isPullUpLoad = true
          this.$emit('pullingUp')
        })
      },
      _reboundPullDown() {
        const {stopTime = 600} = this.pullDownRefresh
        return new Promise((resolve) => {
          setTimeout(() => {
            this.isRebounding = true
            this.scroll.finishPullDown()
            resolve()
          }, stopTime)
        })
      },
      _afterPullDown() {
        setTimeout(() => {
          this.pullDownStyle = `top:${this.pullDownInitTop}px`
          this.beforePullDown = true
          this.isRebounding = false
          this.refresh()
        }, this.scroll.options.bounceTime)
      }
		},
		watch: {
			data() {
				setTimeout(() => {
					this.forceUpdate(true)
				}, this.refreshDelay)
			}
		},
		components: {
			
		}
	}
</script>

<style scoped lang="scss">
.pulldown-wrapper {
  position: absolute;
  width: 100%;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all;
  font-size: 14px;
  top: -1000px;
  .before-trigger {
  	display: flex;
  	justify-content: center;
  	align-items: center;
  	color: pink;
  	i {
  		transition: all .5s;
			margin-right: 4px;
			font-size: 14px;
			padding-bottom: 0px;
  	}
  }
  .after-trigger {
  	.loadgif {
	    width: 100%;
	    display: flex;
	    justify-content: center;
	    align-items: center;
	    .desc {
	      line-height: 20px;
	      font-size: 14px;
	      padding-top: 6px;
	      padding-left: 4px;
	    }
	  }
  }
}
.pullup-wrapper {
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 16px 0;
}
//下拉刷新按钮颜色
.vote, .vother, .activity {
	.before-trigger {
		color: #ccc;
	}
}
.fate {
	.before-trigger {
		color: #666;
	}
}
    
</style>