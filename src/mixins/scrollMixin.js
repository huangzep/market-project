/*scroll插件共用*/
import Scroll from 'components/scroll/scroll'

export default {
  data: () => ({ 
    update: true
  }),
  computed: {
   
  },
  watch: {

  },
  created() {

  },
  mounted() {
    
  },
  activated() {
    this.$refs.scroll.refresh()
  },
  methods: {
    refresh() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$vux.loading.show({text: 'Loading'})
        this._getAll()
        this.$refs.scroll.finishPullDown()
      }, 20)
    }
  },
  components: {
    Scroll
  }
}