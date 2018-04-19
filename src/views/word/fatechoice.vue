<template>
	<div class="fatechoice">
		<div class="tit-wrapper" :class="{'fix': fix}">
			<div class="number">已选择卡牌数量<span> 54 </span>张（任意21张兑）</div>
			<div class="btn">确定兑换</div>
		</div>
		<div class="card-wrapper" v-min-h>
			<cardlist :change="true"></cardlist>	
		</div>
		<div class="copy-container">
			<copy-right></copy-right>
		</div>
	</div>
</template>

<script>
	import Cardlist from 'components/cardlist/cardlist'
	export default {
		data: () => ({ 
			fix: false
		}),
    computed: {
     
    },
    watch: {

    },
    created() {

    },
    mounted() {
    	window.addEventListener('scroll', (e) => {
    		this.fix = window.scrollY > 20
    	})
    },
		methods: {
			
		},
		components: {
			Cardlist
		}
	}
</script>

<style lang="scss" scoped>
.fatechoice {
	position: relative;
	background-color: #fff;
	.tit-wrapper {
		height: 1.2rem;
		padding-left: 0.4rem;
		padding-top: 0.32rem;
		display: flex;
		position: absolute;
		z-index: 99;
		top: 0;
		left: 0;
		right: 0;
		.number {
			padding-top: 0.08rem;
			font-size: 0.346667rem;
			color: #333;
			span {
				font-size: 0.533333rem;
				color: #f84d40;
			}
		}
		.btn {
			width: 2.133333rem;
			line-height: 0.8rem;
			height: 0.8rem;
			color: #fff;
			margin-left: 0.64rem;
			margin-top: 0.053333rem;
			background-color: #999;
			border-radius: 4px;
			text-align: center;
			&.on {
				background-color: #F84D40;
			}
		}
		&.fix {
			position: fixed;
			height: 1.6rem;
			background-color: rgba(0, 0, 0, .6);
			.number {
				color: #fff;
			}
		}
	}
	.card-wrapper {
		padding-top: 1.2rem;
		padding-bottom: 0.4rem;
	}
}
</style>