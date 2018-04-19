<template>
  <div class="sign" :class="[res.ThemeColor=='orange' ? 'm-orange' : '',res.ThemeColor=='pink'?'m-pink':'',res.ThemeColor=='green'?'m-green':'']">
    <scroll class="home-content" ref="scroll"
    :data="[...userList]" 
		:listenScroll="true" :pulldown="true" @pullingDown="refresh">
      <div class="bg-f0">
        <div class="header">
          <img class="bg" :src="res.BackGroundImg" alt="">
          <div class="who">
            <div class="avatar"><img :src="res.CustomerHeadPath" alt=""></div>
            <div class="txt">
              <p class="p1">{{res.NickName}}</p>
              <p class="p2" v-if="res.IsSign==0">您今天还未签到</p>
              <p class="p2" v-if="res.IsSign==1">您今天是第<span>{{res.TodayOrder}}</span>位签到</p>
              <p class="p3">已连续签到<span>{{res.SignDay}}</span>天</p>
            </div>
            <div class="tips" @click="ruleshow=true">签到规则</div>
          </div>
          <div class="content-box">
            <div class="content" v-if="res.IsShowANum==0">今天<span> {{res.TodayCount}} </span>人已签到</div>
          </div>
          <div class="time" v-if="res.IsShowATime==0">
            <div class="time-box">活动时间：<em>{{res.BeginTime}}</em> 至 <em>{{res.EndTime}}</em></div>
          </div>
        </div>
        <div class="page-bg">
          <!-- 签到日历 -->
          <div style="pointer-events:inherit;">
            <div id="rili"></div>
          </div>
          <!-- 用户展示 -->
          <!-- {{res.MessageList.length}} -->
          <div class="user-wrapper" v-if="MessageListFlag">
            <swiper auto loop height="62px" direction="vertical" :interval="3000" :show-dots="false">
              <swiper-item v-for="(item, index) in res.MessageList" :key="index">
                <div class="user">
                  <div class="face"><img :src="item.HeadImg" alt=""></div>
                  <div class="txt">
                    <div class="p1">{{item.CustomerNickName}}</div>
                    <div class="p2">{{item.Text}}</div>
                  </div>
                </div>
              </swiper-item>
            </swiper>
          </div>
        </div>
        <div v-for="(item, index) in SignExpandData" :key="index">
            <!-- 图片广告 -->
            <div class="page-tu" v-if="item.Type==0&&item.CssStyle==1">
                <div class="tu" v-for="(itemImg, indx) in item.ProductList" :key="indx">
                    <a :href="itemImg.Url==''?'javascript:;':itemImg.Url"><img :src="itemImg.PicUrl"></a>
                </div>
            </div>
            <div class="tu-swiper" v-if="item.Type==0&&item.CssStyle==0">
                <swiper style="width:100%;margin:0 auto;" :auto="true" :loop="true" :aspect-ratio="60/100" dots-position="center" dots-class="vux-dots">
                <swiper-item v-for="(item, index) in item.ProductList" :key="index">
                    <a :href="item.Url==''?'javascript:;':item.Url">
                        <img :src="item.PicUrl" alt="">
                    </a>
                </swiper-item>
                </swiper>
            </div>
            <!-- 空白条 -->
            <div class="index-blank" v-if="item.Type==7" v-bind:style="{height:item.Height+'px'}"></div>
            <!-- 商品推荐 -->
            <goods-list v-if="item.Type==2" :goodList="item"></goods-list>
        </div>
        <!-- 底部版权 -->
        <div class="copy-container">
          <copy-right></copy-right>
        </div>
      </div>
    </scroll>
    <!-- 规则详情 -->
    <rule v-if="ruleshow" :ruleshow="ruleshow" :resRule="res.Rule" :registrationRemark="res.RegistrationRemark" :personalCenterUrl="res.PersonalCenterUrl" v-on:ruleshow="ruleshow=false"></rule>
    <!-- 补签 -->
    <div class="side-buqian" id="side-buqian" v-if="res.IsSignature==1"
    @click="side_retroactive" v-light>
        <div v-if="res.SupplyCardNum>0&&res.IsMiss==1">
            <span class="repair-link" @click="repair_link"> 可补签 </span>
        </div>
        <div v-else>
            <span class="repair-link" @click="repair_link"> 补签卡 <span>{{res.SupplyCardNum}}</span></span>
        </div>
    </div>
    <div class="signbtn">
      <span  :class="[res.IsSign==0 ? 'on' : '']" @click="signbtn">
        <img src="~common/imgs/signbtn.png" v-if="res.IsSign==1&&res.ThemeColor=='orange'">
        <img src="~common/imgs/signbtn-white.png" v-if="res.IsSign==1&&res.ThemeColor!='orange'">
        
        <em v-if="res.IsSign==0">立即签到</em>
        <em v-if="res.IsSign==1">已签到</em>
      </span>
    </div>
  </div>
