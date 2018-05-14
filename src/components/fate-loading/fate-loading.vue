<template>
	<transition name="fate-loading">
		<div class="fate-loading" v-show="showFlag"
		@touchstart.prevent @touchmove.prevent @touchend.prevent>
			<div class="fate-loading-wrapper" @click.stop>
				<div class="fate-loading-cbg">
					<img src="~common/imgs/fate-light.png" alt="" class="">
				</div>
				<div class="fate-loading-content" ref="content">
					<img :src="pimg('fate-front.png')" alt="" class="front">
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
	
	export default {
		props: {
		},
		data: () => ({ 
			showFlag: false
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
			show() {
				this.showFlag = true
			},
			hide() {
				this.showFlag = false
			}
		},
		components: {
		
		}
	}
</script>

<style lang="scss" scoped>
@import '~common/scss/mixin';
.fate-loading {
	@include cover();
	overflow: hidden;
	&.fate-loading-enter-active {
		animation: fadein 1s;
		.fate-loading-content, .fate-loading-cbg {
			transition: all 1s ease-in-out;
		}
		.fate-loading-cbg {
		}
	}
	&.fate-loading-leave-active {
		animation: 1s;
		.fate-loading-content, .fate-loading-cbg {
			transition: all 1s ease-in-out;
		}
		.fate-loading-cbg {
		}
	}
	&.fate-loading-enter, &.fate-loading-leave-to {
		.fate-loading-content {
			transform: scale(0) rotateY(360deg);
		}
		.fate-loading-cbg {
			opacity: 0;
		}
	}
	.fate-loading-wrapper {
		@include wrapper();
	}
	.fate-loading-content {
		transform-style: preserve-3d;
		position: relative;
		z-index: 99;
		width: 3.413333rem;
		height: 4.64rem;
		.front {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
	}	
	.fate-loading-cbg {
		position: absolute;
		z-index: -1;
		left: -3.093333rem;
		top: -2.48rem;
		width: 9.6rem;
		height: 9.6rem;
		animation: light 10s linear infinite;
		img {
			display: block;
			width: 100%;
			height: 100%;
		}
	}
}

@keyframes light {
  0% {
  	transform: rotate(0deg) translateZ(-1200px);
  }
  100% {
    transform: rotate(360deg) translateZ(-1200px);
  }
}

</style>