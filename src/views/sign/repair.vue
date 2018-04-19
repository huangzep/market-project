<template>
	<div class="repair">
		<div class="header">
			<img :src="pimg('supplyBg.png')" alt="">
			<p class="rule" @click="ruleshow=true">规则说明</p>
			<p class="title" v-if="res.SupplyCardNum!=0">你有{{res.SupplyCardNum}}张补签卡</p>
			<p class="title" v-else>你还没有补签卡</p>
			<p class="tips">可选最近5天进行补签,1张补签1天<br>可增加连续签到天数，补签卡本活动才有效喔！</p>
		</div>
		<p class="date">请选择补签日期</p>
		<div class="invite" v-if="res.SupplyCardNum==0">
			<div class="left">
				<p class="up">通过<span class="red">{{res.NeedPoint}}</span>积分兑换获得补签卡</p>
				<p class="down"><span>*</span>注意:补签卡保存上限为5张</p>
			</div>
			<div class="right" @click="convert">兑换</div>
		</div>
		<div class="sign-date-container" v-if="res.SupplyCardNum!=0">
			<sign-date v-on:retroactiveList="retroactiveListData" :repairData="repairData"></sign-date>
		</div>
		<div class="footer" v-if="res.SupplyCardNum!=0">
			<div class="how" @click="howMenus">如何获得补签卡</div>
			<div class="btn" :class="timeFlag?'on':''" @click="pointMenus">确认</div>
		</div>
		<menus ref="menus">
			<div class="invite-wrapper" v-if="retroactiveFlag">
				<div class="how-box">
					<p class="how">查看如何获得补签卡</p>
				</div>
				<div class="invite">
					<div class="left">
						<p class="up">通过<span class="red">{{res.NeedPoint}}</span>积分兑换获得补签卡</p>
						<p class="down"><span>*</span>注意:补签卡保存上限为5张</p>
					</div>
					<div class="right" @click="convert">兑换</div>
				</div>
			</div>			
			<div class="change" v-if="convertFlag">
				<div class="top">
					<div class="tup">积分兑换补签卡</div>
					<div class="tcard">
						<div class="txt">补签卡：</div>
						<div class="pack">
							<span class="minus" @click="minus">-</span>
							<span class="n">{{pnum}}</span>
							<span class="plus" @click="plus">+</span>
						</div>
					</div>
				</div>
				<div class="bottom">
					<div class="num">积分：<span>{{pnum*res.NeedPoint}}</span></div>
					<div class="btn" @click="exchange">兑换</div>
				</div>
			</div>
		</menus>	
		
		<!-- 规则详情 -->
    	<rule v-if="ruleshow" :repairFlag="repairFlag" :ruleshow="ruleshow" :resRule="res.Rule" :registrationRemark="res.RegistrationRemark" :personalCenterUrl="res.PersonalCenterUrl" v-on:ruleshow="ruleshow=false"></rule>
	</div>
</template>

<script>
	import SignDate from 'components/sign-date/sign-date'
	import Menus from 'components/menus/menus'
	import Rule from 'components/rule/rule'
	import {getSignActInfo, getSupplyInfo, getSupplyCard, setSupplySign} from 'services/signApi'

	export default {
		data: () => ({ 
			pnum: 1,
			ruleshow:false,//签到规则组件显示隐藏
			res:'',
			convertFlag:false,
			retroactiveFlag:true,
			timeFlag:false,
			timeArr:[],//补签日期
			repairData:false,//子组件是否重新请求
			repairFlag:true,
		}),
		computed: {
			
		},
		watch: {
			
		},
		created() {
			this.aid = this.getQueryString("aid");
			this.getSignActInfoApi();
		},
		mounted() {

		},
		methods: {
			convert:function(){
				this.convertFlag = true;
				this.retroactiveFlag = false;
				this.$refs.menus.show();
			},
			exchange:function(){
				if (this.flag) return;
				if(this.res.SupplyCardNum>=5){
					this.$vux.toast.text('一个活动最多兑换五张补签卡，你可兑的补签卡已达上限了！');
				}else{
					this.getSupplyCardApiBtn();
				}
			},
			setSupplySignApi:function(){
				this.$vux.loading.show({text: 'Loading'});
				this.pointMenusflag = true;
				setSupplySign(this.aid,this.timeArr.toString()).then(res => {
					this.pointMenusflag=false;
                    if(res.return_code === 0){
						this.timeFlag = false;
						this.$vux.toast.text('补签成功');
						if(this.repairData){
							this.repairData = false;
						}else{
							this.repairData = true;
						}
						this.getSignActInfoApi();
                    }
                }).catch(error => {
                    this.$vux.toast.text('网络连接失败，请稍后<br/>重试');
                })	
			},
			getSupplyCardApiBtn:function(){//兑换补签卡
				this.$vux.loading.show({text: 'Loading'});
				this.flag = true
				getSupplyCard(this.aid,this.pnum).then(res => {
					this.flag = false
                    if(res.return_code === 0){
						this.pnum=1;
						this.$refs.menus.hide();
						this.$vux.toast.text('兑换成功');
						this.getSignActInfoApi();
                    }
                }).catch(error => {
                    this.$vux.toast.text('网络连接失败，请稍后<br/>重试');
                })	
			},
			getSignActInfoApi:function(){//获取签到信息接口
				this.$vux.loading.show({text: 'Loading'});
                getSignActInfo(this.aid).then(res => {
                    if(res.return_code === 0){
                        var that = this;
						that.res = res.return_data;
                        document.title = res.return_data.Title;
                    }
                }).catch(error => {
                    this.$vux.toast.text('网络连接失败，请稍后<br/>重试');
                })	
			},
			getQueryString:function(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
                var r = window.location.search.substr(1).match(reg); 
                if (r != null) return unescape(r[2]); return null; 
            },
			retroactiveListData:function(data){
				this.timeFlag = false;
				this.timeArr = [];
				for(var i = 0;i<data.length;i++){
					if(data[i].SignType==3){
						this.timeFlag = true;
						this.timeArr.push(data[i].Days)
					}
				}
			},
			howMenus() {
				this.$refs.menus.show()
			},
			pointMenus() {
				if (this.pointMenusflag) return;
				if(this.timeFlag){
					this.setSupplySignApi();
				}
			},
			minus() {
				if (this.pnum === 1) return;
				this.pnum--
			},
			plus() {
				if (this.pnum+this.res.SupplyCardNum >= 5) {
					this.$vux.toast.text('库存补签卡上限为5张')
					return;
				}
				this.pnum++
			}
		},
		components: {
			SignDate,
			Menus,
			Rule
		}
	}
