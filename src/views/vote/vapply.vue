<template>
	<div class="vapply">
  	<div class="title">{{state.voteInfo.Title}}</div>
  	<div class="table-wrapper">
  		<ul class="form">
  			<li>
          <label>参选名称<span>*</span></label><p><input type="text"    maxlength="30" placeholder="请输入你的参选名称,最多30字" v-model="UserName"></p>
        </li>
        <li>
          <label>参选宣言</label><p><textarea maxlength="50" placeholder="请输入你的参选宣言,最多50字" v-model="Declaration"></textarea></p>
        </li>
  		</ul>
  		<div class="pic-container">
        <div class="tit">
            <label>参选图片</label><span>*</span><span class="gray">（图片大小不超过5M）</span>
        </div>
        <div class="con">
            <div class="file" @click=""
            :class="{'on': UserImage}">
                <img :src="UserImage" v-if="UserImage">
                <i @click.stop="UserImage = ''"></i>
                <form enctype="multipart/form-data">
                <input type="file" name="file" accept="image/png, image/jpeg, image/gif, image/jpg"  @change="inputImage($event, 0)"></form>
            </div>
        </div>
        <div class="tit" style="margin-top:10px;">
            <label>详细介绍</label>
        </div>
        <div class="description">
            <div class="con"><textarea maxlength="3000" placeholder="请输入你的参选详情介绍说明,最多3000字" v-model="Remark"></textarea></div>
        </div>
        <div class="tit">
            <label>风采展示</label><span class="gray">（最多3张，每张图片大小不超过5M）</span>
        </div>
        <div class="con">
            <div class="file" v-for="(item, index) in preview" 
            :class="{'on': item.url}">
                <img :src="item.url" v-if="item.url">
                <i @click.stop="item.url = '';item.remote = '';"></i>
                <form enctype="multipart/form-data">
                <input type="file" name="file" accept="image/png, image/jpeg, image/gif, image/jpg"  @change="inputImage($event, 1, index)"></form>
            </div>
        </div>
	    </div>
	    <div class="info-container">
        <div class="tips">评选活动结束后，为了主办方能联系到您进行领奖，请填写以下联系方式</div>
        <ul>
          <li>
            <label>联系人<span>*</span></label><p><input type="text" 
            maxlength="20" placeholder="请输入你的姓名"  v-model="LinkMan"></p>
          </li>
          <li>
            <label>联系手机<span>*</span></label><p><input type="text" placeholder="请输入你的手机号码" v-model="Mobile" maxlength="11"
            	@change="checkPhone"></p>
          </li>
          <li>
            <label>联系地址<span>*</span></label><p><textarea placeholder="请正确填写奖品的收货地址（要不收不到奖品哦），最多50字"
            maxlength="50" v-model="Address"></textarea></p>
          </li>
          <li>
            <label>微信号</label><p><input type="text" maxlength="20" placeholder="请输入你的微信号" v-model="WeiXin"></p>
          </li>
        </ul>
	    </div>
  	</div>
  	<div class="pass" v-show="voted">已提交报名，审核中</div>
    <div class="nopass" v-show="revote">
    	<div class="t1">审核不通过</div>
    	<div class="t2">如有疑问，请联系主办方</div>
    	<a class="phone" :href="'tel: ' + state.voteInfo.Tel"
    	>{{state.voteInfo.Tel}}</a>
    	<div class="reason">{{ShRemark}}</div>
    </div>
		<div class="submit" @click="submit" v-show="!voted" v-light>{{ revote ? '重新提交报名' : '提交报名'}}</div>
		<div class="copy-container">
	    <copy-right></copy-right>
	  </div>
  </div>
</template>

