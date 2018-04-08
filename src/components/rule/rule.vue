<template>
    <div class="sign-rule" :class=" rules ? 'notSend' : 'send' ">
        <div v-if="!repairFlag">
            <div class="ruleTitle">
                签到规则
                
                <div class="ruleBtnBox">
                    <img src="~common/imgs/vote-search-cancel.png" @click="closerule" alt="">
                </div>
            </div>
            <img :src="pimg('ruleTopBg.png')" alt="">
            <div class="ruleDetail">
                <h1>签到规则：</h1>
                <div class="rule-list">
                    <div v-for="(item, index) in resRule" :key="index">
                        <p v-if="item.IsSpecial==0">{{index+1}}. 连续签到{{item.Day}}天,获得：</p>
                        <p v-if="item.IsSpecial==1">{{index+1}}. {{item.SpecialDate.substring(0,4)}}年{{item.SpecialDate.substring(5,7)}}月{{item.SpecialDate.substring(8,10)}}日签到可获得以下奖品：</p>
                        <ul class="award-list">
                            <li v-for="(items,indx) in item.Prizeinfo" :key="indx">
                                <div v-if="items.PrizeType === 0 ">
                                    <em class="point-red"></em>{{items.Name}};<span class="fc-999" v-if="items.Remark!=''&&items.Remark!=null">（{{items.Remark}}）</span>
                                </div>
                                <div v-else-if="items.PrizeType === 1 ">
                                    <em class="point-red"></em>{{items.Amount}}{{items.Name}}奖励；<span class="fc-999" v-if="items.Remark!=''&&items.Remark!=null">（{{items.Remark}}）</span>
                                </div>
                                <div v-else-if="items.PrizeType === 2 ">
                                    <em class="point-red"></em>{{items.Amount}}元{{items.Name}};<span class="fc-999" v-if="items.Remark!=''&&items.Remark!=null">（{{items.Remark}}）</span>
                                </div>
                                <div v-else-if="items.PrizeType === 3 ">
                                    <div v-if="items.IsHbShow==0"><em class="point-red"></em>{{items.Name}}1个;<span class="fc-999" v-if="items.Remark!=''&&items.Remark!=null">（{{items.Remark}}）</span></div>
                                    <div v-else>
                                        <em class="point-red"></em>
                                        <span v-if="items.HbType==1">{{items.MaxMoney}}元</span>
                                        <span v-if="items.HbType==0">{{items.MinMoney}}~{{items.MaxMoney}}元</span>
                                        {{items.Name}}
                                        <span class="fc-999" v-if="items.Remark!=''&&items.Remark!=null">（{{items.Remark}}）</span>
                                    </div>
                                    
                                </div>
                                <div v-else>
                                    <em class="point-red"></em>{{items.Amount}}{{items.Name}};<span class="fc-999" v-if="items.Remark!=''&&items.Remark!=null">（{{items.Remark}}）</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="shuoming">
                    <span class="fc-red">*</span>
                    注意:中途未签到，则连续天数归0，重新计算。积分、金币、购物券、微信红包,产品等奖品请到
                    <a :href="personalCenterUrl" class="fc-blue">个人中心查看&gt;&gt;</a>
                </div>
            </div>
            <div class="ruleDetail" v-if="registrationRemark">
                <h1>活动说明：</h1>
                <div class="rule-list">
                    <div>
                        <p>{{registrationRemark}}</p>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <div class="ruleTitle">
                补签卡规则
                <div class="ruleBtnBox">
                    <img src="~common/imgs/vote-search-cancel.png" @click="closerule" alt="">
                </div>
            </div>
            <img :src="pimg('ruleTopBg.png')" alt="">
            <div class="ruleDetail">
                <h1>补签卡规则：</h1>
                <div class="rule-list">
                    <p>1.每位用户,库存补签卡上限为5张;</p>
                    <p>2.每张补签卡只能补签最近五天的签到行为，且补签后，不补发签到奖励;</p>
                    <p>3.补签完成后，次日如果是连续签到奖励日期，可享受连续签到奖励;</p>
                    <p>例如:</p>
                    <p>1月4日签到,且已签到到1月1日，1月2日，其中1月3日漏签，可补签1月3日，显示补签，补签当天不补发签到奖励；</p>
                    <p>明天1月5日签到，系统判定连续签到5天，可享受五天连续签到奖励；</p>
                    <br>
                </div>
                <div class="shuoming">
                    <span class="fc-red">*</span>
                     注意：先补签再进行签到，当日如果是连续签到奖励日期，亦可享受连续签到奖励；
                </div>
            </div>
            <div class="ruleDetail">
                <h1>如何获得补签卡：</h1>
                <div class="rule-list">
                    <p>1.通过积分兑换获得补签卡，且最多可以兑换5张。</p>
                </div>
            </div>
            <div class="ruleDetail">
                <h1>如何使用补签卡：</h1>
                <div class="rule-list">
                    <p>1.点击需要补签的日期，即使用</p>
                </div>
            </div>
            <div class="ruleDetail">
                <h1>补签卡有效期：</h1>
                <div class="rule-list">
                    <p>1.补签卡持有上限数量为五张，活动获得的补签卡只能用于本次活动,活动结束后将会失效；</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	
	export default {
        props: [
            "resRule","personalCenterUrl","registrationRemark","repairFlag"
        ],
		data: () => ({ 
			rules:true
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
			closerule(){
                var that = this;
                that.rules = false;
                that.ruleshow = false;
                setTimeout(function(){
                    that.$emit('ruleshow', that.ruleshow);
                },500)
            }
		},
		components: {
		
		}
	}
</script>

<style lang="scss" scoped>
    @import '~common/scss/mixin';
    @keyframes rule-show{
        from {transform:scale(0,0);}
        to {transform:scale(1,1);}
    }
    @keyframes rule-hide{
        from {transform:scale(1,1);}
        to {transform:scale(0,0);}
    }
    .notSend {
        animation: rule-show 0.6s;
        transform-origin: top right;
    }
    .send{
        animation: rule-hide 0.6s;
        transform-origin: top right;
    }
    .sign-rule{
        position: fixed;
        width: 100%;
        height: 100%;
        top:0;
        right: 0;
        padding-bottom: .533333rem;
        background-color: #fff;
        z-index: 9999;
        overflow-y: scroll;
        .ruleTitle{
            line-height: .84rem;
            color: #f3751c;
            font-size: .605333rem;
            padding: .7392rem 0 1.84rem .773333rem;
            position: relative;
            .ruleBtnBox{
                position: absolute;
                right: 40px;
                top: 15px;
                z-index: 1;
                img{
                    width: 25px;
                }
            }
        }
        img{
            width:100%;
            position: absolute;
            top:0;
            left:0;
            z-index: -1;
        }
        .ruleDetail{
            padding: 0px .4rem .4rem;
            line-height: .706667rem;
            font-size: .4rem;
            word-break: break-all;
            h1{
                line-height: .789333rem;
                font-size: .4368rem;
                font-weight: bold;
                color: #f3751c;
            }
            .rule-list{
                .award-list{
                    li{
                        position: relative;
                        z-index: 0;
                        padding-left: 14px;
                        .point-red{
                            width: 4px;
                            height: 4px;
                            background: #dd2726;
                            border-radius: 50%;
                            display: inline-block;
                            margin: 0px 5px 0;
                            vertical-align: middle;
                            position: absolute;
                            left: 0;
                            top: .32rem;
                        }
                        .fc-999{
                            color: #999;
                        }
                    }
                }
            }
            .shuoming{
                line-height: .506667rem;
                padding-top: .066667rem;
                font-size: .32rem;
                color:#999;
                .fc-red {
                    color: #dd2726;
                }
                a{
                    text-decoration: underline;
                    color: #5d9bf1;
                }
            }
        }
    }
</style>