<template>
	<div class="roll">
		<ul ref="roll" v-if="messageList.length">
			<li v-for="item in messageList">
				<img :src="item.HeadImg" alt="">
	    	<p><span>{{item.CustomerNickName}}</span>{{item.Text}}</p>
			</li>
			<li v-for="item in messageList" v-show="messageList.length >= 4">
				<img :src="item.HeadImg" alt="">
	    	<p><span>{{item.CustomerNickName}}</span>{{item.Text}}</p>
			</li>
		</ul>
		<div class="no-roll" v-show="!messageList.length">
			<img src="~common/imgs/face.png" alt="">
			<p>当前还没有人中奖哦~</p>
		</div>
	</div>
</template>

<script>
	import {prefixStyle} from 'common/js/dom'

	const transition = prefixStyle('transition')
	
	export default {
		props: {
			messageList: {
				type: Array,
				default: []
			}
		},
		data: () => ({ 
			timer: null,
			// messageList: [{CustomerNickName: 'Groot', Text: '抽中了朵朵优惠价（威风）（10元购物劵）'}]
		}),
    computed: {
     
    },
    watch: {
    	messageList(val) {
    		if (val.length) {
    			this.$nextTick(() => {
    				this.moveUp()
    			})
    		}
    	}
    },
    created() {
    },
    mounted() {
    	this.messageList.length && this.moveUp()
    },
		methods: {
			moveUp() {
				if (this.messageList.length < 4) return;
				clearInterval(this.timer)
				let now = 0
				let end = this.messageList.length
				let li_h = this.$refs.roll.children[0] && this.$refs.roll.children[0].clientHeight
				this.timer = setInterval(() => {
					if (now < end) {
						this.$refs.roll.style[transition] = "top 400ms"
						now++;
						this.$refs.roll.style.top = (-now * li_h) + "px"
					}
				}, 3000)
				this.$refs.roll.addEventListener('webkitTransitionEnd', () => {
          if (now == end) {
            this.$refs.roll.style[transition] = "top 0s";
            this.$refs.roll.style.top = "0px"
            now = 0;
          }
        }, false)
			}
		},
		components: {
		
		}
	}
</script>

<style lang="scss" scoped>
@import '~common/scss/mixin';
.roll {
	ul {
		position: relative;
		li {
			height: 1.733333rem;
			margin: 0 auto;
			position: relative;
			display: flex;
			align-items: center;
			img {
				margin: 0 0.266667rem 0 0.133333rem;
				width: 1.12rem;
				min-width: 1.12rem;
				height: 1.12rem;
			}
			p {
				flex: 1;
				font-size: 0.346667rem;
				@include ellipsis2();
				span {}
			}
			&::after {
				content: '';
				position: absolute;
				left: 0;
				bottom: 1px;
				width: 100%;
				height: 0;
		    transform: scale(1,0.5);
		    border-bottom-width: 1px;
		    border-bottom-style: dashed;
			}
		}
	}
	.no-roll {
		img {
			display: block;
			margin: 0 auto;
			padding-top: 1.6rem;
			width: 1.173333rem;
		}
		p {
			text-align: center;
			padding-top: 0.266667rem;
			line-height: 0.746667rem;
			font-size: 0.346667rem;
		}
	}
}

.table {
	.no-roll {
		p {color: #fff;}
	}
}


.table.m-red {
	.roll {
		li {
			p {
				color: #fff;
				span {color: #fbd439}
			}
			&::after {
		    border-bottom-color: #e8a4a3;
			}
		}
	}
}

.table.m-pink {
	.roll {
		li {
			p {
				color: #fff;
				span {color: #fbd439}
			}
			&::after {
		    border-bottom-color: #e8a4a3;
			}
		}
	}
}

.table.m-yello {
	.roll {
		li {
			&::after {
		    border-bottom-color: #006b21;
			}
		}
	}
}
</style>