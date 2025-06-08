// 导入组件库
import headerComponent from '@components/Header/index.js'
import leftModulesComponent from '@components/LeftModules/index.js'
import rightAttributeComponent from '@components/RightAttribute/index.js'
import bodyCanvasComponent from '@components/BodyCanvas/index.js'
//全局注册组件
Vue.use(VueRouter)
Vue.use(vant.Lazyload)
Vue.use(vant)
Vue.component('vuedraggable', vuedraggable)

// 全局注册自定义组件
Vue.component('header-component', headerComponent)
Vue.component('modules-component', leftModulesComponent)
Vue.component('attribute-component', rightAttributeComponent)
Vue.component('canvas-component', bodyCanvasComponent)

// 创建Vue实例
var app = new Vue({
  el: '#app',
  components: {},
  data() {
    return {
      currentGroup: 'form',
      currentComponent: 'input',
      currentTab: 'attr'
    }
  },
  methods: {},

  // 监听拖拽事件
  mounted() {}
})
console.log(app)
