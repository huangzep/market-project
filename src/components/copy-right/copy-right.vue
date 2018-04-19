<template>
  <div class="copy-right">
    <div class="nav" v-show="menuList.length">
      <a v-for="item in menuList" :href="item.Url" >{{item.MenuName}}</a>
    </div>
    <div class="company">
      <p>©{{companyName}}版权所有</p>
      <a :href="toulink">
      投诉</a>
    </div>
    <div class="surport">
      米多网络提供技术支持
    </div>
  </div>
</template>

<script>
  import {getMenuList} from 'services/wxApi'
  import Store from '@/store/store'

  export default {
    data: () => ({ 
      menuList: [],
      companyName: '',
      toulink: ''
    }),
    computed: {
    },
    created() {
      this.m = this.$route.query.m
      this.aid = this.$route.query.aid
      this._getMenuList((this.$route.path.indexOf('word') > -1 ? 1 : 2))
    },
    mounted() {
    },
    methods: {
      _getMenuList(type = 1) {
        getMenuList(this.m, this.aid, type).then(res => {
          this.menuList = res.return_data
          this.companyName = res.return_msg
          this.toulink = res.return_link
          Store.setLogoInfo({
            companyName: res.return_msg,
            logoImg: res.return_img,
            mallLink: res.return_malllink
          })
        })
      }
    }
  }
</script>

<style scoped lang="scss">
.copy-right {
  padding: 0.8rem 0 0.533333rem 0;
  color: #fff;
  font-size: 0.32rem;
  text-align: center;
  .nav {
    display: flex;
    justify-content: center;
    margin: 0 0.373333rem;
    a {
      padding: 0.106667rem 0.266667rem 0.266667rem;
    }
  }
  .company {
    position: relative;
    font-size: 0.32rem;
    margin-top: 0.293333rem;
    p {
      white-space: nowrap;
      margin: 0 auto;
      text-overflow: ellipsis;
      overflow: hidden;
      width: calc(100% - 2.666667rem);
      text-align: center;
    }
    a {
      position: absolute;
      top: 0;
      right: 0.48rem;
      background-image: url(~common/imgs/tousu1.png);
      background-repeat: no-repeat;
      background-position: 0 2px;
      background-size: 13px;
      text-indent: 17px;
    }
  }
  .surport {
    padding-top: 8px;
    margin-left: 15px;
    display: inline-block;
    text-align: center;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      width: 15px;
      height: 100%;
      background-image: url(~common/imgs/logo0.png);
      background-repeat: no-repeat;
      background-position: 0 0;
      background-size: 15px 11px;
      top: 12px;
      left: -20px;
    }
  }
}
/* 集字页面 */
.m1 {
  .copy-right {
    color: #999;
  }
  .company {
    a {
      background-image: url(~common/imgs/tousu2.png);
    }
  }
  .surport {
    &::before {
      background-image: url(~common/imgs/logo2.png);
    }
  }
}
.activity {
  .copy-right {
    color: #a9a9a9;
    .nav {
      color: #2a2a2a;
    }
  }
  .company {
    a {
      background-image: url(~common/imgs/tousu2.png);
    }
  }
  .surport {
    &::before {
      background-image: url(~common/imgs/logo2.png);
    }
  }
}
/* 刮刮卡页面 */
.card {
  .copy-right {
    color: #999;
  }
  .company {
    a {
      background-image: url(~common/imgs/tousu2.png);
    }
  }
  .surport {
    &::before {
      background-image: url(~common/imgs/logo2.png);
    }
  }
}
/* 投票 签到页面 */
.vote, .vother, .sign, .fatechoice {
  .copy-right {
    color: #999;
    background-color: #f7f7f7;
    .nav {
      color: #585858;
      border-bottom: 1px solid #eee;
    }
  }
  .company {
    a {
      background-image: url(~common/imgs/tousu2.png);
    }
  }
  .surport {
    &::before {
      background-image: url(~common/imgs/logo2.png);
      transform: scale(1.2);
    }
  }
}
.sign {
  .copy-right {
    background: none;
  }
}
/* 集卡页面 */
.fate{
  .copy-right {
    .nav {
      border-bottom: 1px solid #eee;
    }
  }
  .surport {
    &::before {
      transform: scale(1.2);
    }
  }
}
</style>