</script>

<style lang="scss" scoped>
@import '~common/scss/mixin.scss';
.repair {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #fff;
	overflow-y: scroll;
	.header {
		position: relative;
		padding: 10px 0px 0;
		height: 242px;
		text-align: center;
		z-index: 1;
		img {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			z-index: -1;
		}
		.rule {
			line-height: 19px;
			font-size: 15px;
			color: #666;
			display: inline-block;
			position: absolute;
			top: 10px;
			right: 10px;
		}
		.title {
	    padding-top: 32px;
	    line-height: 31px;
	    color: #ffa800;
	    font-size: 24px;
		}
		.tips {
			line-height: 22.7px;
	    font-size: 15px;
	    padding-top: 10.7px;
	    color: #999;
		}		
	}
	.date {
		text-align: center;
		line-height: 19px;
    font-size: 16.4px;
    color: #666;
	}
	.invite {
		padding: 0.533333rem 0.266667rem 0;
		display: flex;
		justify-content: space-between;
		.left {
			.up {
				line-height: 31px;
				font-size: 15.6px;
				.red{color: red;}
			}
			.down {
				line-height: 21px;
				font-size: 12px;
				color: #999;
		    span {color: red;}
			}
		}
		.right {
	    padding: 8px 15px;
	    font-size: 15px;
	    line-height: 1;
	    height: 33px;
	    color: #dd2726;
      border-radius: 3.8px;
	    border: 1px solid #dd2726;
		}
	}
	.sign-date-container {
		padding-top: 0.4rem;
		padding-bottom: 1.493333rem;
	}
	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		border-top: 1px solid #e7e7e7;
		.how {
			width: 6.666667rem;
			height: 1.493333rem;
			line-height: 1.493333rem;
			font-size: 15px;
			color: #666;
			padding-left: 0.533333rem;
			position: relative;
			background-color: #fff;
			@include arrow-style(0.213333rem,0.026667rem,-135deg);
			&::after {
				position: absolute;
				right: 13px;
				top: 50%;
			}
		}
		.btn {
			flex: 1;
			line-height: 1.466667rem;
			background: #acacac;
			color: #fff;
	    font-size: 16.4px;
	    text-align: center;
	    &.on {
  	    background: #dd2726;
	    }
		}
	}
	.invite-wrapper {
		padding: 0.533333rem 0 0.8rem;
		.how-box{
			text-align: center;
			.how {
				display: inline-block;
				margin: 0 auto;
				line-height: 19px;
				color: #666666;
				font-size: 16px;
				padding-right: 25px;
				position: relative;
				@include arrow-style(0.213333rem,0.026667rem,45deg);
				&::after {
					position: absolute;
					right: 6px;
					top: 20%;
				}
			}
		}
	}
	.change {
		.top {
			padding: 0.533333rem 0.266667rem 0.8rem;
			.tup {
				text-align: center;
				line-height: 19px;
		    color: #666666;
		    font-size: 16px;
			}
			.tcard {
				display: flex;
				align-items: center;
				padding-top: 0.8rem;
				font-size: 0.4rem;
				.txt {}
				.pack {
					margin-left: 0.266667rem;
					display: flex;
					.minus, .plus {
						border-radius: 5px 0 0 5px;
				    border: 1px solid #ededed;
				    line-height: 31px;
				    height: 31px;
				    min-width: 30px;
				    padding: 0 5px;
				    text-align: center;
					}
					.minus, .plus {
						border-radius: 5px 0 0 5px;
					}
					.n {
						line-height: 31px;
						min-width: 30px;
						padding: 0 5px;
				    text-align: center;
					}
					.plus {
						border-radius: 0 5px 5px 0;
					}
				}
			}
		}
		.bottom {
			display: flex;
			border-top: 1px solid #e7e7e7;
			font-size: 0.426667rem;
			.num {
				width: 6.666667rem;
				height: 1.493333rem;
				line-height: 1.493333rem;
				font-size: 15px;
				color: #666;
				padding-left: 0.533333rem;
				span {color: #dd2726;}
			}
			.btn {
				flex: 1;
				line-height: 1.466667rem;
				color: #fff;
		    font-size: 16.4px;
		    text-align: center;
	  	  background: #dd2726;
			}
		}
	}
}
</style>