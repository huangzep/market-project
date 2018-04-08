<template>
	<ul class="gift-list">
		<li class="" v-for="item in giftList"
		@click="selectItem(item)">
			<div class="left">
				<img :src="item.ThemeImage" alt="">
			</div>
			<div class="right">
				<p class="title">{{item.Title}}</p>
				<p class="time">
					<img v-if="tabIndex === 0" src="~common/imgs/icon_biao.png" alt="">
					<img v-else src="~common/imgs/icon_biaohui.png" alt="">
					<span :style="{color: tabIndex === 0 ? '#dd2726' : '#ccc'}"
					>{{tabIndex === 0 ? _difTime(item.EndTime) : '已结束'}}</span>
				</p>
				<p class="info">奖励：{{item.RuleText}}</p>
			</div>
		</li>
	</ul>
</template>

<script>
	import {difTime} from 'common/js/util'

	export default {
		props: {
			tabIndex: {
				type: Number,
				default: 0
			},
			giftList: {
				type: Array,
				default: []
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
			_difTime(start, end) {
				return difTime(start, end)
			},
			selectItem(item) {
				this.$router.push({
					path: '/word',
					query: {
						aid: item.Actid
					}
				})
			}
		},
		components: {
		
		}
	}
</script>

<style lang="scss" scoped>
@import '~common/scss/mixin';
.gift-list {
	li {
		margin-top: 0.266667rem;
		background-color: #fff;
		padding: 0.32rem;
		display: flex;
		.left {
			min-width: 2.4rem;
			width: 2.4rem;
			height: 2.4rem;
			img {
				display: block;
				width: 100%;
				height: 100%;
			}
		}
		.right {
			margin-left: 0.266667rem;
			.title {
				font-size: 0.4rem;
				color: #2a2a2a;
				line-height: 0.48rem;
				font-weight: 700;
			}
			.time {
				font-size: 0.346667rem;
				line-height: 0.48rem;
				padding: 0.186667rem 0;
				display: flex;
				align-items: center;
				img {
					width: 0.346667rem;
				}
				span {
					margin-left: 0.266667rem;
				}
			}
			.info {
				font-size: 0.346667rem;
				color: #999;
				line-height: 0.48rem;
				max-width: 6.693333rem;
				@include ellipsis2();
			}
		}
	}
}
</style>