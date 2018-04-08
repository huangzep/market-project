<template>
	<ul class="sign-date">
		<li :class="[item.SignType==0 ? '' : 'on',item.SignType==1||item.SignType==2?'disabled':'']" v-for="(item, index) in res" :key="index" @click="retroactiveFn(index)">
			<i></i>
			<span>{{item.Days.slice(5)}}</span>
			<b></b>
		</li>
	</ul>
</template>

<script>
	import {getSupplyInfo} from 'services/signApi'
	export default {
		props: [
            "repairData"
        ],
		data: () => ({ 
			res:'',
		}),
		computed: {
		
		},
		watch: {
			repairData:function(){
				var that = this;
				for(var i = 0;i<this.res.length;i++){
					if(this.res[i].SignType == 3){
						this.res[i].SignType = 1;
					}
				}
			}
		},
		created() {
			this.aid = this.getQueryString("aid");
			this.getSupplyInfoApi();
		},
		mounted() {

		},
		methods: {
			getSupplyInfoApi:function(){//获取可补签日期
				getSupplyInfo(this.aid).then(res => {
                    if(res.return_code === 0){
						this.res = res.return_data.SupplyDayList;
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
			retroactiveFn:function(index){
				var that = this;
				var retroactiveList = that.res;
				if(retroactiveList[index].SignType!=2&&retroactiveList[index].SignType!=1){
					if(retroactiveList[index].SignType==3){
						retroactiveList[index].SignType = 0;
					}else{
						retroactiveList[index].SignType = 3;
					}
					that.$emit('retroactiveList', that.res);
				}
			}
		},
		components: {
		
		}
	}
</script>

<style lang="scss" scoped>
.sign-date {
	display: flex;
	flex-wrap: wrap;
	li {
    width: 27.5%;
    height: 128px;
    padding-top: 20px;
    margin-left: 4.3%;
    border-radius: 3px;
    margin-bottom: 12.6px;
    line-height: 18.9px;
    text-align: center;
    color: #ffa800;
    font-size: 16px;
    background: #fff;
    border: 1px solid #e9e9e9;
    &.done {
    	i {
    		background-position: center 0;
    	}
    	span {color: #8f8f8f;}
    	b {display: none;}
    }
    &.on {
	    border-color: #ff9933;
    	b {background-position: right -125px;}
    }
		i {
			display: block;
	    width: 50.4px;
	    height: 48px;
	    background-image: url(~common/imgs/qiandaoIcon.png);
	    background-repeat: no-repeat;
	    background-position: center -62px;
	    background-size: 100%;
	    margin: 0px auto 8px;
		}
		span {color: #ffa800;}
		b {
			display: block;
			margin-left: 1.866667rem;
			margin-top: 0.106667rem;
			width: 22px;
	    height: 22px;
	    background-image: url(~common/imgs/qiandaoIcon.png);
	    background-repeat: no-repeat;
	    background-position: left -125px;
	    background-size: 50px;
		}
	&.disabled{
		border: 1px solid #e9e9e9!important;
		i{
			background-position: center 0px;
		}
		span{
			color:#8f8f8f;
		}
		b{
			display: none;
		}
	}
	}
}
</style>