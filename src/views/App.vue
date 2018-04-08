<template>
	<div id="app">
		<router-view></router-view>
		<!-- 登录弹框 -->
		<confirm ref="confirm" @confirm="action" 
		confirmBtnText="登录"  @cancel="cancel" 
		:hasCancel="true" :text="confirmContent"></confirm>
		<!-- 底部关注 -->
		<div class="focus-wrapper" v-show="focusFlag">
			<div class="left">
				<img :src="logoImg" alt="" class="avatar">
				<span class="txt">{{comName}}</span>
			</div>
			<div class="right">
				<span class="btn" @click="codeFlag = true">关注</span>
				<img src="~common/imgs/chacha.png" alt="" class="close"
				@click="focusFlag = false">
			</div>
		</div>
		<!-- 二维码弹框 -->
		<div class="qr-code" v-show="codeFlag" @click="hideCode">
			<div class="code-wrapper" @click.stop>
				<div class="code-content">
					<img :src="codeImg" alt="">
					<p>长按识别二维码关注公众号</p>
				</div>
				<div class="del" @click="hideCode"></div>
			</div>
		</div>
	</div>
</template>

<script>
	import Confirm from 'components/confirm/confirm'
	import Store from '@/store/store'
	import {getGzStatus} from 'services/wxApi'

	export default {
		data: () => ({
			state: Store.state,
			confirmContent: '抱歉，您还未登录',
			focusFlag: false,
			logoImg: '',
			comName: '',
			codeFlag: false,
			codeImg: ''
		}),
		computed: {
			
		},
		watch: {
			'state.isLogin'(newVal) {
				if (!newVal) {
					this.$refs.confirm.show()
				} else {
					this.$refs.confirm.hide()
				}
			},
			'$route'(newVal) {
				if (/word$/g.test(newVal.path)) {
					this.aid = newVal.query.aid
					this._getGzStatus()
				}
			}
		},
		created() {
		},
		mounted() {
		},
		methods: {
			_getGzStatus() {
				getGzStatus(this.aid).then(res => {
					if (res.return_code === 0) {
						this.comName = res.return_data.CompanyName
						this.logoImg = res.return_data.WxLogo
						this.focusFlag = (res.return_data.IsFollow === 1 && res.return_data.GzStatus !== 1) 
						this.codeImg = res.return_data.Url
					}
				})
			},
			action() {
				Store.setIsLogin(true)
				window.location.reload()
			},
			cancel() {
				Store.setIsLogin(true)
			},
			hideCode() {
				this.codeFlag = false
			}
		},
		components: {
			Confirm
		}
	}
</script>

<style scoped lang="scss">
@import '~common/scss/mixin';
.focus-wrapper {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 1.2rem;
	background-color: rgba(49, 16, 10, .7);
	z-index: 99;
	.left, .right {
		display: flex;
		align-items: center;
	}
	.avatar {
		display: block;
		width: 0.8rem;
		height: 0.8rem;
		border-radius: 50%;
		margin-left: 0.266667rem;
	}
	.txt {
		margin-left: 0.266667rem;
		width: 5.2rem;
		color: #fff;
		font-size: 0.346667rem;
		@include ellipsis();
	}
	.btn {
		width: 1.333333rem;
		height: 0.666667rem;
		border: 1px solid #fff;
		border-radius: 0.106667rem;
		line-height: 0.613333rem;
		text-align: center;
		margin-right: 0.4rem;
		color: #fff;
	}
	.close {
		display: block;
		box-sizing: content-box;
		width: 0.32rem;
		height: 0.32rem;
		padding: 0.266667rem 0.533333rem 0.266667rem 0.266667rem;
	}
}
.qr-code {
	@include cover();
	.code-wrapper {
		@include wrapper();
		.code-content {
			@include content();
			overflow: hidden;
			min-width: 5.866667rem;
			img {
				display: block;
				width: 4.266667rem;
				height: 4.266667rem;
				margin: 0.666667rem auto 0.4rem;
			}
			p {
				font-size: 0.426667rem;
				color: #666;
				text-align: center;
				margin-bottom: 0.64rem;
			}
		}
		.del {
			@include del();
		}
	}
}
</style>