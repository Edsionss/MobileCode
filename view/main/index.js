// 导入组件库
import router from '@modules/router/index.js'
import utils from '@utils/index.js'
import store from '@modules/store/index.js'
//全局注册组件

Vue.use(vant.Lazyload)
Vue.use(vant)
Vue.component('vuedraggable', vuedraggable)

// 全局注册自定义组件

// 将Vuex的辅助函数挂载到Vue原型上
Vue.prototype.$mapState = Vuex.mapState
Vue.prototype.$mapGetters = Vuex.mapGetters
Vue.prototype.$mapMutations = Vuex.mapMutations
Vue.prototype.$mapActions = Vuex.mapActions
// 创建Vue实例
var app = new Vue({
  store, // 使用Vuex状态管理
  router, // 使用Vue-Router路由
  components: {},
  beforeCreate() {
    Vue.prototype.$bus = this
  },
  provide() {
    return {}
  },
  data() {
    return {}
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {}
}).$mount('#app')
console.log('Vue实例', app)
