<template>
	<div class="vother">
  	<div class="tab-wrapper">
			<tab class="common-tab" defaultColor="#333" active-color="#dd2726" bar-active-color="#dd2726" :line-width="2" 
			v-model="tabIndex">
	      <tab-item>正在进行</tab-item>
	      <tab-item>即将开始</tab-item>
	      <tab-item>往期活动</tab-item>
	    </tab>
    </div>
		<scroll class="activity-content" ref="scroll" :data="voteList"
    :listenScroll="true" pulldown="stop" :pullup="true" :update="update"
    @pullingDown="refresh" @pullingUp="loadMore">
	    <div class="">
				<div class="container" v-min-h>
					<div class="ended" v-show="voteList.length && tabIndex === 2">
						最近3个月已结束的活动
					</div>
					<ul class="act">
						<li v-for="item in voteList">
							<div class="pic" @click="$router.push({path: '/vote/vhome', query: {m, aid: item.Id}})">
								<img :src="item.VoteImage" alt="">
								<span>活动时间：{{item.StartTime}}-{{item.EndTime}}</span>
							</div>
							<p class="p1">{{item.Title}}</p>
							<p class="p2">参选数: <span>{{item.CxTotal}}</span></p>
						</li>
					</ul>
					<div class="daodi" v-show="total !== 0 && total === voteList.length">
						人家是有底线的~~
					</div>
					<div class="no-activity" v-show="!voteList.length">
						<img src="~common/imgs/no-vote-list.png" alt="">
						<p>
							没有投票评选活动哦~<br>过阵子再来瞧瞧吧！
						</p>
					</div>
				</div>
				<div class="copy-container">
					<copy-right></copy-right>
				</div>
			</div>
		</scroll>
		<!-- <rotate-bar></rotate-bar> -->
  </div>
</template>

<script>
	import {Tab, TabItem} from 'vux/src/components/tab'
	import RotateBar from 'components/rotate-bar/rotate-bar'
	import wxMixin from '@/mixins/wxMixin'
	import scrollMixin from '@/mixins/scrollMixin'
	import {getVoteList} from 'services/voteApi'

	export default {
		mixins: [scrollMixin, wxMixin],
		data: () => ({ 
			tabIndex: 0,
			voteList: [],
			page: 1,
			total: 0,
		}),
    computed: {
     
    },
    watch: {
			tabIndex(val) {
				this.$vux.loading.show({text: 'Loading'})
				this.refresh()
				this.$refs.scroll.scrollTo(0, 0)
			}
    },
    created() {
    	this.m = this.$route.query.m
    	this._getVoteList()
    },
    mounted() {

    },
		methods: {
			_getVoteList() {
				this.update = true
				getVoteList(this.m, this.tabIndex, this.page).then(res => {
					if (res.return_code === 0) {
						this.voteList = this.page === 1 ? res.return_data : [...this.voteList, ...res.return_data]
						this.total = res.totalCount
					}
				}).catch(error => {
	    		console.log(error)
					this.update = false
	        this.$refs.scroll.forceUpdate(true)
				})	
			},
			loadMore() {
				if (this.voteList.length >= this.total) return;
				this.page++;
				this.$vux.loading.show({text: 'Loading'})
				this._getVoteList()
			},
			refresh() {
				this.page = 1
				this._getVoteList()
			},
		},
		components: {
			Tab,
			TabItem,
			RotateBar
		}
	}
</script>

<style lang="scss" scoped>
.vother {
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
		ul.act {
			li {
		    padding-bottom: 10px;
		    background: url(~common/imgs/bottom_line.png) no-repeat scroll left bottom / 100% 1px,url(~common/imgs/bottom_line.png) no-repeat scroll left top / 100% 1px #fff;
		    &:first-child {
			    margin-top: 10px;	
		    }
		    .pic {
		    	position: relative;
			    z-index: 0;
			    min-height: 28px;
		    	img {display: block;width: 100%;}
		    	span {
		    		color: #fff;
				    font-size: 12px;
				    line-height: 28px;
				    height: 28px;
				    position: absolute;
				    bottom: 0;
				    left: 0;
				    box-sizing: border-box;
				    padding: 0 12px 0 32px;
				    white-space: nowrap;
				    overflow: hidden;
				    text-overflow: ellipsis;
				    z-index: 1;
				    background: url(~common/imgs/vote-time.png) no-repeat 10px center / auto 16px rgba(0,0,0,.7);
				    width: 100%;
		    	}
		    }
		    .p1 {
		    	line-height: 18px;
			    margin-top: 10px;
			    padding: 0 10px;
			    font-size: 16px;
			    word-break: break-all;
			    word-wrap: break-word;
		    }
		    .p2 {
		    	font-size: 12px;
			    color: #a9a9a9;
			    word-break: break-all;
			    word-wrap: break-word;
			    line-height: 20px;
			    margin-top: 10px;
			    padding: 0 10px;
			    span {color: #c00900; font-size: 16px;vertical-align: top;}
		    }
			}
		}
		.daodi {
			text-align: center;
			line-height: 1.066667rem;
		}
		.no-activity {
			display: flex;
			flex-direction: column;
			align-items: center;
			img {
				display: block;
				width: 3.04rem;
				height: 3.04rem;
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
	background-color: #fff;
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