<template>
	<transition name="inform">
		<div class="inform" v-show="showFlag" @click="hide">
			<div class="inform-wrapper" @click.stop>
				<div class="inform-content">
					<div class="title">
						<i class="lb"></i>
						<span>{{title}}</span>
						<i class="rb"></i>
					</div>
					<div class="con" v-html="content"></div>
					<div class="btn" @click="hide">{{btnText}}</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
	
	export default {
		props: {
			title: {
				type: String,
				default: '活动说明'
			},
			content: {
				type: String,
				default: ``
			},
			btnText: {
				type: String,
				default: '知道了'
			}
		},
		data: () => ({ 
			showFlag: false,
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
			show() {
				this.showFlag = true
			},
			hide() {
				this.showFlag = false
			},
		},
		components: {
		
		}
	}
</script>

<style lang="scss" scoped>
@import '~common/scss/mixin';
.inform {
	@include cover();
	&.inform-enter-active {
		animation: fadein 0.3s;
		.inform-content {
			animation: inform-zoom 0.3s;
		}
	}
	.inform-wrapper {
		@include wrapper();
		.inform-content {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			width: 8.16rem;
			@include content();
			.title {
				display: flex;
				justify-content: center;
				align-items: center;
				padding-top: 0.48rem;
				.lb {
					width: 1.866667rem;
					height: 1px;
					background-image: linear-gradient(to right,rgba(229,229,229,0) 0%,rgba(229,229,229,1) 70%,rgba(229,229,229,1) 100%);
					position: relative;
					&::before {
						content: '';
				    width: 6px;
				    height: 6px;
				    background: #ffc853;
				    transform: rotate(45deg);
				    position: absolute;
				    right: 0;
				    top: -3px;
					}
				}
				.rb {
					width: 1.866667rem;
					height: 1px;
					background-image: linear-gradient(to right,rgba(229,229,229,1) 0%,rgba(229,229,229,1) 30%,rgba(229,229,229,0) 100%);
					position: relative;
					&::before {
						content: '';
				    width: 6px;
				    height: 6px;
				    background: #ffc853;
				    transform: rotate(45deg);
				    position: absolute;
				    left: 0;
				    top: -3px;
					}
				}
				span {
					font-size: 0.426667rem;
					color: #ff9409;
					font-weight: 700;
					white-space: nowrap;
					margin: 0 0.266667rem;
				}
			}
			.con {
				margin: 0.4rem 0.48rem 0.48rem;
				max-height: 6.666667rem;
				font-size: 0.373333rem;
				line-height: 0.533333rem;
				overflow-y: auto;
				color: #666;
				word-break: break-all;
			}
			.btn {
				color: #dd2726;
				border-radius: 0 0 3px 3px;
				line-height: 1.36rem;
				border-top: 1px solid #EBEBEB;
				width: 100%;
				text-align: center;
				font-size: 0.4rem;
			}
		}
	}
}
</style>