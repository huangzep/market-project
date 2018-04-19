<template>
	<div class="voters">
		<ul ref="items">
			<li ref="item" v-for="(item, index) in vlist" :key="item.Id">
				<div class="wrapper">
					<x-img :src="item.UserImage"  :offset="10000"
					@on-success="success" @on-error="success" 
					@click.native="link(item)"></x-img>
					<div class="content">
						<p class="p1">{{item.Votes}}票</p>
						<p class="p2">{{item.UserName}}</p>
						<p class="p3">编号：{{item.UserNum}}</p>
						<span class="tou" @click="link(item)"  v-show="canVote">投TA一票</span>
					</div>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
	import { XImg } from 'vux'

	const col = 2
	const pad = 6

	export default {
		props: {
			vlist: {
				type: Array,
				default: []
			},
			canVote: {
				type: Boolean,
				default: true
			}
		},
		data: () => ({ 
			loadNum: 0,  //已加载成功的图片数量
		}),
    computed: {
     
    },
    watch: {
    	vlist(val, oldVal) {
    		if (!val.length) return;
    		this.loadNum = 0
    		this.$refs.items.style.opacity = 0
				console.log(this.loadNum)
				this.loadNum = val.reduce((accu, cur) => {
					return this.reuse[cur.Id] ? accu + 1 : accu
				}, 0)
				console.log(this.loadNum)
				if (this.loadNum === val.length) {
					this.$nextTick(() => {setTimeout(() => {this.waterFall()}, 200)})
				} 
				this.reused(val)
    	}
    },
    created() {
    	this.aid = this.$route.query.aid
    	this.m = this.$route.query.m
    	this.reused(this.vlist)
    },
    mounted() {
    },
		methods: {
			//相同图片vue实例存储
			reused(list) {
				this.reuse = {}
				list.forEach((n, i) => {
					this.reuse[n.Id] = true
				})
			},
			success() {
				this.loadNum++
				console.log(this.loadNum)
				if (this.loadNum === this.vlist.length) {
					this.$nextTick(() => {setTimeout(() => {this.waterFall()}, 200)})
				}
			},
			waterFall() {
				this.$refs.items.style.opacity = 1
				let itemW = this.$refs.item[0].clientWidth
				let itemY = []
				//瀑布流布局
				this.$refs.item.forEach((n, i) => {
					let itemH = n.clientHeight
					let minCol, minH
					if (i < col) {
						n.style.top = pad + 'px'
						n.style.left = (itemW * i) + 'px'
						itemY[i] = pad + itemH
					} else {
						minCol = 0
						minH = itemY[minCol]
						itemY.forEach((yn, yi) => {
							if (minH > yn) {minH = yn; minCol = yi}
						})
						n.style.top = (minH + pad) + 'px'
						n.style.left = (itemW * minCol) + 'px'
						itemY[minCol] += (pad + itemH)
					}
					console.log(itemY)
				})
				//计算容器ul高度
				let maxH = Math.max.apply(null, itemY)
				this.$refs.items.style.height = (maxH + pad) + 'px'
			},
			link(item) {
				let {m, aid} = this
				this.$router.push({
					path: '/vote/vapplicant',
					query: {
						vid: item.Id,
						s: item.Status,
						m, aid
					}
				})
			}
		},
		components: {
			XImg
		}
	}
</script>

<style lang="scss" scoped>
@import '~common/scss/mixin';
.voters {
	ul {
		position: relative;
		overflow: hidden;
		li {
			width: 50%;
			padding: 3px;
			position: absolute;
	    .wrapper {
	    	border: 1px solid #eee;
	    }
			img {
				display: block;
				width: 100%;
			}
			.content {
				padding: 0 8px 12px;
				text-align: center;
			}
			p {@include ellipsis();}
			.p1 {
		    color: #dd2726;
		    font-size: 15px;
		    padding-top: 4px;
			}
			.p2 {
				color: #2a2a2a;
		    font-size: 15px;
		    text-align: left;
			}
			.p3 {
		    color: #acacac;
		    font-size: 14px;
		    text-align: left;
			}
			.tou {
				line-height: 28px;
		    margin: 8px 0 0;
		    display: inline-block;
		    color: #fff;
		    background: #dd2726;
		    font-size: 12px;
		    border-radius: 4px;
		    padding: 0 28px;
			}
		}
	}
}
</style>