<template>
	<div class="slider" ref="slider">
		<ul class="word-list" ref="words">
			<li class="" v-for="item in wordList"
			:class="{'on': item.Count}">
				<div class="content">
					<span class="s1"></span>
					{{item.Name}}
					<span class="s2"></span>
				</div>
				<div class="num">{{item.Count}}</div>
			</li>
		</ul>
	</div>	
</template>

<script>
	import BScroll from 'better-scroll'

	export default {
		props: {
			wordList: {
				type: Array,
				default: null
			}
		},
		data: () => ({ 
		}),
    computed: {
     
    },
    watch: {

    },
    created() {

    },
    mounted() {
    	setTimeout(() => {
    		this._setSliderWidth()
    		this._initSlider()
    	}, 20)
    },
		methods: {
			_setSliderWidth() {
				let width = 0
				let itemWidth = this.$refs.words.children[0].clientWidth
				let length = this.$refs.words.children.length
				width = Math.max(((itemWidth + 10) * length), (window.innerWidth - 30))
				if (width === window.innerWidth - 30) {
					this.$refs.words.style.justifyContent = 'space-around'
				}
				this.$refs.words.style.width = width + 'px'
			},
			_initSlider() {
				this.slider = new BScroll(this.$refs.slider, {
					scrollX: true,
					scrollY: false,
					click: true,
					probeType: 1
				})
			}
		},
		components: {
		
		}
	}
</script>

<style lang="scss" scoped>
.slider {
	overflow: hidden;
	margin-left: 0.4rem;
	margin-right: 0.266667rem;
 .word-list {
 	padding: 0.4rem 0 0.8rem 0;
 	box-sizing: content-box;
 	display: flex;
	white-space: nowrap;
	position: relative;
 	li {
 		margin-left: 0.266667rem;
 		width: 1.866667rem;
 		height: 2.133333rem;
 		text-align: center;
 		box-shadow: -4px 4px 5px #aa1029;
 		min-width: 1.866667rem;
 		position: relative;
 		&:first-child {
 			margin-left: 0;
 		}
		.content {
			width: 100%;
			height: 100%;
			line-height: 2.133333rem;
			font-size: 0.72rem;
			font-weight: 700;
			color: #ccc;
			background-color: #eee;
			position: relative;
			.s1 {
				position: absolute;
				width: 100%;
				height: 100%;
				top: 0;
				left: 0;
				box-sizing: border-box;
				border: 1px solid #fff2d0;
			}
			.s2 {
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
				background: url(~common/imgs/z2.png) no-repeat 0 0 / 100% 100%;
			}
		}
		.num {
			display: none;
		}
		&.on {
			.content {
				color: #ed2843;
				background-color: #ffed27;
				.s2 {
					background: url(~common/imgs/z1.png) no-repeat 0 0 / 100% 100%;
				}
			}
			.num {
				display: block;
				padding: 0 6px 0;
				// height: 0.426667rem;
				border: 1px solid #ff0623;
				border-radius: 0.4rem;
				line-height: 0.426667rem;
				text-align: center;
				font-weight: 700;
				background-color: #fff;
				position: absolute;
				top: -0.186667rem;
				right: -0.186667rem;
				color: #ed2843;
			}
		}
 	}
 }	
}
.m1 {
	.slider {
	 .word-list {
	 	li {
	 		width: 2.0rem;
	 		min-width: 2.0rem;
	 		height: 2.186667rem;
	 		box-shadow: none;
			.content {
				top: 0.4rem;
				height: 1.68rem;
				line-height: 1.68rem;
				color: #ffe484;
				background-color: #ffb12a;
				box-shadow: 0 0 6px #ffb12a;
				.s1 {
					display: none;
				}
				.s2 {
					width: 94%;
					height: 94%;
					top: 0.053333rem;
					left: 0.053333rem;
					background: url(~common/imgs/mb_3.png) no-repeat 0 0 / 100% 100%;
				}
			}
			.num {
				display: block;
				position: absolute;
				top: 0;
				left: 0;
				width: 2.0rem;
				height: 0.4rem;
				line-height: 0.4rem;
				color: #fff;
				background: url(~common/imgs/mb_1.png) no-repeat 0 0 / 100% 100%;
			}
			&.on {
				.content {
					color: #fff;
					background-color: #ff4f11;
					box-shadow: 0 0 6px #ff6f3a;
					.s2 {
					}
				}
				.num {
					background: url(~common/imgs/mb_2.png)no-repeat 0 0 / 100% 100%;
			    font-weight: 700;
			    border: none;
			    padding: 0;
			    border-radius: 0;
				}
			}
	 	}
	 }	
	}
}
</style>