</template>
<script>
    import {Swiper, SwiperItem} from 'vux'
    import Rule from 'components/rule/rule'
    import CopyRight from 'components/copy-right/copy-right'
    import {addClass, removeClass} from 'common/js/dom'
    import GoodsList from 'components/goods-list/goods-list'
    import Scroll from 'components/scroll/scroll'
    import 'common/plugins/kalendae/kalendae.standalone.js'
    import 'common/plugins/kalendae/kalendae.css'
    import {getSignActInfo, getSignExpand, getSign,setSign} from 'services/signApi'
    import wxMixin from '@/mixins/wxMixin'
	export default {
    mixins: [wxMixin],
		data: () => ({ 
            userList: '',
            ruleshow:false,//签到规则组件显示隐藏
            signState:true,//签到按钮展开状态
            signType:false,//是否签到
            scrollY: 0,
            res:'',
            dateYear:'',
            dateMonth:'',
            SignExpandData:'',
            MessageListFlag:false
		}),
        computed: {
        
        },
        watch: {

        },
        created() {
          this.$vux.loading.show({text: 'Loading'})
          this.aid = this.$route.query.aid;
        },
        mounted() {
            var that = this;
            that.getSignActInfoApi();
            that.getSignExpandApi();
            that.getSignApi();
            //签到侧栏默认展开
            setTimeout(function(){
                that.signState = false;
            },3000)
            that.initKalendae();
        },
        methods: {
            getSignApiFn:function(){
                if(this.dateMonth.toString().length==1){
                    this.dateMonth = "0"+this.dateMonth;
                };
                getSign(this.aid,this.dateYear + "-"+this.dateMonth).then(res => {
                   var that =this;
                    if(res.return_code === 0){
                        var dataArr = [];
                        for(var i=0;i<res.return_data.length;i++){
                            if(res.return_data[i].IsPrize==1){
                                dataArr[i] = {
                                    time:res.return_data[i].Days,
                                    kind:'gi'
                                }
                            }else if(res.return_data[i].IsPrize==0&&res.return_data[i].SignType==1){
                                dataArr[i] = {
                                    time:res.return_data[i].Days,
                                    kind:'on'
                                }
                            }else if(res.return_data[i].IsPrize==0&&res.return_data[i].SignType==2){
                                dataArr[i] = {
                                    time:res.return_data[i].Days,
                                    kind:'bu'
                                }
                            }
                        }
                        that.userList = dataArr;
                        that.setSign(dataArr);
                    }
                }).catch(error => {
                    this.$vux.toast.text('网络连接失败，请稍后<br/>重试');
                })	
            },
            getSignApi:function(){//获取已经签到信息 根据月份筛选
                var that = this;
                var dateTime=new Date;  
                that.dateYear=dateTime.getFullYear();   
                that.dateMonth=dateTime.getMonth()+1;
                if(that.dateMonth.toString().length==1){
                    that.dateMonth = "0"+that.dateMonth;
                };
                getSign(that.aid,that.dateYear + "-"+that.dateMonth).then(res => {
                    if(res.return_code === 0){
                        var dataArr = [];
                        for(var i=0;i<res.return_data.length;i++){
                            if(res.return_data[i].IsPrize==1){
                                dataArr[i] = {
                                    time:res.return_data[i].Days,
                                    kind:'gi'
                                }
                            }else if(res.return_data[i].IsPrize==0&&res.return_data[i].SignType==1){
                                dataArr[i] = {
                                    time:res.return_data[i].Days,
                                    kind:'on'
                                }
                            }else if(res.return_data[i].IsPrize==0&&res.return_data[i].SignType==2){
                                dataArr[i] = {
                                    time:res.return_data[i].Days,
                                    kind:'bu'
                                }
                            }
                        }
                        that.userList = dataArr;
                        
                        
                        that.setSign(dataArr);
                        var previous_btn = document.getElementsByClassName("k-btn-previous-month"); 
                        var caption_date = document.getElementsByClassName("k-caption");
                        // 上一个月点击
                        if(previous_btn[0]){
                            previous_btn[0].onclick = function(){ 
                                that.$vux.loading.show({text: 'Loading'});
                                if(caption_date[0].innerText.length==7){
                                    that.dateYear = parseInt(caption_date[0].innerText.substring(0,4));
                                    that.dateMonth = parseInt(caption_date[0].innerText.substring(5,6));
                                    
                                }else{
                                    that.dateYear = parseInt(caption_date[0].innerText.substring(0,4));
                                    that.dateMonth = parseInt(caption_date[0].innerText.substring(5,7));
                                }
                                that.dateMonth = that.dateMonth-1;
                                if(that.dateMonth==0){
                                    that.dateMonth = 12;
                                    that.dateYear = that.dateYear-1;
                                }
                                that.getSignApiFn();
                            } 
                        }
                        // 下一个月点击
                        var next_btn = document.getElementsByClassName("k-btn-next-month"); 
                        if(next_btn[0]){
                            next_btn[0].onclick = function(){ 
                                that.$vux.loading.show({text: 'Loading'});
                                if(caption_date[0].innerText.length==7){
                                    that.dateYear = parseInt(caption_date[0].innerText.substring(0,4));
                                    that.dateMonth = parseInt(caption_date[0].innerText.substring(5,6));
                                    
                                }else{
                                    that.dateYear = parseInt(caption_date[0].innerText.substring(0,4));
                                    that.dateMonth = parseInt(caption_date[0].innerText.substring(5,7));
                                }
                                that.dateMonth = that.dateMonth+1;
                                if(that.dateMonth==13){
                                    that.dateMonth = 1;
                                    that.dateYear = that.dateYear+1;
                                }
                                that.getSignApiFn();
                            } 
                        }
                        
                    }
                }).catch(error => {
                    this.$vux.toast.text('网络连接失败，请稍后<br/>重试');
                })	
            },
            getSignActInfoApi:function(){//获取签到信息接口
                getSignActInfo(this.aid).then(res => {
                    if(res.return_code === 0){
                        var that = this;
                        that.res = res.return_data;
                        if(that.res.MessageList.length!=0){that.MessageListFlag = true;}
                        document.title = res.return_data.Title;
                        if(that.res.IsSignature==1){
                            setTimeout(function(){that.side_retroactive();},5)
                        }
                    }
                }).catch(error => {
                    this.$vux.toast.text('网络连接失败，请稍后<br/>重试');
                })	
            },
            getSignExpandApi:function(){//签到拓展信息接口
                getSignExpand(this.aid).then(res => {
                    if(res.return_code === 0){
                        this.SignExpandData = res.return_data;
                    }
                }).catch(error => {
                    this.$vux.toast.text('网络连接失败，请稍后<br/>重试');
                })	
            },
            refresh() {
                clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    var that = this;
                    this.$vux.loading.show({text: 'Loading'});
                    that.getSignActInfoApi();
                    that.getSignExpandApi();
                    that.getSignApi();
                    this.$refs.scroll.finishPullDown();
                }, 20)
            },
            // 补签卡点击
            repair_link:function(){
                this.$router.push("/signrepair?aid="+this.aid);
            },
            //签到按钮点击
            signbtn:function(){
                var that = this;
                if (that.flag) return;
                if(that.res.IsSign==0){
                  this.$vux.loading.show({text: 'Loading'});
                  that.flag = true;
                    setSign(that.aid).then(res => {
                        that.flag = false;
                        if(res.return_code === 0){
                            that.toast(res.return_data);
                            that.getSignActInfoApi();
                            that.getSignApi();
                        }
                    }).catch(error => {
                        this.$vux.toast.text('网络连接失败，请稍后<br/>重试');
                    })	
                }
            },
            // 签到默认弹框
            toast:function(setSignData){
                var that = this;
                var content='';
                content+= '<div class="con">';
                for(var i = 0;i<setSignData.length;i++){
                  if(i==0){
                    content+='<div>您今天已获得的奖励如下：</div>';
                    content+='<ul class="award">';
                    if(setSignData[i].Point>0||setSignData[i].Point_ts>0){
                      var pointNum = setSignData[i].Point + setSignData[i].Point_ts;
                      content+='<li><span class="fc-orange">'+pointNum+'</span>积分</li>'
                    }if(setSignData[i].Gold>0||setSignData[i].Gold_ts>0){
                      var goldNum = setSignData[i].Gold+setSignData[i].Gold_ts;
                      content+='<li><span class="fc-orange">'+goldNum+'</span>金币</li>'
                    }if(setSignData[i].ShopVouAmount>0){
                      content+='<li><span class="fc-orange">'+setSignData[i].ShopVouAmount+'</span>元购物券</li>'
                    }if(setSignData[i].HBAmount>0){
                      if(setSignData[i].WxHbType==0){
                        if(setSignData[i].HBSend==1){
                          content+='<li><span class="fc-orange">'+setSignData[i].HBAmount+'</span>元微信红包（请到公众号里领取）</li>';
                        }else{
                          content+='<li><span class="fc-orange">'+setSignData[i].HBAmount+'</span>元微信红包（红包在途中迷路了，请联系客服获取。）</li>';
                        }
                      }else{
                        if(setSignData[i].HBSend==1){
                          content+='<li><span class="fc-orange">'+setSignData[i].HBAmount+'</span>元红包零钱（请到个人中心里领取）</li>';
                        }else{
                          content+='<li><span class="fc-orange">'+setSignData[i].HBAmount+'</span>元红包零钱（红包在途中迷路了，请联系客服获取。）</li>';
                        }
                      }
                    }if(setSignData[i].ProductID!=0){
                      content+='<li>'+setSignData[i].ProductName;
                      if(setSignData[i].ProductLink!=null&&setSignData[i].ProductLink!=""&&setSignData[i].IsUnionCoupons!=1){
                        content+='（请到个人中心我的奖品里领取）<a href='+setSignData[i].ProductLink+' class="fc-blue">立即领取>></a>';
                      }
                      if(setSignData[i].ProductLink!=null&&setSignData[i].ProductLink!=""&&setSignData[i].IsUnionCoupons!=0){
                        content+='（请到个人中心我的奖品查看到账情况）<a href='+setSignData[i].ProductLink+' class="fc-blue">查看>></a>';
                      }
                      content+='</li>';
                    }if(setSignData[i].ShopVouAmount_ts>0){
                      content+='<li><span class="fc-orange">'+setSignData[i].ShopVouAmount_ts+'</span>元购物券</li>'
                    }if(setSignData[i].HBAmount_ts>0){
                      if(setSignData[i].WxHbType_ts==0){
                        if(setSignData[i].HBSend_ts==1){
                          content+='<li><span class="fc-orange">'+setSignData[i].HBAmount_ts+'</span>元微信红包（请到公众号里领取）</li>';
                        }else{
                          content+='<li><span class="fc-orange">'+setSignData[i].HBAmount_ts+'</span>元微信红包（红包在途中迷路了，请联系客服获取。）</li>';
                        }
                      }else{
                        if(setSignData[i].HBSend_ts==1){
                          content+='<li><span class="fc-orange">'+setSignData[i].HBAmount_ts+'</span>元红包零钱（请到个人中心里领取）</li>';
                        }else{
                          content+='<li><span class="fc-orange">'+setSignData[i].HBAmount_ts+'</span>元红包零钱（红包在途中迷路了，请联系客服获取。）</li>';
                        }
                      }
                    }if(setSignData[i].ProductID_ts!=0){
                      content+='<li>'+setSignData[i].ProductName_ts;
                      if(setSignData[i].ProductLink_ts!=null&&setSignData[i].ProductLink_ts!=""&&setSignData[i].IsUnionCoupons_ts!=1){
                        content+='（请到个人中心我的奖品里领取）<a href='+setSignData[i].ProductLink_ts+' class="fc-blue">立即领取>></a>';
                      }
                      if(setSignData[i].ProductLink_ts!=null&&setSignData[i].ProductLink_ts!=""&&setSignData[i].IsUnionCoupons_ts!=0){
                        content+='（请到个人中心我的奖品查看到账情况）<a href='+setSignData[i].ProductLink_ts+' class="fc-blue">查看>></a>';
                      }
                      content+='</li>';
                    }
                    content+='</ul>';
                  }else{
                    if(setSignData[i].isWinning==-1&&setSignData[i].isWinning_ts==-1){
                    }else{
                      if(setSignData[i].isWinning_ts==0){
                        content+='<div>'+setSignData[i].nextDay+'签到，就能获得：</div>';
                      }else{
                        content+='<div>再继续签到'+setSignData[i].nextDayNum+'天,就能获得：</div>';
                      }
                      content+='<ul class="award">';
                      if(setSignData[i].Point>0){
                        content+='<li><span class="fc-orange">'+setSignData[i].Point+'</span>积分</li>';
                      }if(setSignData[i].Point_ts>0){
                        content+='<li><span class="fc-orange">'+setSignData[i].Point_ts+'</span>积分</li>';
                      }if(setSignData[i].Gold>0){
                        content+='<li><span class="fc-orange">'+setSignData[i].Gold+'</span>金币</li>';
                      }if(setSignData[i].Gold_ts>0){
                        content+='<li><span class="fc-orange">'+setSignData[i].Gold_ts+'</span>金币</li>';
                      }if(setSignData[i].ShopVouAmount>0){
                        content+='<li><span class="fc-orange">'+setSignData[i].ShopVouAmount+'</span>元购物券</li>';
                      }if(setSignData[i].hbType==1){
                        if(setSignData[i].IsHbShow==1){
                          if(setSignData[i].HBAmount>0){
                            if(setSignData[i].WxHbType==0){
                              content+='<li><span class="fc-orange">'+setSignData[i].HBAmount+'</span>元微信红包</li>';
                            }else{
                              content+='<li><span class="fc-orange">'+setSignData[i].HBAmount+'</span>元红包零钱</li>';
                            }
                          }
                        }else{
                          if(setSignData[i].HBAmount>0){
                            if(setSignData[i].WxHbType==0){
                              content+='<li><span class="fc-orange">1</span>个微信红包</li>';
                            }else{
                              content+='<li><span class="fc-orange">1</span>个红包零钱</li>';
                            }
                          }
                        }
                      }else{
                        if(setSignData[i].IsHbShow==1){
                          if(setSignData[i].HBAmountMax>0){
                            if(setSignData[i].WxHbType==0){
                              content+='<li><span class="fc-orange">'+setSignData[i].HBAmountMin+'</span>~<span class="fc-orange">'+setSignData[i].HBAmountMax+'</span>元微信红包</li>';
                            }else{
                              content+='<li><span class="fc-orange">'+setSignData[i].HBAmountMin+'</span>~<span class="fc-orange">'+setSignData[i].HBAmountMax+'</span>元红包零钱</li>';
                            }
                          }
                        }else{
                          if(setSignData[i].HBAmountMax>0){
                            if(setSignData[i].WxHbType==0){
                              content+='<li><span class="fc-orange">1</span>个微信红包</li>';
                            }else{
                              content+='<li><span class="fc-orange">1</span>个红包零钱</li>';
                            }
                          }
                        }
                      }if(setSignData[i].ProductID!=0){
                        content+='<li>'+setSignData[i].ProductName;
                        if(setSignData[i].ProductLink!=null&&setSignData[i].ProductLink!=""){
                          content+='<a href='+setSignData[i].ProductLink+' class="fc-blue">立即领取>></a>';
                        }
                        content+='</li>';
                      }if(setSignData[i].ShopVouAmount_ts>0){
                        content+='<li><span class="fc-orange">'+setSignData[i].ShopVouAmount_ts+'</span>元购物券</li>'
                      }if(setSignData[i].hbType_ts==0){
                        if(setSignData[i].IsHbShow_ts==1){
                          if(setSignData[i].HBAmount_ts>0){
                            if(setSignData[i].WxHbType_ts==0){
                              content+='<li><span class="fc-orange">'+setSignData[i].HBAmount_ts+'</span>元微信红包</li>'
                            }else{
                              content+='<li><span class="fc-orange">'+setSignData[i].HBAmount_ts+'</span>元红包零钱</li>'
                            }
                          }
                        }else{
                          if(setSignData[i].HBAmount_ts>0){
                            if(setSignData[i].WxHbType_ts==0){
                              content+='<li><span class="fc-orange">1</span>个微信红包</li>'
                            }else{
                              content+='<li><span class="fc-orange">1</span>个红包零钱</li>'
                            }
                          }
                        }
                      }else{
                        if(setSignData[i].IsHbShow_ts==1){
                          if(setSignData[i].HBAmountMax_ts>0){
                            if(setSignData[i].WxHbType_ts==0){
                              content+='<li><span class="fc-orange">'+setSignData[i].HBAmountMin_ts+'</span>~<span class="fc-orange">'+setSignData[i].HBAmountMax_ts+'</span>元微信红包</li>'
                            }else{
                              content+='<li><span class="fc-orange">'+setSignData[i].HBAmountMin_ts+'</span>~<span class="fc-orange">'+setSignData[i].HBAmountMax_ts+'</span>元红包零钱</li>'
                            }
                          }
                        }else{
                          if(setSignData[i].HBAmountMax_ts>0){
                            if(setSignData[i].WxHbType_ts==0){
                              content+='<li><span class="fc-orange">1</span>个微信红包</li>'
                            }else{
                              content+='<li><span class="fc-orange">1</span>个红包零钱</li>'
                            }
                          }
                        }
                      }
                      if(setSignData[i].ProductID_ts!=0){
                        content+='<li>'+setSignData[i].ProductName_ts;
                        if(setSignData[i].ProductLink_ts!=null&&setSignData[i].ProductLink_ts!=""){
                          content+='<a href='+setSignData[i].ProductLink_ts+' class="fc-blue">立即领取>></a>';
                        }
                        content+='</li>';
                      }
                      content+='</ul>';
                    }
                  }
                }

                content+='<div class="hint"><span class="fc-red">* </span>如未关注公众号，需到微信服务通知里领取红包哦</div></div>';
                this.$layer.dialog({
                    title: ['您已签到'], 
                    content: content,
                    btn: ['知道了',this.res.BtnName],
                    shadeClose: false,
                })
                // 如果有btn
                .then(function (res){
                    if(res==1){
                        window.location.href = that.res.BtnUrl;
                    }
                })
            },
            // 签到点击
            side_sign:function(){
                var that = this;
                if(that.signState == false){
                    that.signState = true;
                    setTimeout(function(){
                        that.signState = false;
                    },3000)
                }
            },
            // 补签卡点击
            side_retroactive:function(){
                var that = this;
                if(!that.retroactiveType){
                    var odiv = document.getElementById('side-buqian');
                    var timer = null;
                    var itarget = Math.ceil(100% - odiv.offsetWidth);
                    clearInterval(timer);//执行当前动画同时清除之前的动画
                    timer = setInterval(function(){
                        var speed = 0;
                        if(odiv.offsetWidth > itarget){
                            speed = -1;
                        }
                        else{
                            speed = 1;
                        }
                        if(odiv.offsetWidth == itarget){
                            clearInterval(timer);
                        }
                        else{
                            odiv.style.marginLeft = -odiv.offsetWidth+speed+'px';
                            that.retroactiveType = true;
                            clearInterval(timer);
                            setTimeout(function(){
                                odiv.style.marginLeft = '0px';
                                that.retroactiveType = false;
                            },3000)
                        }
                    },30);
                } 
            },
            initKalendae() {
                let self = this
                let rili = document.getElementById('rili');
                new Kalendae(rili, {
                    months:1,
                    mode:'single',
                    cb() {self.setSign.call(self, this.userList)}
                });
            },
            setSign(dateAry) {
                var that = this;
                if(document.querySelector('.k-days')){
                    //设置已签到
                    var monuteday = document.querySelector('.k-days').childNodes;
                    for(var i = 0,n=monuteday.length;i<n;i++){
                        for(var k=0,j=that.userList.length;k<j;k++){
                            if(that.userList[k].time==monuteday[i].getAttribute('data-date')){
                                switch(that.userList[k].kind){
                                case 'bu':
                                    monuteday[i].className = monuteday[i].className+" bu";
                                    monuteday[i].innerHTML = '补';
                                break;
                                case 'on':
                                    monuteday[i].className = monuteday[i].className+" on";
                                break;
                                case 'gi':
                                    monuteday[i].className = monuteday[i].className+" gi";
                                    monuteday[i].innerHTML = '';
                                break;
                                }
                            }             
                        };
                    }
                    //删除
                    this.$nextTick(() => {
                        let spanClass = document.querySelectorAll('#rili .kalendae .k-days span')[35].getAttribute('class')
                        if(/k-out-of-month/.test(spanClass)){
                            addClass(document.querySelector('#rili .kalendae .k-days'), 'hidelast')
                        }else{
                            removeClass(document.querySelector('#rili .kalendae .k-days'), 'hidelast')
                        }
                    })
                }
            }
        },
        components: {
            Swiper,
            SwiperItem,
            Rule,
            CopyRight,
            GoodsList,
            Scroll
        }
    }
