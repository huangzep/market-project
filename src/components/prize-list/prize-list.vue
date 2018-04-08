<template>
	<ul class="prize-list">
		<li class="" v-for="item in prizeList">
			<div class="left">
				<img :src="item.Image" alt="" class="">
			</div>
			<div class="middle">
				<p class="name">{{item.Name}}</p>
				<p class="content">{{item.Text}}</p>
			</div>
			<div class="right" :class="{'on': hasGift}" v-light
			@click="exchange(item)">
				兑换
			</div>
		</li>
	</ul>
</template>

<script>
	
	export default {
		props: {
			prizeList: {
				type: Array,
				default: []
			},
			hasGift: {
				type: Boolean,
				default: false
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

    },
		methods: {
			exchange(item) {
				if (this.hasGift) {
					this.$emit('exchange', item.ID, item.Image)
				} else {
					this.$vux.toast.text('亲，集满所有字才能兑换奖品哦~~')
				}				
			}
		},
		components: {
		
		}
	}
</script>

<style lang="scss" scoped>
 @import '~common/scss/mixin';
 .prize-list {
 	padding: 0.533333rem 0.4rem 0;
 	li {
		display: flex;
		margin-top: 0.8rem;
		&:first-child {
			margin-top: 0;
		}
		.left {
			width: 1.333333rem;
			height: 1.333333rem;
			min-width: 1.333333rem;
			img {
				display: block;
				width: 100%;
				height: 100%;
				border-radius: 0.133333rem;
			}
		}
		.middle {
			margin-left: 0.266667rem;
			max-width: 4.96rem;
			flex: 1;
			.name {
				font-size: 0.4rem;
				line-height: 0.56rem;
				@include ellipsis();
			}
			.content {
				font-size: 0.346667rem;
				line-height: 0.426667rem;
				color: #666;
				margin-top: 0.08rem;
				@include ellipsis2();
			}
		}
		.right {
			margin: 0.266667rem 0 0 0.266667rem;
			width: 1.6rem;
			min-width: 1.6rem;
			height: 0.8rem;
			border-radius: 0.533333rem;
			background-color: #ddcda6;
			color: #b4a685;
			font-size: 0.4rem;
			text-align: center;
			line-height: 0.8rem;
			&.on {
				background-color: #d11d3a;
				color: #fff;
			}
		}
 	}
 }
 .m1 {
 	 .prize-list {
	 	li {
			.middle {
				.name {
					color: #7c3d00;
				}
				.content {
					color: #c38d58;
				}
			}
			.right {
				background-color: #e1d6b0;
				box-shadow: 0 0 5px #d4caa7;
				color: #fff3c7;
				&.on {
					background-color: #ff4f11;
					box-shadow: 0 0 5px #e8480f;
				}
			}
	 	}
	 }
 }
</style>