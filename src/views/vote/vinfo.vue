<template>
	<div class="vinfo">
		<!-- <scroll class="vscroll" ref="scroll" 
		:data="list" 
		:listenScroll="true" pulldown="stop" @pullingDown="refresh"> -->
			<div>
				<div class="vinfo-wrapper" v-min-h>
					<div class="vinfo-box">
						<div class="title">
							<div>
								<p>
								<span>
									{{state.voteInfo.Title}}
								</span>
								</p>
							</div>
						</div>
						<div>
							<h1>主办单位</h1>
							<div class="con">
								{{state.voteInfo.HostName}}
								<ul>
									<li v-if="state.voteInfo.CoOrganizer">
										<div class="bold">协办单位：</div>
										{{state.voteInfo.CoOrganizer}}
									</li>
									<li v-if="state.voteInfo.Organizer">
										<div class="bold">承办单位：</div>
										{{state.voteInfo.Organizer}}
									</li>
									<li v-if="state.voteInfo.TitleUnit">
										<div class="bold">冠名单位：</div>
										{{state.voteInfo.TitleUnit}}
									</li>
									<li v-if="state.voteInfo.Supporting">
										<div class="bold">赞助单位：</div>
										{{state.voteInfo.Supporting}}
									</li>
									<li v-if="state.voteInfo.ThanksUnit">
										<div class="bold">鸣谢单位：</div>
										{{state.voteInfo.ThanksUnit}}
									</li>
								</ul>
							</div>
							<h1>活动时间</h1>
							<div class="con">{{state.voteInfo.StartTime}} - {{state.voteInfo.EndTime}}</div>
							<h1 v-if="state.voteInfo.PrizeRemark">奖项设置</h1>
							<div class="con" v-html="state.voteInfo.PrizeRemark"></div>
							<h1>联系方式</h1>
							<div class="con">
								<a :href="'tel: ' + state.voteInfo.Tel"><p class="phone">联系电话：{{state.voteInfo.Tel}}</p></a><br>
								<a :href="`http://wpa.qq.com/msgrd?V=1&uin=${state.voteInfo.QQ}&Site=QQ`"><p class="qq" v-if="state.voteInfo.QQ">QQ号码： {{state.voteInfo.QQ}}</p></a>
							</div>
							<div class="ewm" v-if="state.voteInfo.QrCodePath">
								<img :src="state.voteInfo.QrCodePath">
								<p>公众号二维码</p>
							</div>
						</div>
					</div>
					<div class="vinfo-box" v-if="state.voteInfo.ActivityRule">
						<h1>投票规则</h1>
						<div class="con tou-rule" v-html="state.voteInfo.ActivityRule.replace(/<br>/g, '')"></div>
					</div>
					<div class="vinfo-box">
						<h1 v-if="state.voteInfo.ActivityRemark">活动详情</h1>
						<div class="con" v-html="state.voteInfo.ActivityRemark"></div>
					</div>
				</div>
				<!-- 底部版权 -->
		    <div class="copy-container">
		      <copy-right></copy-right>
		    </div>
	    </div>
    <!-- </scroll> -->
	</div>
</template>

<script>
	import Store from '@/store/store'
	import wxMixin from '@/mixins/wxMixin'

	export default {
		mixins: [wxMixin],
		data: () => ({
			state: Store.state 
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

<style lang="scss">
	.vinfo{
		position: fixed;
		top: 48px;
		bottom: 50px;
		left: 0;
		right: 0;
		overflow: scroll;
		background-color: #fff;
		.vinfo-wrapper {
			background: url(~common/imgs/bottom_line.png) no-repeat scroll left bottom / 100% 1px,
			url(~common/imgs/bottom_line.png) no-repeat scroll left top / 100% 1px #fff;
			padding: .533333rem .266667rem .213333rem;
			margin-bottom: .266667rem;
		}
		.vinfo-box{
			line-height: .64rem;
			font-family: "Microsoft YaHei";
			.title{
				height: 1.333333rem;
				background: url(~common/imgs/title_l.png) no-repeat left bottom / auto 100%,url(~common/imgs/title_r.png) no-repeat right bottom / auto 100%;
				padding: 0 .746667rem 0;
				margin-bottom: .666667rem;
				div{
					height: 1.093333rem;
					display: table;
					width: 100%;
					word-wrap: break-word;
					word-break: break-all;
					p{
						height: 1.093333rem;
						width: 100%;
						background: #f83d11;
						overflow: hidden;
						color: #fff;
						line-height: .426667rem;
						font-size: .373333rem;
						display: table-cell;
						vertical-align: middle;
						span{
							width: calc(100% - .266667rem);
							vertical-align: middle;
							-webkit-box-flex: 1;
							flex: 1;
							padding: 0 .133333rem;
							text-align: center;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							-webkit-box-orient: vertical;
						}
					}
				}
			}
			h1{
				color: #2a2a2a;
				font-size: .426667rem;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				height: .64rem;
				line-height: .64rem;
				margin-bottom: .133333rem;
			}
			h1::before{
				content: "";
				display: inline-block;
				width: .08rem;
				height: .426667rem;
				margin: .106667rem .106667rem 0 0;
				background: #dd2726;
				vertical-align: top;
			}
			.con{
				font-size: .373333rem;
				padding-bottom: .32rem;
				text-align: justify;
				word-break: break-all;
				word-wrap: break-word;
				ol, ul {
					list-style: none !important;
				}
				.bold{
					font-weight: bold;
				}
				span{
					color: #dd2726;
				}
				img {
					display: block;
					width: 100%;
				}
				.phone{
					padding-right: .8rem;
					background: url(~common/imgs/phone.png) no-repeat right center / auto 18px;
					display: inline-block;
					vertical-align: top;
				}
				.qq{
					padding-right: .8rem;
					background: url(~common/imgs/qq.png) no-repeat right center / auto 18px;
					display: inline-block;
					vertical-align: top;
				}
			}
			.ewm {
				width: 7.36rem;
				padding: .266667rem;
				border-radius: .16rem;
				border: 1px solid #eee;
				text-align: center;
				margin: .266667rem auto;
				img{
					display: block;
					width: 100%;
				}
				p{
					line-height: .8rem;
					font-size: .373333rem;
				}
			}
			.tou-rule {
				* {
					font-size: .373333rem !important;
			    line-height: .64rem;
			    font-family: "Microsoft YaHei";
			    color: #3a3633;
			    font-weight: 500;
				}
			}
		}
	}
</style>