</script>

<style lang="scss">
@import '~common/scss/mixin';
.sign {
  background: #fffce5;
  .home-content{
    position: fixed;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #fffce5;
    .pulldown-wrapper{
      .before-trigger{
        color:#666;
      }
    }
    .bg-f0{
      background-color: #fffce5;
      .header {
        position: relative;
        z-index: 1;
        height: 0;
        padding-bottom: 81.25%;
        min-height: 300px;
        overflow: hidden;
        img.bg {
          width: 100%;
          height: 100%;
          position: absolute;
          z-index: -1;
          left: 0;
          top: 0;
        }
        .who {
          display: flex;
          padding-top: 0.56rem;
          .avatar {
            margin-left: 8%;
            width: 73.2px;
            height: 73.2px;
            border: 2.4px solid #fff;
            border-radius: 50%;
            overflow: hidden;
            img {
              display: block;
              width: 100%;
              height: 100%;
            }
          }
          .txt {
            width: 44%;
            padding-left: 2.5%;
            padding-top: 1.5%;
            color: #fff;
            .p1 {
              margin-bottom: 4.8px;
              color: #fff;
              font-size: 16px;
              @include ellipsis();
            }
            .p2 {
              line-height: 21.6px;
              white-space: nowrap;
              width: 95%;
              font-size: 14.4px;
            }
            .p3 {
              line-height: 21.6px;
              white-space: nowrap;
              width: 95%;
              margin-bottom: 0px;
              font-size: 14.4px;
            }
            span {color: #ffe63c;}
          }
          .tips {
            margin-left: 0.4rem;
            width: 22%;
            height: 30px;
            line-height: 30px;
            text-align: center;
            background: #df3121;
            border-radius: 3px;
            color: #fff;
            font-size: 14.4px;
            border: 1px solid #fff;
            background: rgba(255,255,255,.1);
          }
        }
        .content-box{
            margin: 3.2rem auto 0;
            height: 1.253333rem;
            text-align: center;
            .content {
                width: 8.533333rem;
                height: 1.253333rem;
                line-height: 1.253333rem;
                background: url(~common/imgs/howmany.png) no-repeat 0 center;
                background-size: 100%;
                font-size: 17px;
                color: #7e2226;
                display: inline-block;
                span {color: #e11425;}
            }
        }
        .time {
          text-align: center;
          .time-box{
            margin: 0.373333rem auto 0;
            font-size: 13px;
            padding: 4px 6px;
            line-height: 14px;
            font-style: normal;
            border-radius: 4px;
            box-shadow: 0 0 6px rgba(244,120,22,.8);
            background: #fff;
            display: inline-block;
          }
        }
        &::after {
          content: "";
          width: 100%;
          height: 58px;
          background: url(~common/imgs/sign-cloud-orange.png) repeat-x 0 0 / auto 58px;
          position: absolute;
          bottom: -1px;
          left: 0;
          z-index: -1;
        }
        @media screen and (max-width: 380px) and (min-width: 360px){
            .content-box{
                margin: 3.1rem auto 0;
            }
        }
        @media screen and (max-width: 360px) and (min-width: 340px){
            .content-box{
                margin: 3.2rem auto 0;
            }
            .time{
              .time-box{
                padding: 4px 4px;
                font-size: 12px;
                word-break: break-all;
              }
            }
        }
        @media screen and (max-width: 340px) and (min-width: 300px){
            .content-box{
                margin: 3.6rem auto 0;
            }
            .time{
              .time-box{
                padding: 4px 2px;
                font-size: 12px;
                word-break: break-all;
              }
            }
        }
      }
      .page-bg{
        background-color: #fffce5;
        padding-bottom: 1px;
      }
      .user-wrapper {
        background: #feeed0;
        margin: 12.6px 3% 10px;
        overflow: hidden;
        border-radius: 4px;
        padding: 9px 11px;
        .user {
          display: flex;
          .face {
            height: 60px;
            width: 60px;
            min-width: 60px;
            overflow: hidden;
            border-radius: 3.6px;
            img {
              display: block;
              width: 100%;
              height: 100%;
            }
          }
          .txt {
            margin-left: 13px;
            line-height: 15px;
            font-size: 13.2px;
            .p1 {
              margin-top: 8px;
              color: #f3751c;
            }
            .p2 {
              color: #915125;
              height: 30px;
              margin-top: 5px;
              @include ellipsis2();
            }
          }
        }
      }
      // 底部版权信息
      .copy-container{
        padding-bottom: 1.76rem;
      }
      // 图片广告
      .page-tu{
        width: 100%;
        margin-bottom: .32rem;
        img{
          width: 100%;
          height: auto;
          vertical-align: middle;
        }
      }
      //轮播图
      .tu-swiper{
          img{width: 100%;}
          .vux-dots{
              .vux-icon-dot{
                  width: 14px;
                  height: 2px;
                  background: rgba(0,0,0,.1);
              }
              .vux-icon-dot.active{
                  background: rgba(223,39,39,1);
              }
          }
      }
      // 空白条
      .index-blank{
        height: .266667rem;
      }
    }
  }
   // 补签
  .side-buqian{
    display: inline-block;
    position: fixed;
    left: 100%;
    bottom: 200px;
    z-index: 10;
    transition: margin 0.3s;
    -webkit-transition: margin 0.3s;
    margin-left: calc(100% - 100%);
    .repair-link{
      display: block;
      height: 30px;
      line-height: 30px;
      background: #f36a69;
      padding:0 5px;
      font-size: 15px;
      color: #fffee0;
      float: left;
      text-overflow:ellipsis; 
      white-space: nowrap; 
      overflow: hidden;
      span{
        color: #800c11;
      }
    }
  }
  .side-buqian.on{
    a{
      pointer-events:auto;
    }
  }
  .side-buqian:before{
    content: "";
    display: block;
    height: 30px;
    width: 35px;
    background: url(~common/imgs/buqian.png) no-repeat 0 0 / auto 30px;
    margin-left: -35px;float: left;
  }
  /*签到按钮*/
  .side-qiandao{
    position: fixed;
    right: 0;
    bottom: 120px;
    z-index: 3000;
    .in{
      position: relative;
      i{
        display: block;
        position: absolute;
        top: 0;
        background-image: url(~common/imgs/qiandaoEntry.png);
        background-repeat: no-repeat;
        background-size: auto 208px;
        height: 100%;
        transition: right 0.3s;
        -webkit-transition: right 0.3s;
      }
      a{
        display: block;
        position: absolute;
        top: 0;
        background-image: url(~common/imgs/qiandaoEntry.png);
        background-repeat: no-repeat;
        background-size: auto 208px;
        height: 100%;
        transition: right 0.3s;
        -webkit-transition: right 0.3s;
      }
    }
  }
  .side-qiandao.on{
    .in{
      a{
        transition-delay: 0.3s;
        -webkit-transition-delay: 0.3s;
      }
    }
  }
  .side-qiandao.close{
    .in{
      i{
        transition-delay: 0.3s;
        -webkit-transition-delay: 0.3s;
      }
    }
  }

  .side-qiandao.orange{
    .in{
      height: 60px;
      i{
        background-position: -111px -148px;
        width: 30px;
      }
      a{
        background-position: -14px -147px;width: 62px;
      }
    }
  }
  .side-qiandao.orange.already{
    .in{
      i{
        background-position: -272px -148px;
      }
      a{
        background-position: -176px -148px;
      }
    }
  }
  .side-qiandao.orange.on{
    .in{
      i{
        right: -30px;
      }
      a{
        right: 0;
      }
    }
  }
  .side-qiandao.orange.close{
    .in{
      i{
        right: 0px;
      }
      a{
        right: -62px;
      }
    }
  }
  // pink
  .side-qiandao.pink{
    .in{
      height: 70px;
      i{
        background-position: -103px -64px;
        width: 36px;
      }
      a{
        background-position: -8px -64px;
        width: 64px;
      }
    }
  }
  .side-qiandao.pink.already{
    .in{
      i{
        background-position: -266px -64px;
      }
      a{
        background-position: -171px -64px;
      }
    }
  }
  .side-qiandao.pink.on{
    .in{
      i{
        right: -36px;
      }
      a{
        right: 0;
      }
    }
  }
  .side-qiandao.pink.close{
    .in{
      right: 0px;
      i{
        right: 0px;
      }
    }
    a{
      right: -64px;
    }
  }
  // green
  .side-qiandao.green{
    .in{
      height: 45px;
      i{
        background-position: -113px 1px;
        width: 36px;
      }
      a{
        background-position: 1 1px;
        width: 106px;
      }
    }
  }
  .side-qiandao.green.already{
    .in{
      i{
        background-position: -273px 1px;
      }
      a{
        background-position: -159px 1px;
      }
    }
  }
  .side-qiandao.green.on{
    .in{
      i{
        right: -36px;
      }
      a{
        right: 0;
      }
    }
  }
  .side-qiandao.green.close{
    .in{
      right: 0px;
      i{
          right: 0px;
      }
    }
    a{
      right: -106px;
    }
  }

  // 签到按钮
  .signbtn{
    margin: .416rem 0 0px;
    background: #f3751c;
    padding: .304rem 0;
    text-align: center;
    position: fixed;
    left: 0;
    width: 100%;
    bottom: 0;
    z-index: 10;
    span{
      width: 44.3%;
      height: 1.024rem;
      line-height:1.024rem;
      text-align: center;
      background: #ffd88c;
      border-radius: .053333rem;
      color: #7e2226;
      font-size: .448rem;
      display: block;
      margin: 0 auto;
      vertical-align: middle;
      img{
        height: .416rem;
        vertical-align: baseline;
      } 
      .already{
        display: inline-block;
        vertical-align: top;
        width: .586667rem;
        height: .346667rem;
        margin-top: .293333rem;
      }
    }
    span.on{
      background: #ffde00;
    }
  }
  .signbtn.over-footer{
    background:#d2d2d2;
    color:#787070;
    span{
      background:none;
      color:#787070;
    }
  }



}
/* 粉红模板 */
.sign.m-pink {
  background: #FFF4F7;
  .home-content{
    background-color: #FFF4F7;
    .bg-f0{
      background-color: #FFF4F7!important;
      .header {
        .content {
          span {color: #FF4979;}
        }
        .time {
          .time-box{
            box-shadow: 0 0 5px rgba(255,69,122,.8);
          }
        }
        &::after {
          background-image: url(~common/imgs/sign-cloud-pink.png)!important;
        }
      }
      .page-bg{
        background-color: #FFF4F7!important;
      }
    }
  }
  
  .user-wrapper {
    background: #ffe5ec!important;
    .user {
      .txt {
        .p1 {
          color: #e11425!important;
        }
        .p2 {
          color: #666666!important;
        }
      }
    }
  }

  .signbtn{
    background-color: #fff;
    span{
      background-color: #ff457a;
      color: #fff;
    }
  }
}
/* 绿色模板 */
.sign.m-green {
  background: #40b891;
  .home-content{
    background-color: #e8fff8;
    .bg-f0{
      background-color: #e8fff8!important;
      .header {
        .content {
          span {color: #f26262;}
        }
        .time {
          .time-box{
            box-shadow: 0 0 5px rgba(64,184,146,.8);
          }
        }
        &::after {
          background-image: url(~common/imgs/sign-cloud-green.png)!important;
        }
      }
      .page-bg{
        background-color: #e8fff8!important;
      }
      .user-wrapper {
        background: #d1f4e7!important;
        .user {
          .txt {
            .p1 {
              color: #f26262!important;
            }
            .p2 {
              color: #666666!important;
            }
          }
        }
      }
    }
  }
  .signbtn{
    background-color: #fff;
    span{
      background-color: #ffd88c;
      color: #fff;
    }
    .on{
      background-color: #ffde00;
    }
  }
}
</style>