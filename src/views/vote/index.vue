<template>
	<div class="vote">
    <div class="company-wrapper" v-show="/vinfo|vrank|vapply/g.test($route.path)">
      <a class="company-container" :href="state.logoInfo.mallLink">
        <img :src="state.logoInfo.logoImg" alt="">
        <span>{{state.logoInfo.companyName}}</span>
      </a>
    </div>
    <keep-alive exclude="vapplicant">
      <router-view></router-view>
    </keep-alive>
    <vtab v-show="tabShow"></vtab>
    <!-- 参赛按钮 -->
    <div id="vjoin" class="vote-join" v-show="isJoin" @click="join" v-light></div>
  </div>
</template>

<script>
	import Vtab from 'components/vtab/vtab'
  import Store from '@/store/store'
  import {timeOut} from 'common/js/util'
  import {getVoteInfo} from 'services/voteApi'

	export default {
		data: () => ({ 
			state: Store.state,
      tabShow: true
		}),
    computed: {
     isJoin() {
      //0 禁用  1 未开始  2 进行中  3 已结束
      //投票是否开启前台参选  
      return (Store.state.voteInfo.Status === 2) && Store.state.voteInfo.IsOpenSign && /vhome|vinfo|vrank/gi.test(this.$route.path)
     }
    },
    watch: {

    },
    created() {
      this.aid = this.$route.query.aid
      this.m = this.$route.query.m
      this._getVoteInfo()
    },
    mounted() {
      //解决安卓手机底部导航弹起
      this.hideFooter()
    },
		methods: {
      _getVoteInfo() {
        getVoteInfo(this.aid).then(res => {
          if (res.return_code === 0) {
            this.res = res.return_data
            document.title = this.res.Title
            Store.setVoteInfo(this.res)
          }
        }).catch(error => {
          console.log(error)
          this.$vux.toast.text('网络连接失败，请稍后<br/>重试')
        })  
      },
			join() {
        let {m, aid} = this
        //投票参选 0 待审核  1 已参选已通过  2 已参选未通过 3 未参选
        switch (Store.state.voteInfo.IsInVote) {
          case 3: 
            this.$router.push({
              path: '/vote/vapply',
              query: {m, aid}
            })
            break;
          case 0:
            this.$router.push({
              path: '/vote/vapply',
              query: {vi: 0, m, aid}
            })
            break;
          case 2:
            this.$router.push({
              path: '/vote/vapply',
              query: {vi: 2, m, aid}
            })
            break;
          case 1:
            this.$vux.toast.text('您的报名审核已通过，赶快去分享给你的好友')
            setTimeout(() => {this.$router.push({
              path: '/vote/vapplicant',
              query: {vid: 0, s: 1, m, aid}
            })}, 1000) 
        }
      },
      hideFooter() {
        let self = this
        let client_h = document.documentElement.clientHeight
        window.addEventListener('resize', () => {
          let body_h =  document.body.scrollHeight; 
          self.tabShow = !self.tabShow
          if (self.tabShow) {
            document.activeElement.blur && document.activeElement.blur()
          }
        })
      }
		},
		components: {
		  Vtab
		}
	}
</script>

<style lang="scss">
@import '~common/scss/mixin';
.vote {
  .company-wrapper {
    background: #fff;
    .company-container {
      display: flex;
      align-items: center;
      height: 48px;
      width: 50%;
      img {
        border-radius: 20px;
        margin-left: 7px;
        width: 33px;
        height: 33px;
        display: block;
        border: 1px solid #fff;
      }
      span {
        font-size: 14px;
        color: #888;
        margin-left: 10px;
        line-height: 34px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }  
  .vtop {
    position: relative;
    border-bottom: 1px solid #e5e5e5;
    min-height: 172px;
    img {
      display: block;
      width: 100%;
      // height: 100%;
    }
    span {
      position: absolute;
      left: 0;
      bottom: 0;
      height: 30px;
      line-height: 30px;
      padding: 0 15px 0 19px;
      color: #864112;
      font-size: 18px;
      font-weight: bold;
      background: #ffc600;
      &::after {
        content: "";
        background: url(~common/imgs/vote-top.png) no-repeat left center / auto 100%;
        position: relative;
        right: -23px;
        width: 8px;
        height: 30px;
        display: inline-block;
        vertical-align: top;
      }
    }
  }
  .activity-info {
    background: #fff;
    margin-top: 10px;
    padding-bottom: 6px;
    .name {
      display: flex;
      align-items: center;
      font-size: 13px;
      padding-top: 6px;
      .left {
        padding-left: 0.266667rem;
        min-width: 2.133333rem;
      }
      .right {
        @include ellipsis2();
      }
    }
  }
  .vscroll {
    position: fixed;
    top: 48px;
    bottom: 50px;
    left: 0;
    right: 0;
    overflow: hidden;
    min-height: 400px;
    background-color: #fff;
  }
  /* 参赛按钮 */
  .vote-join {
    width: 66px;
    height: 66px;
    background: url(~common/imgs/vote-join.png) no-repeat center / 100%;
    position: fixed;
    right: 10px;
    bottom: 120px;
    z-index: 1000;
  }
  /* 分享 */
  .vote-share {
    background: url(~common/imgs/share.png) no-repeat center 0 / 84.6% auto rgba(0,0,0,.75);
    position: fixed;
    z-index: 1050;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  .copy-container {
    padding-bottom: 20px;
  }
}
</style>