/*活动页面共用*/
import Confirm from 'components/confirm/confirm'
import Inform from 'components/inform/inform'
import CopyRight from 'components/copy-right/copy-right'
import {getWxdata} from 'services/wxApi'
import {getActivityInfo} from 'services/cardActApi'
import {difSeconds} from 'common/js/util'
import {timeOut, timeIn} from 'common/js/util'
import moment from 'moment'

export default {
  data: () => ({ 
    res: {},
    actionId: 0,
    hasCancel: false,
    confirmContent: '',
    confirmBtnText: '确认',
    cancelBtnText: '取消',
    infoTitle: '',
    infoContent: '',
    prizeList: [],
    messageList: [],
    canPlay: true,
    endMsg: '',
    ishavepoint: true,
    isBefore: false,
    isDayOut: false,
    isLimitVip: false,
    isLimitLabel: false,
  }),
  computed: {
   templateClass() {
    return this.res.BackgroundTemplate ? 'm-' + this.res.BackgroundTemplate : 'm-red'
   },
   bgImg() {
    return this.res.Background
   }
  },
  watch: {

  },
  created() {
    this.aid = this.$route.query.aid
    this.$vux.loading.show({text: 'Loading'})
    this._getAll()
    this._wxShare()
  },
  mounted() {

  },
  methods: {
    _getAll() {
      getActivityInfo(this.aid).then(res => {
        if (res.return_code === 0) {
          this.res = res.return_data
          this.prizeList = res.return_data.PrizeList
          this.messageList = res.return_data.MessageList
          document.title = this.res.Title
          if (!timeOut(this.res.StartDateTime)) {
            this.canPlay = false
            this.isBefore = true
            this.showBefore(this.res.StartDateTime)
            return;
          }
          if (this.res.TimeStartDateTime) {
            this.canPlay = timeIn(this.res.TimeStartDateTime, this.res.TimeEndDateTime)
            this.isDayOut = !this.canPlay
            this.limitTime(this.res.TimeStartDateTime, this.res.TimeEndDateTime)
            return; 
          }
          //会员限制
          if ((this.res.IsMembers === 0) && (this.res.LimitType === 1)) {
            this.canPlay = false
            this.isLimitVip = true
            this.limitVip(this.res.MemberList)
            return;
          }
          //标签限制
          if ((this.res.IsMembers === 0) && (this.res.LimitType === 2)) {
            this.canPlay = false
            this.isLimitLabel = true
            this.limitLabel(this.res.LimitExplain)
            return;
          }
        }
      })
    },
    showInfo(text) {
      this.infoTitle = '活动说明'
      this.infoContent = text
      this.$refs.inform.show()
    },
    showBefore(startTime, endTime) {
      this.actionId = 0
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.confirmContent = difSeconds(startTime, endTime)
        if (this.confirmContent === 'over') {
          this.$refs.confirm.hide()
          this.canPlay = true
          this.isBefore = false
          clearInterval(this.timer)
        }
      }, 1000)
      this.confirmBtnText = '知道了'
      this.confirmContent = difSeconds(startTime, endTime)
      this.$refs.confirm.show()
    },
    showEnd(msg) {
      this.actionId = 0
      this.hasCancel = false
      this.confirmBtnText = '确定'
      this.confirmContent = msg
      this.$refs.confirm.show()
    },
    showWay() {
      this.actionId = 2
      this.hasCancel = true
      this.cancelBtnText = '取消'
      this.confirmBtnText = '去赚积分'
      this.confirmContent = '亲，您的积分不足哦~'
      this.$refs.confirm.show()
    },
    //开启日限制时间，弹框提示
    limitTime(start, end) {
      if (start && !timeOut(moment().format('YYYY-MM-DD') + ' ' + start)) {
        this.showBefore(moment().format('YYYY-MM-DD') + ' ' + start)
        return;
      }
      if (end && timeOut(moment().format('YYYY-MM-DD') + ' ' + end)) {
        this.showBefore(moment().format('YYYY-MM-DD') + ' ' + end, moment().add(1, 'day').format('YYYY-MM-DD') + ' ' + start)
        return;
      }
    },
    limitVip(list) {
      this.actionId = 13
      this.hasCancel = true
      this.cancelBtnText = '知道了'
      this.confirmBtnText = '会员中心'
      this.confirmContent = `<h4>本活动仅限以下会员参与</h4><div style="padding: 10px 40px;display: flex; flex-wrap: wrap; justify-content: center; align-items:center;color: #ff9933; line-height: 23px; font-size: 15px;">`
      list.forEach((n, i) => {
        this.confirmContent += `<span style="min-width:80px;">${n.Name}</span>`
      })
      this.confirmContent += `</div>`
      this.$refs.confirm.show()
    },
    limitLabel(explain) {
      this.actionId = 13
      this.hasCancel = true
      this.cancelBtnText = '知道了'
      this.confirmBtnText = '会员中心'
      this.confirmContent = `<h4>本活动限制说明</h4><div style="padding: 10px;color: #ff9933; line-height: 23px; font-size: 15px;">${explain}</div>`
      this.$refs.confirm.show()
    },
    disable() {
      //活动未开始弹框
      if (this.isBefore) {
        this.showBefore(this.res.StartDateTime)
        return;
      }
      //当天活动时间未开始
      if (this.isDayOut) {
        this.limitTime(this.res.TimeStartDateTime, this.res.TimeEndDateTime)
        return;
      }
      //会员限制
      if (this.isLimitVip) {
        this.limitVip(this.res.MemberList)
        return;
      }
      //标签限制
      if (this.isLimitLabel) {
        this.limitLabel(this.res.LimitExplain)
        return;
      }
      if (!this.ishavepoint) {
        this.showWay()
        return;
      }
      this.showEnd(this.endMsg)
    },
    showResult(pix, opts) {
      let prize = this.prizeList[pix]
      if (!prize.ID) {
        this.showSorry()
        return;
      }
      // 类型：0：产品 1：积分 2：购物券 3：微信红包 4红包零钱  5联盟卡券
      if (prize.PrizeType === 0) {
        this.productId = opts.productId
        this.showProduct(prize)
        return;
      }
      if (prize.PrizeType === 1) {
        this.showPoint(prize, opts.msg)
        return;
      }
      if (prize.PrizeType === 2) {
        this.showCoupon(prize, opts.msg)
        return;
      }       
      if (prize.PrizeType === 3) {
        this.showHB(prize, '微信红包', opts.amount, opts.msg)
        return;
      }
      if (prize.PrizeType === 4) {
        this.showHB(prize, '红包零钱', opts.amount, opts.msg)
        return;
      }
      if (prize.PrizeType === 5) {
        this.showAliance(prize)
        return;
      }
    },
    showProduct(prize) {
      this.actionId = 10
      this.hasCancel = true
      this.cancelBtnText = '取消'
      this.confirmBtnText = '立即领取'
      this.confirmContent = 
      `<div class="card-prize-confirm">
        <h3 class="pname">${prize.Name}</h3>
        <h5 class="pt">您获得的奖励如下：</h5>
        <div class="pcon">
          <img src="${prize.AwardPicture}" alt="" >
          <p>
            ${prize.ProductName}
          </p>
          <span>x1</span>
        </div>
        <h6 class="ptip"><span>* </span>请到个人中心领取，需3天内领取，过期无效</h6>
       </div>`
      this.$refs.confirm.show()
    },
    showPoint(prize, msg) {
      this.actionId = 11
      this.hasCancel = true
      this.cancelBtnText = '查看我的积分'
      this.confirmBtnText = '立即使用'
      this.confirmContent = `<h4>${prize.Name}</h4><p style="text-align: left;">您获得的奖励如下：</p><p style="color: #FEAD60;text-align: left;padding-left: 0.266667rem;font-size: 0.346667rem;">${prize.ProductName}</p><p style="color: #ccc;font-size: 0.32rem;text-align: left;line-height: 0.346667rem;">${msg ? msg : ''}</p>`
      this.$refs.confirm.show()
    },
    showCoupon(prize, msg) {
      this.actionId = 12
      this.hasCancel = true
      this.cancelBtnText = '查看购物券'
      this.confirmBtnText = '立即使用'
      this.confirmContent = `<h4>${prize.Name}</h4><p style="text-align: left;">您获得的奖励如下：</p><p style="color: #FEAD60;text-align: left;padding-left: 0.266667rem;font-size: 0.346667rem;">${prize.ProductName}</p><p style="color: #ccc;font-size: 0.32rem;text-align: left;line-height: 0.346667rem;">${msg ? msg : ''}</p>`
      this.$refs.confirm.show()
    },
    showHB(prize, HB, amount, msg) {
      this.actionId = 0
      this.hasCancel = false
      this.confirmBtnText = '知道了'
      this.confirmContent = `<h4>${prize.Name}</h4><p style="text-align: left;">您获得的奖励如下：</p><p style="color: #FEAD60;text-align: left;padding-left: 0.266667rem;font-size: 0.346667rem;">${HB}&nbsp;&nbsp;￥${amount}</p><p style="color: #ccc;font-size: 0.32rem;text-align: left;line-height: 0.346667rem;"><span style="color: red;">*&nbsp;</span>${msg ? msg : '请到微信公众号领取'}</p>`
      this.$refs.confirm.show()
    },
    showAliance(prize) {
      this.actionId = 14
      this.hasCancel = false
      this.confirmBtnText = '立即查看'
      this.confirmContent = 
      `<div class="card-prize-confirm">
        <h3 class="pname">${prize.Name}</h3>
        <h5 class="pt">您获得的奖励如下：</h5>
        <div class="pcon">
          <img src="${prize.AwardPicture}" alt="" >
          <p>
            ${prize.ProductName}
          </p>
          <span>x1</span>
        </div>
        <h6 class="ptip"><span>* </span>请到个人中心 - 我的奖品查看到账情况</h6>
       </div>`
      this.$refs.confirm.show()
    },
    //微信分享
    _wxShare() {
      let self = this
      let data
      getWxdata(this.aid, location.href).then(res => {
        data = res.return_data
        self.$wechat.config({
          debug: false, // 开启调试模式
          appId: data.appid, // 必填，公众号的唯一标识
          timestamp: data.timestamp, // 必填，生成签名的时间戳
          nonceStr: data.noncestr, // 必填，生成签名的随机串
          signature: data.signature, // 必填，签名
          jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage'] 
        })
        self.$wechat.ready(() => {
          self.$wechat.onMenuShareTimeline({ // 分享到朋友圈
            title: data.sharetext, // 分享标题
            link: data.sharelink, // 分享链接
            imgUrl: data.shareimg, // 分享图标
            success: function() {
              // 用户确认分享后执行的回调函数
            },
            cancel: function() {
              // 用户取消分享后执行的回调函数
            }
          });
          self.$wechat.onMenuShareAppMessage({ // 分享给朋友
            title: data.sharetitle,
            desc: data.sharetext,
            link: data.sharelink,
            imgUrl: data.shareimg,
          });
        })
      })
    },
  },
  components: {
    Confirm,
    Inform,
    CopyRight
  }
}