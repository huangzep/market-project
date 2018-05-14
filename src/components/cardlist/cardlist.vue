<template>
	<ul class="cardlist" :class="clstype">
		<li :class="{'no': !item.num}" ref="cards" :key="item.id"
		v-for="(item, index) in cardList">
			<img :src="item.img" alt="" @error="loadImg(item)">
			<i></i>
			<span>{{item.num}}</span>
		</li>
	</ul>
</template>

<script>

	export default {
		props: {
			cardList: {
				type: Array
			}
		},
		data: () => ({ 
		}),
    computed: {
     clstype() {   //2~15张，一行3张；16~24张，一行4张；25~32张，一行5张；
     	let len = this.cardList.length;
     	if (len == 2) return 'two';
     	if (len <= 15) return 'three';
     	if (len <= 24) return 'four';
     	return 'five';
     }
    },
    watch: {

    },
    created() {
    },
    mounted() {
    },
		methods: {
			loadImg(item) {
				item.img = this.pimg('fate-card.png')
			}
		},
		components: {
		}
	}
</script>

<style lang="scss" scoped>
.cardlist {
	display: flex;
	flex-wrap: wrap;
	&.two {
		justify-content: space-around;
	}
	&.three {
		li {
			margin-left: 0.4rem;
			margin-right: 0.24rem;
		}
	}
	&.four {
		li {
			width: 1.946667rem;
			height: 2.533333rem;
			margin-left: 0.4rem;
		}
	}
	&.five {
		padding-left: 0.133333rem;
		li {
			width: 1.573333rem;
			height: 2.053333rem;
			margin-left: 0.32rem;
		}
	}
	&.change {
		margin-left: -2px;
		li {
			width: 2.026667rem;
			height: 2.666667rem;
			margin-left: 0.4rem;
			margin-top: 0.4rem;
		}
		span, i {display: none;}
		em {
			display: block;
			position: absolute;
			z-index: 1;
			bottom: 0.08rem;
			right: 0.08rem;
			width: 0.426667rem;
			height: 0.426667rem;
			border-radius: 50%;
			background: url(~common/imgs/fate-gou.png) no-repeat center center / 80%;
			background-color: rgba(0, 0, 0, .6);
			&.on {
				background-color: #1AAD1A;
			}
		}
	}
	li {
		width: 2.586667rem;
		height: 3.36rem;
		margin-top: 0.453333rem;
		position: relative;
		&.no {
			i {
				display: block;
				position: absolute;
				top: 0;
				right: 0;
				left: 0;
				bottom: 0;
				background-color: rgba(255, 255, 255, .3);
			}
		}
		img {
			display: block;
			width: 100%;
			height: 100%;
			border-radius: 6px;
		}
		i, em {display: none;}
		span {
			position: absolute;
			top: 2px;
			right: 4px;
			transform: translate(50%, -50%);
			width: 0.533333rem;
			height: 0.533333rem;
			line-height: 0.533333rem;
			border-radius: 50%;
			background-color: #E3403D;
			color: #fff;
			text-align: center;
			border: 1px solid #fff;
		}
	}
}
</style>