<script>
	import {getWxdata, uploadImg} from 'services/wxApi'
	import {addVoteUser, getVoteUserInfo} from 'services/voteApi'
	import Yes from 'common/imgs/dui_icon.png'
	import {extend, changeTitle} from 'common/js/dom'
	import Store from '@/store/store'

	export default {
		data: () => ({ 
		  "UserNum": "",
		  "UserName": "",
		  "Declaration": "",
		  "UserImage": "",
		  "Remark": "",
		  "Pic": "",
		  "LinkMan": "",
		  "Mobile": "",
		  "Address": "",
		  "WeiXin": "",
		  ShRemark: '',     //审核不通过原因
		  state: Store.state,
		  preview: [{url: ''}, {url: ''}, {url: ''}],   //风采图片组
		  type: 0,         //0: 参选图片  1：风采图片
		  revote: false,
		  voted: false,
		}),
    computed: {
     
    },
    watch: {

    },
    created() {
    	this.m = this.$route.query.m
    	this.aid = this.$route.query.aid
    	this.vi = this.$route.query.vi
    	if (this.vi == 0 || this.vi == 2) this._getVoteUserInfo()
    },
    mounted() {
    },
    activated() {
			changeTitle('活动报名')
    },
    beforeRouteLeave(to, from, next) {
    	changeTitle(Store.state.voteInfo.Title)
    	next()
    },
		methods: {
			_getVoteUserInfo() {
				//投票参选 0 待审核  1 已参选已通过  2 已参选未通过 3 未参选
				if (this.vi == 0) {this.voted = true}
				if (this.vi == 2) {this.revote = true}
				getVoteUserInfo(this.aid, 0).then(res => {
					if (res.return_code === 0) {
						extend(this, res.return_data)
						this.Pic.split(',').forEach((n, i) => {
							this.preview[i].url = n
						})
					}
				}).catch(error => {
	    		console.log(error)
					this.$vux.toast.text('网络连接失败，请稍后<br/>重试')
				})	
			},
			//微信sdk选择图片
			chooseImage(count, type = 0, index) {
				if (Number.isInteger(index) && this.preview[index].remote) return;
				let self = this
				self.type = type
        self.$wechat.chooseImage({
          count: count || 3,  // 默认9
          sizeType: ['compressed'],     // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album'],        // 可以指定来源是相册还是相机，默认二者都有
          success: function ({localIds}) {
            // 将获得的本地图片id加入上传队列
            for (let [i, localId] of localIds.entries()) {
            	//参选图片上传
            	if (!self.type) {
            		self.UserImage = localId
            	} else {
            		//风采图片上传
		          	let cur = self.preview[(index + i) % 3]
		          	while(cur.remote) {
		          		cur = self.preview[(index + i + 1) % 3]
		          	}
		          	cur.remote = ''
		          	cur.url = localId
            	}
            }
            self.uploadImage(localIds)
          },
          fail:function(res){
          }
        });
			},
			uploadImage(localIds) {
        if (!localIds.length) return;
        let self = this
        let localId = localIds.shift()
        // 上传图片至微信服务器
        self.$wechat.uploadImage({
          localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
          success: function ({serverId}) {
            self.uploadApi(serverId);
            self.uploadImage(localIds)
          },
          fail: function(res) {
            self.uploadImage([localId, ...localIds])
          }
        });
      },
      uploadApi(mediaId) {
        upload(this.m, mediaId).then(({return_link}) => {
        	if (!this.type) {this.UserImage = return_link; return;}
          for (let i = 0; i < 3; i++) {
          	if (!this.preview[i].remote) {
          		this.preview[i].url = return_link
          		this.preview[i].remote = return_link
          	}
          }
        }).catch(({message}) => {
          this.$vux.toast.text('图片上传失败，请重新上传')
        });
      },
      //input上传图片
      inputImage(e, type, index) {
      	if (e.target.files[0].size > 5 * 1000 * 1000) {
      		this.$vux.toast.text('所选图片大小超过5M，上传失败')
      		return;
      	}
      	this.$vux.loading.show({text: '上传中'})
      	let formData = new FormData(e.target.form)
      	uploadImg(this.m, formData).then(res => {
      		if (res.return_code !== 0) return;
        	if (type === 0) {this.UserImage = res.return_img; return;}
        	this.preview[index].url = res.return_img
      	}).catch(error => {
        	console.log(error)
        	this.$vux.loading.hide()
          this.$vux.toast.text('上传图片失败,请重试')
      	})
      },
			//验证手机号
			checkPhone() {
				if (this.Mobile === '') {
					this.$vux.toast.text('请输入手机号码')
					return true;
				}
				if(!(/^1[34578]\d{9}$/.test(this.Mobile))){ 
					this.$vux.toast.text('请输入正确的手机号')
					return true;
		    } 
			},
			submit() {
				if (!this.UserName) {
					this.$vux.toast.text('请输入参选名称')
					return;
				}
				if (!this.UserImage) {
					this.$vux.toast.text('请上传参选图片')
					return;
				}
				if (!this.LinkMan) {
					this.$vux.toast.text('请输入联系人')
					return;
				}
				if (this.checkPhone()) {
					return;
				}
				if (!this.Address) {
					this.$vux.toast.text('请输入联系地址, 联系地址最多支持100个字')
					return;
				}
				this.$vux.loading.show({text: 'Loading'})
				addVoteUser({
					"Aid": this.aid,
					"Id": this.Id || 0,  //用户ID
					"UserNum": this.UserNum,
				  "UserName": this.UserName,
				  "Declaration": this.Declaration,
				  "UserImage": this.UserImage,
				  "Remark": this.Remark,
				  "Pic": this.joinUrl(this.preview),
				  "LinkMan": this.LinkMan,
				  "Mobile": this.Mobile,
				  "Address": this.Address,
				  "WeiXin": this.WeiXin,
				}).then(res => {
					if (res.return_code === 0) {
						this.voted = true
						this.revote = false
						//res.return_index 0 待审核  1 已参选已通过 
						let txt, btn;
						if (res.return_index === 0) {
							txt = '您的报名信息已经提交成功，请您耐心等待审核。'
							btn = '查看报名'
						} else {
							txt = '快把它分享给好友去获得投票支持吧。'
							btn = '立即查看'
						}
						this.hasSigned(txt, btn)
					}
				}).catch(error => {
	    		console.log(error)
					this.$vux.toast.text('网络连接失败，请稍后<br/>重试')
				})	
			},
			hasSigned(txt, btn) {
				this.$layer.dialog({
					title: ['报名成功', `background: url(${Yes}) no-repeat 90px 11px / 23px;`], 
          content: txt,
          btn: ['知道了',btn] 
				}).then(res => {
					//立即查看：关闭弹框，并跳转到详情页。
					let {m, aid} = this
					if (res === 1 && btn === '立即查看') {
						this.$router.push({
							path: '/vote/vapplicant',
							query: {m, aid, vid: 0, s: 1}
						})
					}
				})
			}, 
			joinUrl(list) {
				let str = ''
				list.forEach((n, i) => {
					if (n.url) str += n.url + ','
				})
				return str.slice(0, -1);
			}
		},
		components: {
		
		}
	}
