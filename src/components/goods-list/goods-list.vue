<template>
    <div class="">
        <div class="index-goods-list">
            <div class="liebiao">
                <a :href="goodList.Url" v-if="goodList.IsShowTitle==1"><div class="title f-c"><s></s>{{goodList.Title}}<span class="arrow-right"></span></div></a>
                <ul class="f-c" :class="[goodList.CssStyle==0 ? 'goods-list' : '',goodList.CssStyle==1 ? 'goods-list2' : '',goodList.CssStyle==2 ? 'goods-list3' : '']">
                    <li class="f-c" v-for="(item, index) in goodList.ProductList" :key="index">
                        <div class="goods-photo">
                            <span class="goods_top" v-if="item.ActType==1">拼团</span>
                            <a :href="item.Url">
                                <img :src="item.PicUrl">
                            </a>
                        </div>
                        <div class="goods-info">
                        <a :href="item.Url">
                            <p class="goods-title"> 
                            <span class="chuxiao" v-if="item.Remark"><s></s><em>{{item.Remark}}</em></span>
                            {{item.ProductName}}
                            </p>
                            <p class="goods-price">
                            <em class="font12">¥</em> 
                            <em class="promotion-price" v-if="item.integer">{{item.Price}}</em>
                            <em class="promotion-price" v-if="!item.integer">{{item.integerNum}}</em>
                            <em class="font12" v-if="!item.integer">.{{item.decimals}}</em>
                            </p>
                            <div class="goods-buy">
                                <em class="xian jiage">¥ {{item.OriginalPrice}}</em>
                            </div>
                        </a>
                        </div>
                    </li>  
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
	
	export default {
        props: [
            "goodList"
        ],
		data: () => ({ 

		}),
        computed: {
        
        },
        watch: {
            goodList:function(){
                this.eachgoodList();
            }
        },
        created() {
            this.eachgoodList()
        },
        mounted() {

        },
		methods: {
            eachgoodList:function(){
                for(var i = 0;i<this.goodList.ProductList.length;i++){
                    this.goodList.ProductList[i].integer = true;
                    this.goodList.ProductList[i].Price = this.goodList.ProductList[i].Price.toString();
                    if(this.goodList.ProductList[i].Price.indexOf(".") != -1){
                        this.goodList.ProductList[i].integer = false;
                        this.goodList.ProductList[i].integerNum = Math.floor(this.goodList.ProductList[i].Price);
                        var d_index = this.goodList.ProductList[i].Price.indexOf(".");
                        this.goodList.ProductList[i].decimals = this.goodList.ProductList[i].Price.substring(d_index+1,d_index+3);
                    }
                }
            }
		},
		components: {
		
		}
	}
</script>

<style lang="scss" scoped>
.index-goods-list{
    background:#fff;
    overflow:hidden; 
    position:relative;
    .liebiao{
        .title{
            padding:10px 0 0 10px;
            height:30px;
            line-height: 21px;
            font-size: 15px;
            s{
                height:15px;
                width:3px;
                background:#dd2726;
                display:block;
                float:left;
                margin-right: 10px;
                margin-top:2px;
            }
            .arrow-right {
                width: 20px;
                height: 20px;
                float: right;
                padding: 0 8px;
                background-position: center center;
                background: url(~common/imgs/arrow-right.png) no-repeat right center;
                background-size: auto 15px;
                margin-right: 10px;
            }
        }
        ul{
            li{
                .goods-photo{
                    .goods_top{
                        width:42px;
                        height:56px;
                        position:absolute;
                        top: 0;
                        left:12px;
                        text-align: center;
                        color:#fff;
                        font-size: 16px;
                        padding-top:10px;
                        box-sizing: border-box;
                        z-index: 50;
                        background: url(~common/imgs/icon_list.png) no-repeat -15px -145px;
                    }
                }
                .goods-info{
                    position:relative;
                    a{
                        .goods-price{
                            padding:2px 0; 
                            overflow:hidden; 
                            height:20px;
                            color:#dd2726;
                            font-size: 19px;
                            .promotion-price{ 
                                letter-spacing:0;
                                white-space: nowrap;
                                text-overflow:ellipsis;
                                max-width: -webkit-calc(100% - 80px);
                                max-width: calc(100% - 80px);
                                display: inline-block;
                                vertical-align: middle;
                                margin: 0 0px  0 2px;
                                font-size: 17px;
                            }
                            em{
                                float: left;
                                line-height: 16px;
                            }
                            .font12{
                                font-size: 12px;
                                line-height: 18px;
                            }
                        }
                        .goods-buy {
                            font-size: 12px;
                            color:#acacac;
                            .xian{
                                text-decoration:line-through;
                            }
                            .xiaoliang{
                                display:none;
                            }
                        }
                        .goods-title{ 
                            overflow:hidden; 
                            display:-webkit-box;
                            -webkit-line-clamp:2;
                            -webkit-box-orient:vertical; 
                            line-height: 18px;
                            font-size: 14px;
                            color:#2a2a2a;
                            margin-bottom: 15px;
                            height:38px;
                            text-align:left;
                            box-sizing: border-box;
                            padding-top: 2px;
                            word-break:break-all;
                        }
                    }
                }
            }
        }
        ul.goods-list2{
            padding:0 12px;
            li{
                float:left; 
                width:-webkit-calc(50% - 5px); 
                margin:10px 0px; 
                vertical-align:top;
                width:calc(50% - 5px);
                width:-moz-calc(50% - 5px);
                .goods-photo{ 
                    position:relative; 
                    z-index:1; 
                    height:0; 
                    overflow:hidden; 
                    padding-bottom:100%;
                    a{
                        img{
                            width: 100%;
                            height: 100%;
                            position: absolute;
                            z-index: 0;
                            left: 0;
                            top: 0;
                        }
                    }
                }
                .goods-info{
                    a{
                        .goods-title{ 
                            margin-bottom: 15px;
                        }
                    }
                }
            }
            li:nth-child(2n+2){ 
                float:right;
            }
        }
        ul.goods-list{
            padding:0 12px; 
            position:initial;
            li{ 
                padding:10px 0px; 
                vertical-align:top;
                margin-right: 0;
                width:100%;
                background:url(~common/imgs/bottom_line.png) no-repeat scroll left bottom / 100% 1px #fff;
                .goods-photo{ 
                    z-index:1;
                    overflow:hidden; 
                    float:left;
                    height:120px;
                    width:120px;
                    margin-right: 10px;
                    position:relative;
                    a{
                        img {
                            width:100%;
                            height:100%;
                        }
                    }
                }
                .goods-info{
                    a{
                        .goods-title{ 
                            margin-bottom: 44px;
                        }
                    }
                }
            }
            li:last-child{
                background-image: none;
            }
        }
        ul.goods-list.lazyload{ 
            position:absolute; 
            left: 0; 
            top:0; 
            z-index: -1;
        }
        ul.goods-list3{
            li{
                vertical-align:top;margin:10px 12px;
                .goods-photo{  
                    z-index:1; 
                    overflow:hidden; 
                    width:100%;
                    position:relative;
                    a{
                        img{
                            width:100%;
                            height:auto;
                        }
                    }
                }
                .goods-info{
                    a{
                        .goods-price{ 
                            float:left;
                            width:150px;
                            em{
                                float: left;
                            }
                        }
                        .goods-buy{
                            float:left;
                            height:30px;
                            line-height: 22px;
                            margin-left: -60px;
                            em{
                                margin-left: 6px;
                            }
                        }
                    }
                }
            }
        }
    }
}





</style>