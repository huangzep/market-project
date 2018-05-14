<template>
	<transition name="slide">
		<div class="fatechoice">
			<div class="tit-wrapper" :class="{'fix': fix}">
				<div class="number">已选择卡牌数量<span> {{chooseNum}} </span>张（任意{{needNum}}张兑）</div>
				<div class="btn" :class="{'on': chooseNum >= needNum}"
					@click="sure">确定兑换</div>
			</div>
			<div class="card-wrapper" v-min-h>
				<ul class="cardlist change">
					<li :class="{'no': !item.num}" ref="cards"
					v-for="(item, index) in list" @click="choose(item)">
						<img class="" :src="item.img" alt="" @error="loadImg(item)">
						<em :class="{on: item.on}"></em>
					</li>
				</ul>
			</div>
		</div>
	</transition>
</template>

<script>
	export default {
		props: {
			cardList: {
				type: Array
			},
			needNum: {
				type: Number
			}
		},
		data: () => ({ 
			fix: false,
			list: []
		}),
    computed: {
     chooseNum() {
     	return this.list.reduce((accu, cur) => {
     		return cur.on ? accu + 1 : accu
     	}, 0)
     }
    },
    watch: {
    	cardList: {
    		deep: true,
    		handler(newList) {
	    		this.handleList()
    		}
    	}
    },
    created() {
    },
    mounted() {
    	window.addEventListener('scroll', (e) => {
    		this.fix = window.scrollY > 20
    	})
    },
		methods: {
			handleList() {
				let list = []
				this.cardList.forEach((n, i) => {
					let number = n.num
					while(number) {list.push({...n, on: false, oi: i}); number--}
				})
				this.list = list
			},
			choose(item) {
				if (!item.on && this.chooseNum >= this.needNum) {
					this.$vux.toast.text('亲，您选择卡牌数量已足够，赶紧去兑换吧~')
					return;
				}
				item.on = !item.on
			},
			sure() {
				if (this.chooseNum < this.needNum) return;
				let ids = ''
				this.list.forEach(n => {if (n.on) ids += n.id + ','})
				this.$emit('sure', ids.slice(0, -1))
			},
			over() {
				this.list.forEach(n => {
					if (n.on) this.cardList[n.oi].num--;
				})
			},
			loadImg(item) {
				item.img = this.pimg('fate-card.png')
			}		
		},
		components: {
		}
	}
</script>

<style lang="scss" scoped>
@import '~common/scss/mixin';
.fatechoice {
	@include slide();
	position: relative;
	background-color: #fff;
	z-index: 2;
	.tit-wrapper {
		height: 1.2rem;
		padding-left: 0.4rem;
		padding-right: 0.4rem;
		padding-top: 0.32rem;
		display: flex;
		justify-content: space-between;
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
		.cardlist {
			display: flex;
			flex-wrap: wrap;
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
	}
}
</style>