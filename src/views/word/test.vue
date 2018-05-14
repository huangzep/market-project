<template>
	<div class="test" style="background: #fff;height: 1000px;">
    <!-- <div class="" @click="change" style="height: 3434px;">
      {{res.a}}
    </div>
		<button @touchstart.prevent.stop="start" @touchend.prevent.stop="end"
		@contextmenu.prevent>按住说话</button> -->
    <!-- <button @click="end">结束说话</button> -->
		<!-- <button @click="play">播放语音</button>
    <button @click="translate">智能识别</button>
    <div class="">
      {{translateResult}}
    </div>
    <div class="verify-wrapper" style="padding-top: 100px;">
      <verify></verify>
    </div>
    <button @click="()=>{this.$refs.pop.show()}"></button>
    <pop ref="pop"></pop>
    <apply></apply>
 -->
    <ul>
      <li v-for="(item, index) in list" @click="click(item, index)" @touchstart="change"
      style="color: red;">
        {{computer}}
      </li>
    </ul>
    <input type="text" v-model="num" @change="change">
	</div>
</template>

<script>
	import actMixin from '@/mixins/actMixin'
	import {getWxdata} from 'services/wxApi'
  import Verify from 'components/verify/verify'
  import Pop from 'components/pop/pop'
  import Apply from '@/views/vote/vapply'

	export default {
		// mixins: [actMixin],
		data: () => ({ 
      localId: '',
			translateResult: '',
      res: {},
      state: {
        list: [3, 3, 4],
        islogin: false,
        info: {}
      },
      list: [],
      num: 0
		}),
    computed: {
     computer() {
      this.localId = 34
      return this.localId + 34;
     }
    },
    watch: {

    },
    created() {
    },
    mounted() {

    },
		methods: {
      change() {
        console.log(this.num)
        this.num = 34
      },
      click(item, index) {
      },
			_getAll() {

			},
			_wxShare() {
      let self = this
      let data
      getWxdata('ef825fa6-ce86-4fea-9a5d-f38b7e130d39', 'http://ac.miduonet.com/test?aid=ef825fa6-ce86-4fea-9a5d-f38b7e130d39&m=13800138000').then(res => {
        data = res.return_data
        self.$wechat.config({
          debug: true, // 开启调试模式
          appId: data.appid, // 必填，公众号的唯一标识
          timestamp: data.timestamp, // 必填，生成签名的时间戳
          nonceStr: data.noncestr, // 必填，生成签名的随机串
          signature: data.signature, // 必填，签名
          jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage', 'startRecord', 'stopRecord', 'playVoice', 'pauseVoice', 'stopVoice', 'translateVoice','chooseImage', // 选择图片
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
			start() {
				console.log('start')
				this.$wechat.startRecord()
			},
			end() {
				console.log('end')
        let self = this
				self.$wechat.stopRecord({
					success(res) {
						self.localId = res.localId
						console.log(self)
					}
				})
			},
			play() {
        let self = this
				self.$wechat.playVoice({
				    localId: self.localId // 需要播放的音频的本地ID，由stopRecord接口获得
				});
			},
      translate() {
        let self = this
        self.$wechat.translateVoice({
         localId: self.localId, // 需要识别的音频的本地Id，由录音相关接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: function (res) {
              console.log(res.translateResult); // 语音识别的结果
              self.translateResult = res.translateResult
          }
        });
      }
		},
		components: {
		  Verify,
      Pop,
      Apply
		}
	}
</script>

<style lang="scss" scoped>
* {
  -webkit-touch-callout:none;
  -webkit-user-select:none;
  -khtml-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
}
button {
	padding: 60px;
	width: 100px;
}

</style>