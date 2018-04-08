<template>
	<transition name="slide">
		<div class="menus" v-show="showFlag" @click="hide">
	    <div class="menus-wrapper" @click.stop>
       <slot></slot> 
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
		watch: {
      
    },
		components: {
		
		}
	}
</script>

<style scoped lang="scss">
.menus{
	background: rgba(0,0,0,0.5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 108;
	&.slide-enter-active, &.slide-leave-active {
    transition: opacity 0.3s;
    .menus-wrapper {
      transition: all 0.3s;
    }
  }
  &.slide-enter, &.slide-leave-to {
    opacity: 0;
    .menus-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }
  .menus-wrapper {
    width: 100%;z-index:125;position: fixed;bottom: 0; background:#fff;
  }
}
</style>