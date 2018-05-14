<template>
	<div class="activity">
		<div class="tab-wrapper">
			<tab class="common-tab" defaultColor="#333" active-color="#dd2726" bar-active-color="#dd2726" :line-width="2" 
			v-model="tabIndex">
	      <tab-item>正在进行</tab-item>
	      <tab-item>往期活动</tab-item>
	    </tab>
    </div>
    <scroll class="activity-content" ref="scroll"
    :data="giftList" 
    :listenScroll="true" :pulldown="true" :pullup="true"
    @pullingDown="refresh" @pullingUp="loadMore">
	    <div class="">
				<div class="container" v-min-h>
					<div class="ended" v-show="giftList.length && tabIndex === 1">
						最近3个月已结束的活动
					</div>
					<gift-list :tabIndex="tabIndex" :giftList="giftList"
					@selectItem="selectItem"></gift-list>
					<div class="daodi" v-show="total !== 0 && total === giftList.length">
						人家是有底线的~~
					</div>
					<div class="no-activity" v-show="!giftList.length">
						<img src="~common/imgs/no-activity.png" alt="">
						<p v-show="tabIndex === 0">
							还没有进行中的活动哦~<br>过阵子再来瞧瞧吧！
						</p>
						<p v-show="tabIndex === 1">
							还没有活动哦~<br>过阵子再来瞧瞧吧！
						</p>
					</div>
				</div>
				<div class="copy-container">
					<copy-right></copy-right>
				</div>
			</div>
		</scroll>
	</div>
</template>

<script>
	import {Tab, TabItem} from 'vux/src/components/tab'
	import GiftList from 'components/gift-list/gift-list'
	import Scroll from 'components/scroll/scroll'
	import {getFateList} from 'services/wordActApi'

	export default {
		data: () => ({
			tabIndex: 0,
			giftList: [],
			page: 1,
			total: 0,
			timer: null
		}),
    computed: {
     
    },
    watch: {
			tabIndex() {
				this.page = 1
				this.getList()
			}
    },
    created() {
    	this.m = this.$route.query.m
    	document.title = '全民集卡牌'
    	this.getList()
    },
    mounted() {
    },
		methods: {
			getList() {
				this.$vux.loading.show({text: 'Loading'})
				getFateList(this.m, this.tabIndex + 1, this.page).then(res => {
	    		if (res.return_code === 0) {
	    			this.giftList = this.page === 1 ? res.return_data : [...this.giftList, ...res.return_data]
	    			this.total = res.return_count
	    			this.$refs.scroll.finishPullUp()
	    		}
	    	})
			},
			loadMore() {
				if (this.giftList.length >= this.total) return;
				clearTimeout(this.timer)
				this.timer = setTimeout(() => {
					this.page++;
					this.getList()
				}, 20)
			},
			refresh() {
				clearTimeout(this.timer)
				this.timer = setTimeout(() => {
					this.page = 1
					this.getList()
					this.$refs.scroll.finishPullDown()
				}, 20)
			},
			selectItem(item) {
				this.$router.push({
					path: '/fate',
					query: {
						aid: item.Actid,
						m: this.m
					}
				})
			}
		},
		components: {
			Tab,
			TabItem,
			GiftList,
			Scroll,
		}
	}
</script>

<style scoped lang="scss">
.activity {
	.tab-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 10;
	}
	.container {
		.ended {
			padding-top: 0.266667rem;
			color: #999;
			font-size: 0.346667rem;
			text-align: center;
		}
		.daodi {
			text-align: center;
			line-height: 1.066667rem;
			color: #999;
		}
		.no-activity {
			display: flex;
			flex-direction: column;
			align-items: center;
			background-color: #f0f0f0;
			img {
				display: block;
				width: 2.4rem;
				height: 2.4rem;
				margin-top: 2.4rem;
			}
			p {
				font-size: 0.346667rem;
				color: #999;
				line-height: 0.613333rem;
				padding-top: 0.533333rem;
				text-align: center;
			}
		}
	}
}
.activity-content {
	position: fixed;
	top: 1.333333rem;
	bottom: 0;
	width: 100%;
	.pullup-wrapper {
		position: absolute;
		top: -50px;
		width: 100%;
		text-align: center;
		line-height: 1.333333rem;
		font-size: 0.373333rem;
		z-index: -1;
		color: #ccc;
		.pullup-content {
			display: flex;
			justify-content: center;
			align-items: center;
			i {
				transition: all .5s;
				color: #ccc;
			}
			p {
				margin-left: 4px;
			}
		}
	}
}
</style>