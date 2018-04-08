<template>
	<transition name="pop">
		<div class="pop" v-if="showFlag" @click="hide">
			<div class="pop-wrapper" @click.stop>
				<div class="pop-content">
					<verify @success="success"></verify>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
	import Verify from 'components/verify/verify'

	export default {
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
				this.$emit('hide')
			},
			success() {
				this.hide()
				this.$emit('success')
			}
		},
		components: {
			Verify
		}
	}
</script>

<style lang="scss" scoped>
@import '~common/scss/mixin';
.pop {
	@include cover();
	&.pop-enter-active {
		animation: fadein 0.3s;
		.pop-content {
			animation: confirm-zoom 0.3s;
		}
	}
	.pop-wrapper {
		@include wrapper();
		.pop-content {
		}
	}
}
</style>