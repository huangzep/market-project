<template>
	<transition-group class="newslide" tag="ul" name="list">
		<li class="news-item" v-for="(item, index) in newsList" :key="item.Text">
			<div class="img">
				<img :src="item.HeadImg" alt="">
			</div>
			<div class="txt">
				{{item.Text}}
			</div>
		</li>
	</transition-group>
</template>

<script>
	
	export default {
		props: {
			messageList: {
				type: Array,
				default: []
			},
		},
		data: () => ({ 
			newsList: [],
			i: 1
		}),
    computed: {
     
    },
    watch: {
    	messageList(newVal) {
    		clearInterval(this.timer)
    		this.newsList = newVal.slice(0, 1)
    		this.animate()
    	}
    },
    created() {
    	this.newsList = this.messageList.slice(0, 1)
    },
    mounted() {
    	this.animate()
    },
    destroyed() {
    	clearInterval(this.timer)
    },
		methods: {
			animate() {
				this.timer = setInterval(() => {
					this.newsList.shift()
					setTimeout(() => {
						if (this.newsList.length) return;
						this.i = (this.i === this.messageList.length - 1 || this.messageList.length === 1) ? 0 : (this.i + 1)
						this.newsList.push(this.messageList[this.i])
					}, 1500)
				}, 4000)
			}
		},
		components: {
		
		}
	}
</script>

<style lang="scss" scoped>
 @import "~common/scss/mixin.scss";
 .newslide {
 	.news-item {
 		display: flex;
 		align-items: center;
 		padding-bottom: 0.533333rem;
 		padding-left: 0.106667rem;
 		&.list-enter-active, &.list-leave-active {
 			transition: all .6s;
 		}
 		&.list-enter {
 			transform: translate(-100%, 0);
 		}
 		&.list-leave-to {
 			transform: translate(0, -100%);
 			opacity: 0;
 		}
 		.img {
 			width: 0.853333rem;
 			height: 0.853333rem;
 			border: 1px solid #7f372d;
 			border-radius: 50%;
 			overflow: hidden;
 			img {
				display: block;
				width: 100%;
				height: 100%;
 			}
 		}
 		.txt {
 			white-space: nowrap;
 			height: 0.64rem;
 			line-height: 0.64rem;
 			text-align: center;
 			background-color: rgba(0, 0, 0, .5);
 			color: #fff;
 			padding: 0 10px 0 20px;
	    border-radius: 15px;
	    margin-left: -0.4rem;
	    z-index: -1;
 		}
 	}
 }
</style>