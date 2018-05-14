<template>
	<div class="vrank">
		<scroll class="vscroll" ref="scroll" 
		:data="vlist" :update="update"
		:listenScroll="true" pulldown="stop" :pullup="true"
		@pullingDown="refresh" @pullingUp="loadMore">
			<div>
				<div class="top">
					<img src="~common/imgs/phb.jpg">
					<div class="top-m">
						<img src="~common/imgs/phb-title.png">
					</div>
					<div class="top-b">
						<ul class="f-c">
							<li>排名</li>
							<li>参选者</li>
							<li>票数</li>
						</ul>
					</div>
				</div>
				<div class="list" v-if="vlist.length">
					<ul>
						<li v-for="(item, index) in vlist">
							<span class="ph">{{index+1}}</span>
							<span class="photo"><img :src="item.UserImage"></span>
							<p class="name" @click="$router.push({path: '/vote/vapplicant', query: {aid, m, vid: item.Id, s: item.Status}})">
								<em>{{item.UserName}}</em>
							</p>
							<p class="number">{{item.Votes}}</p>
						</li>
					</ul>
				</div>
				<div class="no-phb" v-else>
					<img src="~common/imgs/no-vote-list.png">
					<p>暂无人参与评选活动</p>
					<p>过阵子再来瞧瞧吧！</p>
				</div>
				<div class="copy-container">
		      <copy-right></copy-right>
		    </div>
	    </div>
    </scroll>
  </div>
</template>

<script>
	import scrollMixin from '@/mixins/scrollMixin'
	import wxMixin from '@/mixins/wxMixin'
	import {getVoteUserList} from 'services/voteApi'
	import Store from '@/store/store'
	import {changeTitle} from 'common/js/dom'

	export default {
		mixins: [scrollMixin, wxMixin],
		data: () => ({ 
			state: Store.state,
			vlist: [],
			page: 1,  //默认请求第一页数据
			total: 0,
		}),
		computed: {
		
		},
		watch: {
			'state.logoInfo'(val) {
				if (!val.mallLink) {
					this.$refs.scroll.$el.style.top = 0
				}
			}
		},
		created() {
			this.aid = this.$route.query.aid
			this.m = this.$route.query.m
			this._getVoteUserList()
		},
		mounted() {

		},
		activated() {
    	if (this.$route.query.refresh) {
    		this._getVoteUserList()
    	}
    	changeTitle('排名榜')
    },
    beforeRouteLeave(to, from, next) {
    	if (!/vinfo|vapply|vrank/g.test(to.path)) {
    		changeTitle(Store.state.voteInfo.Title)
    	}
    	next()
    },
		methods: {
			_getVoteUserList() {
				this.update = true
				getVoteUserList(this.aid, '', true, this.page).then(res => {
					if (res.return_code === 0) {
						this.vlist = this.page === 1 ? (res.return_data || []) : [...this.vlist, ...(res.return_data || [])]
						this.total = res.totalCount
						console.log(this.vlist)
					}
				}).catch(error => {
	    		console.log(error)
					this.update = false
	        this.$refs.scroll.forceUpdate(true)
				})	
			},
			refresh() {
				this.page = 1
				this._getVoteUserList()
			},
			loadMore() {
				if (this.vlist.length >= this.total) return;
				this.page++
				this.$vux.loading.show({text: 'Loading'})
				this._getVoteUserList()
			}
		},
		components: {
		}
	}
</script>

<style lang="scss" scoped>
	.vrank{
		padding-bottom: 50px;
		.no-phb {
			padding: 1.68rem 0;
			img{
				display: block;
				height: 3.04rem;
				margin: 0 auto;
			}
			p{
				line-height: .586667rem;
    			text-align: center;
			}
			p:nth-of-type(1) {
				color: #2a2a2a;
				font-size: .4rem;
				margin-top: .213333rem;
			}
			p:nth-of-type(2) {
				color: #b5b2b2;
				font-size: .373333rem;
			}
		}
		.top{
			background-color: #fff;
			img{
				width:100%;
			}
			.top-m{
				content: "";
				background-size: 100%;
				width: 100%;
				position: relative;
				z-index: 100;
				bottom: -.213333rem;
			}
			.top-b{
				background: url(~common/imgs/phb-bg.png) 0 0 repeat-x;
				background-size: auto 1.066667rem;
				height: 1.066667rem;
				line-height: 1.066667rem;
				position: relative;
				z-index: 1;
				ul{
					position: relative;
					z-index: 20;
					zoom: 1;
					li{
						float: left;
						text-align: center;
						color: #512e0c;
						font-size: .373333rem;
					}
					li:nth-child(1){
						width: 1.386667rem;
    					text-indent: .373333rem;
					}
					li:nth-child(2){
						width: -webkit-calc(100% - 3.386667rem);
    					text-indent: .506667rem;
					}
					li:nth-child(3){
						width: 2rem;
					}
				}
			}
			.top-b:before{
				position: absolute;
				z-index: 10;
				left: 0;
				top: .026667rem;
				background: url(~common/imgs/phb01.jpg) 0 0 no-repeat;
				background-size: auto 1.066667rem;
				width: .4rem;
				height: 1.066667rem;
				content: "";
			}
		}
		.list{
			min-height: 417px;
			background: url(~common/imgs/bottom_line.png) no-repeat scroll left bottom / 100% 1px #fff;
			li{
				height: 50px;
				background: url(~common/imgs/bottom_line.png) no-repeat scroll left bottom / 100% 1px #f9f9f9;
				position: relative;
				z-index: 1;
				.ph{
					width: 63px;
					left: 0;
					padding-left: 0px;
					text-align: center;
					line-height: 48px;
					font-size: 15px;
					position: absolute;
					z-index: 10;
					top: 0;
					height: 48px;
				}
				.photo{
					width: 54px;
					position: absolute;
					left: 63px;
					top: 7px;
					img{
						border-radius: 50%;
						width: 36px;
						height: 36px;
					}
				}
				.name{
					padding: 0 75px 0 117px;
					display: table-cell;
					vertical-align: middle;
					height: 48px;
					position: relative;
					z-index: 1;
					em{
						word-break: break-all;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
						overflow: hidden;
						line-height: 17px;
						font-size: 13px;
					}
				}
				.number {
					width: 55px;
					right: 10px;
					line-height: 48px;
					box-sizing: border-box;
					text-align: center;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					font-size: 13px;
					position: absolute;
					z-index: 10;
					top: 0;
					height: 48px;
				}
			}
			li:nth-child(1),li:nth-child(2),li:nth-child(3){
				.ph{
					background: url(~common/imgs/phb-num1.png) no-repeat center 2px / 38px;
    				text-indent: -99999px;
				}
			}
			li:nth-child(2){
				.ph{
					background-position: center -55px;
				}
			}
			li:nth-child(3){
				.ph{
					background-position: center -123px;
				}
			}
			li:nth-child(4),li:nth-child(5),li:nth-child(6){
				.ph{
					background: url(~common/imgs/phb-num.png) center center no-repeat;
					background-size: 25px;
					color: #fff;
				}
			}
			li:nth-child(2n+2) {
				background-color: #fff;
			}
			.loading{
			  height: 48px;
				line-height: 48px;
				text-align: center;
				font-size: 12px;
			}
		}
	}
 
</style>