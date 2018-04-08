/*微信分享共用*/
import {getWxdata} from 'services/wxApi'

export default {
  data: () => ({ 
    
  }),
  computed: {
   
  },
  watch: {

  },
  created() {
    this.aid = this.$route.query.aid  //活动ID
    this.vid = this.$route.query.vid  //投票参选者ID
    this._wxShare()
  },
  mounted() {

  },
  methods: {
    //微信分享
    _wxShare() {
      let self = this
      let data
      getWxdata(this.aid, location.href, this.vid).then(res => {
        data = res.return_data
        self.$wechat.config({
          debug: true, // 开启调试模式
          appId: data.appid, // 必填，公众号的唯一标识
          timestamp: data.timestamp, // 必填，生成签名的时间戳
          nonceStr: data.noncestr, // 必填，生成签名的随机串
          signature: data.signature, // 必填，签名
          jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage', 
            'chooseImage', // 选择图片
            'uploadImage', // 上传图片至微信服务器
            'downloadImage', // 从微信服务器上下载图片
          ] 
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
  }
}