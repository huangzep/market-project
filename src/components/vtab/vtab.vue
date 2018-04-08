<template>
	<div class="vtab">
		<router-link tag="div" class="tab-item" :to="{ path: '/vote/vhome',query:{ aid, m} }">
			<span class="tab-icon"></span>
			<span class="tab-link">活动首页</span>
		</router-link>
		<router-link tag="div" class="tab-item" :to="{ path: '/vote/vinfo',query:{ aid, m} }">
			<span class="tab-icon"></span>
			<span class="tab-link">奖品规则</span>
		</router-link>
		<router-link tag="div" class="tab-item" :to="{ path: '/vote/vrank',query:{ aid, m} }">
			<span class="tab-icon"></span>
			<span class="tab-link">排名榜</span>
		</router-link>
		<router-link tag="div" class="tab-item" :to="{ path: '/voteother',query:{ aid, m} }">
			<span class="tab-icon"></span>
			<span class="tab-link">其他活动</span>
		</router-link>
	</div>
</template>

<script>

	export default {
		data: () => ({ 

		}),
    computed: {
     
    },
    watch: {

    },
    created() {
    	this.aid = this.$route.query.aid
    	this.m = this.$route.query.m 
    },
    mounted() {

    },
		methods: {
			
		},
		components: {
		
		}
	}
</script>

<style lang="scss" scoped>
html {background: #fff;}
.vtab {
	background: url(~common/imgs/bottom_line.png) no-repeat scroll left top / 100% 1px #fff;
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	height: 50px;
	z-index: 999;
	display: flex;
	.tab-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		&.router-link-active {
			.tab-icon {background-image: url(~common/imgs/vote-footer2.png);}
			.tab-link {color: #dd2726;}
		}
		.tab-icon {
			width: 100%;
			height: 28px;
			background-repeat: no-repeat;
	    background-size: 21px;
	    background-image: url(~common/imgs/vote-footer1.png);
		}
		.tab-link {
			font-size: 12px;
			line-height: 22px;
	    color: #585858;
		}
	}
	.tab-item:nth-of-type(1) {
		.tab-icon {background-position: center 7px;}
	}
	.tab-item:nth-of-type(2) {
		.tab-icon {background-position: center -24px;}
	}
	.tab-item:nth-of-type(3) {
		.tab-icon {background-position: center -56px;}
	}
	.tab-item:nth-of-type(4) {
		.tab-icon {background-position: center -89px;}
	}
}
</style>