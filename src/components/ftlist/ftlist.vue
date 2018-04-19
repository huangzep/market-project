<template>
	<ul class="ftlist">
		<li v-for="item in list">
			<div class="top">
				<div class="tit">{{item.t}}</div>
				<div class="dimg">
					<img :src="item.img" alt="">
				</div>
			</div>
			<div class="bottom">
				<div class="p1">{{item.p1}}</div>
				<div class="p2">集齐特定 <span> 5 </span> 种卡牌兑换</div>
				<div class="btn">可兑换</div>
			</div>
		</li>
	</ul>
</template>

<script>
	
	export default {
		data: () => ({ 
			list: [
				{t: '安慰特点将', img: 'http://staticf.miduonet.com/houtai/images/jizi/bg_jizi.jpg', p1: '米多网络提供技术支持米多网络提供技术支持持米多网络提供技术支持持米多网络提供技术支持', n: 34},
				{t: '安慰特点将', img: 'http://staticf.miduonet.com/houtai/images/jizi/bg_jizi.jpg', p1: '米多网络提供技术支持米多网络提供技术支持持米多网络提供技术支持持米多网络提供技术支持', n: 34},
				{t: '安慰特点将', img: 'http://staticf.miduonet.com/houtai/images/jizi/bg_jizi.jpg', p1: '米多网络提供技术支持米多网络提供技术支持持米多网络提供技术支持持米多网络提供技术支持', n: 34},
				{t: '安慰特点将', img: 'http://staticf.miduonet.com/houtai/images/jizi/bg_jizi.jpg', p1: '米多网络提供技术支持米多网络提供技术支持持米多网络提供技术支持持米多网络提供技术支持', n: 34},
				{t: '安慰特点将', img: 'http://staticf.miduonet.com/houtai/images/jizi/bg_jizi.jpg', p1: '米多网络提供技术支持米多网络提供技术支持持米多网络提供技术支持持米多网络提供技术支持', n: 34},
				{t: '安慰特点将', img: 'http://staticf.miduonet.com/houtai/images/jizi/bg_jizi.jpg', p1: '米多网络提供技术支持米多网络提供技术支持持米多网络提供技术支持持米多网络提供技术支持', n: 34},
				{t: '安慰特点将', img: 'http://staticf.miduonet.com/houtai/images/jizi/bg_jizi.jpg', p1: '米多网络提供技术支持米多网络提供技术支持持米多网络提供技术支持持米多网络提供技术支持', n: 34},
				{t: '安慰特点将', img: 'http://staticf.miduonet.com/houtai/images/jizi/bg_jizi.jpg', p1: '米多网络提供技术支持米多网络提供技术支持持米多网络提供技术支持持米多网络提供技术支持', n: 34},
				{t: '安慰特点将', img: 'http://staticf.miduonet.com/houtai/images/jizi/bg_jizi.jpg', p1: '米多网络提供技术支持米多网络提供技术支持持米多网络提供技术支持持米多网络提供技术支持', n: 34},
				{t: '安慰特点将', img: 'http://staticf.miduonet.com/houtai/images/jizi/bg_jizi.jpg', p1: '米多网络提供技术支持米多网络提供技术支持持米多网络提供技术支持持米多网络提供技术支持', n: 34},

			]
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
			
		},
		components: {
		
		}
	}
</script>

<style lang="scss" scoped>
@import '~common/scss/mixin';

.ftlist {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	padding: 0 0.4rem 0.506667rem;
	li {
		margin-top: 0.64rem;
		width: 4.48rem;
		.top {
			background-image: url(~common/imgs/fate-ripple.png);
			background-repeat: no-repeat;
			background-position: left calc(100% + 2px);
			background-size: 100% 4px;
			background-color: #FED57C;
			padding-bottom: 0.32rem;
			border-radius: 6px 6px 0 0;
			.tit {
				color: #da2f46;
				font-size: 0.4rem;
				line-height: 1.066667rem;
				text-align: center;
			}
			.dimg {
				width: 2.533333rem;
				height: 2.533333rem;
				margin: 0 auto;
				img {
					display: block;
					width: 100%;
					height: 100%;
					border: 1px solid #E85D54;
					border-radius: 50%;
				}
			}
		}
		.bottom {
			background-color: #fff;
			overflow: hidden;
			border-radius: 0 0 6px 6px;
			.p1 {
				line-height: 0.4rem;
				height: 0.906667rem;
				padding: 0.186667rem 0.266667rem 0;
				@include ellipsis2();
			}
			.p2 {
				padding: 0.266667rem 0 0 0.266667rem;
				color: #E3403D;
				span {
					font-size: 0.426667rem;
					color: #FF6101;
				}
			}
			.btn {
				width: 2.666667rem;
				height: 0.666667rem;
				line-height: 0.666667rem;
				color: #fff;
				margin: 0.24rem auto;
				background-color: #DB3644;
				text-align: center;
				border-radius: 5px;
				&.yel {
					background-color: #FDB71F;
				}
			}
		}
	}
}
</style>