</script>

<style lang="scss" scoped>
@import '~common/scss/mixin';
.vapply {
	margin-bottom: 50px;
	overflow: hidden;
	background-color: #f7f7f7;
	.title {
		background: url(~common/imgs/bottom_line.png) no-repeat scroll left top / 100% 1px #f7f7f7;
    border-bottom: 1px solid #e7e7e7;
    line-height: 44px;
    height: 44px;
    font-size: 16px;
    padding: 0 12px;
		@include ellipsis();
	}
	.table-wrapper {
		margin-bottom: 10px;
    background: url(~common/imgs/bottom_line.png) no-repeat scroll left bottom / 100% 1px ,url(~common/imgs/bottom_line.png) no-repeat scroll left top / 100% 1px #fff;
		ul.form {
			li {
				padding: 7px 12px;
		    line-height: 18px;
		    font-size: 15px;
		    background: url(~common/imgs/bottom_line.png) no-repeat scroll left bottom / 100% 1px #fff;
				label {
					display: inline-block;
			    width: 27%;
			    box-sizing: border-box;
			    padding-left: 6px;
			    vertical-align: top;
			    line-height: 24px;
			    padding: 3px 0;
			    span {color: #dd2726;}
				}
				p {
					display: inline-block;
			    width: 73%;
			    box-sizing: border-box;
			    padding-left: 6px;
			    vertical-align: top;
			    font-size: 15px;
			    word-break: break-all;
			    word-wrap: break-word;
			    line-height: 22px;
			    padding: 2px 0;
			    input, textarea {
			    	border: none;
				    background: rgba(255,255,255,0);
				    outline: none;
				    font-size: 15px;
				    vertical-align: top;
				    width: 100%;
				    height: 24px;
				    line-height: 20px;
				    color: #585858;
				    padding-left: 0;
				    padding-right: 0;
			    }
			    textarea {
			    	min-height: 45px;
			    	padding: 2px 0;
			    }
				}
			}
		}
		.pic-container {
			padding: 12px 0px;
			background-color: #fff;
	    background: url(~common/imgs/bottom_line.png) no-repeat scroll left bottom / 100% 1px #fff;
			.tit {
				line-height: 18px;
		    font-size: 15px;
		    padding: 0px 12px;
		    label {}
		    span {color: #dd2726;}
		    .gray {color: #a9a9a9;font-size: 14px;}
			}
			.con {
				padding: 15px 12px 7px;
		    max-width: 100%;
		    .file {
		    	width: 75px;
			    height: 75px;
			    cursor: pointer;
			    background: url(~common/imgs/uploadpic.png) no-repeat center / auto 19px;
			    border-radius: 4px;
			    position: relative;
			    display: inline-block;
			    vertical-align: top;
			    margin-right: 17px;
			    input {
			    	outline: none;
				    position: absolute;
				    left: 0;
				    top: 0;
				    width: 100%;
				    height: 100%;
				    opacity: 0;
				    z-index: 1;
			    }
			   	img {
			   		display: block;
			   		width: 100%;
			   		height: 100%;
			   	}
			    i {display: none;}
			    &::after {
			    	content: "";
				    position: absolute;
				    left: 0px;
				    top: 0px;
				    width: 100%;
				    height: 100%;
				    border: 1px dashed #a0a0a0;
				    border-radius: 4px;
				    box-sizing: border-box;
				    z-index: 0;
			    }
			    &.on {
			    	background: none;
			    	i {
			    		display: block;
			    		width: 14px;
					    height: 14px;
					    background: url(~common/imgs/upload-close.png) no-repeat center / auto 100%;
					    right: -8px;
					    top: -8px;
					    z-index: 10;
					    position: absolute;
			    	}
			    }
		    }
			}
			.description {
				padding: 12px;
		    line-height: 25px;
		    word-break: break-all;
		    word-wrap: break-word;
		    margin: 10px 0;
		    background: url(~common/imgs/bottom_line.png) no-repeat scroll left bottom / 100% 1px,url(~common/imgs/bottom_line.png) no-repeat scroll left top / 100% 1px #fff;
		    .con {
		    	display: block;
			    padding: 0px;
			    font-size: 14px;
			    word-break: break-all;
			    word-wrap: break-word;
			    text-align: justify;
			    min-height: 195px;
			    textarea {
			    	border: none;
				    padding: 0;
				    outline: none;
				    width: 100%;
				    min-width: 100%;
				    max-width: 100%;
				    min-height: 195px;
				    word-break: break-all;
				    word-wrap: break-word;
				    font-size: 14px;
				    text-align: justify;
			    }
		    }
			}
		}
		.info-container {
			margin-bottom: 10px;
	    background: url(~common/imgs/bottom_line.png) no-repeat scroll left bottom / 100% 1px ,url(~common/imgs/bottom_line.png) no-repeat scroll left top / 100% 1px #fff;
			.tips {
				padding: 12px 0;
		    line-height: 18px;
		    color: #a9a9a9;
		    background: url(~common/imgs/bottom_line.png) no-repeat scroll left bottom / 100% 1px,url(~common/imgs/bottom_line.png) no-repeat scroll left top / 100% 1px #fff;
		    margin: 0 12px;
			}
			ul {
				padding: 0 12px;
				li {
			    padding: 7px 0;
			    line-height: 18px;
			    font-size: 15px;
			    background: url(~common/imgs/bottom_line.png) no-repeat scroll left bottom / 100% 1px #fff;
			    label {
	    	    display: inline-block;
				    width: 27%;
				    padding-left: 6px;
				    vertical-align: top;
				    line-height: 24px;
				    padding: 3px 0;
				    span {color: #dd2726;}
			    }
			    p {
			    	display: inline-block;
				    width: 73%;
				    padding-left: 6px;
				    vertical-align: top;
				    font-size: 15px;
				    word-break: break-all;
				    word-wrap: break-word;
				    line-height: 22px;
				    padding: 2px 0;
				    input, textarea {
				    	border: none;
					    background: rgba(255,255,255,0);
					    outline: none;
					    font-size: 15px;
					    vertical-align: top;
					    width: 100%;
					    height: 24px;
					    line-height: 20px;
					    color: #585858;
					    padding-left: 0;
					    padding-right: 0;
				    }
				    textarea {
							min-height: 45px;
				    }
			    }
				}
			}
			
		}
	}
	.pass {
		padding: 10px 25px 25px;
    line-height: 42px;
    color: #dd2726;
    font-size: 15px;
    text-align: center;
	}
	.nopass {
		margin-bottom: 10px;
    padding: 10px;
    background: url(~common/imgs/bottom_line.png) no-repeat scroll left bottom / 100% 1px ,url(~common/imgs/bottom_line.png) no-repeat scroll left top / 100% 1px #fff;
    .t1 {
    	line-height: 20px;
	    color: #dd2726;
	    font-size: 15px;
    }
    .t2 {
    	line-height: 30px;
	    color: #a9a9a9;
	    font-size: 12px;
    }
    .phone {
    	padding-right: 26px;
	    background: url(~common/imgs/phone.png) no-repeat right bottom / auto 100%;
	    display: inline-block;
	    font-size: 14px;
	    vertical-align: top;
    }
    .reason {
    	line-height: 18px;
	    margin-top: 6px;
	    font-size: 14px;
	    word-break: break-all;
    }
	}
	.submit {
		margin: 10px 25px 25px;
    line-height: 42px;
    background: #dd2726;
    font-size: 15px;
    text-align: center;
    color: #fff;
    font-size: 15px;
    border-radius: 4px;
	}
}
</style>