<template>
	<div class="rotate-bar">
		<div class="center" :class="{'show': show}" @click="show = !show">
			<span></span>
		</div>
		<transition name="bar">
			<div class="bar1" v-show="show">
				<span></span>
			</div>
		</transition>
		<transition name="bar">
			<div class="bar2" v-show="show">
				<span></span>
			</div>
		</transition>
		<transition name="bar">
			<div class="bar3" v-show="show">
				<span></span>
			</div>
		</transition>
		<transition name="bar">
			<div class="bar4" v-show="show">
				<span></span>
			</div>
		</transition>
	</div>
</template>

<script>
	
	export default {
		data: () => ({ 
			show: false
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
.rotate-bar {
	position: fixed;
	left: 20px;
	bottom: 30px;
	width: 50px;
	height: 50px;
	div {
		position: absolute;
		width: 100%;
		height: 100%;
    transition: .3s all ease-in-out;
    span {
    	position: absolute;
	    top: 50%;
	    left: 50%;
	    transform: translate(-50%, -50%);
	    width: 50px;
	    height: 50px;
      background-color: #696969;
	    border-radius: 50%;
	    box-shadow: #c5c5c5 0px 0px 10px;
      border: 5px solid #fff;
    }
	}
	.center	{
		z-index: 10;
		&.show {
			transform: rotate(135deg);
		}
		span {
			background-image: url(~common/imgs/icon-ten.png);
	    background-position: center;
	    background-repeat: no-repeat;
	    cursor: pointer;
		}
	}
	.bar1 {
		transform: translate3d(-8px, -86px, 0) scale(1);
		&.bar-enter, &.bar-leave-to {
			transform: translate3d(0, 0, 0) scale(0);
		}
		span {
			background-image: url(~common/imgs/icon-rotate.png);
			background-repeat: no-repeat;
			background-size: 24px;
			background-position: 9px 9px;
		}
	}
	.bar2 {
    transform: translate3d(53px, -89px, 0) scale(1);
    &.bar-enter, &.bar-leave-to {
			transform: translate3d(0, 0, 0) scale(0);
		}
		span {
			background-image: url(~common/imgs/icon-rotate.png);
			background-repeat: no-repeat;
			background-size: 24px;
			background-position: 9px 9px;
		}
	}
	.bar3 {
		transform: translate3d(93px, -42px, 0) scale(1);
		&.bar-enter, &.bar-leave-to {
			transform: translate3d(0, 0, 0) scale(0);
		}
		span {
			background-image: url(~common/imgs/icon-rotate.png);
			background-repeat: no-repeat;
			background-size: 24px;
			background-position: 9px 9px;
		}
	}
	.bar4 {
		transform: translate3d(80px, 18px, 0) scale(1);
		&.bar-enter, &.bar-leave-to {
			transform: translate3d(0, 0, 0) scale(0);
		}
		span {
			background-image: url(~common/imgs/icon-rotate.png);
			background-repeat: no-repeat;
			background-size: 24px;
			background-position: 9px 9px;
		}
	}
}
</style>