// 导入组件库
import headerComponent from '../design/components/Header/index.js'
import leftModulesComponent from '../design/components/LeftModules/index.js'
import rightAttributeComponent from '../design/components/RightAttribute/index.js'
import bodyCanvasComponent from '../design/components/BodyCanvas/index.js'

// 全局注册组件
Vue.component('header-component', headerComponent)
Vue.component('modules-component', leftModulesComponent)
Vue.component('attribute-component', rightAttributeComponent)
Vue.component('canvas-component', bodyCanvasComponent)

Vue.use(VueRouter)
Vue.use(vant.Lazyload)
Vue.use(vant)

// 创建Vue实例
var app = new Vue({
  el: '#app',
  components: {},
  data() {
    return {
      currentGroup: 'home',
      currentComponent: 'home',
      currentTab: 'home'
    }
  },
  methods: {},

  // 监听拖拽事件
  mounted() {}
})
console.log(app)
