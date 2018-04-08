<template>
	<div class="not-now">
		<div class="content">
			<img src="~common/imgs/dzp-none.png" alt="">
			<p class="p1">你来得不是时候哦~</p>
			<p class="p2">现不是活动时间</p>
		</div>
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
.not-now {
 .content {
 	padding-top: 4.0rem;
 	display: flex;
 	flex-direction: column;
 	align-items: center;
 	img {
 		display: block;
 		width: 2.88rem;
 		height: 2.88rem;
 	}
 	.p1 {
 		font-size: 0.426667rem;
 		padding-top: 0.32rem;
 		color: #2a2a2a;
 	}
 	.p2 {
 		padding-top: 0.346667rem;
 		font-size: 0.346667rem;
 		color: #acacac;
 	}
 }
}
</style>