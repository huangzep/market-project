<template>
	<transition name="loading">
		<div class="loading" v-show="showFlag" 
		@touchstart.prevent @touchmove.prevent @touchend.prevent>
			<div class="loading-wrapper" @click.stop>
				<div class="loading-content">
					<img class="out" :src="pimg(circle)" alt="">
					<img class="in" :src="pimg(gift)" alt="">
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
	
	export default {
		props: {
			model: {
				default: ''
			}
		},
		data: () => ({ 
			showFlag: false
		}),
    computed: {
     circle() {
     	return `circle${this.model}.png`
     },
     gift() {
     	return `gift${this.model}.png`
     },
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
.loading {
	@include cover();
	&.loading-enter-active {
		animation: fadein .5s;
		.loading-content {
			animation: loading-out .5s forwards;
		}
	}
	&.loading-leave-active {
		animation: .5s;
		.loading-content {
			animation: loading-in .5s forwards;
		}
	}
	.loading-content {
		position: relative;
		width: 6.4rem;
		height: 6.4rem;
		.out {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			animation: img-out 1s linear infinite forwards;
		}
		.in {
			position: absolute;
			top: 50%;
			left: 50%;
			width: 2.666667rem;
			height: 2.666667rem;
			transform: translate(-50%, -50%);
			transform-origin: 50% 100%;
			// animation: img-in .5s linear infinite alternate;
		}
	}
	.loading-wrapper {
		@include wrapper();
		img {
			display: block;
			width: 5.333333rem;
			height: 6.053333rem;
		}
	}
}
</style>