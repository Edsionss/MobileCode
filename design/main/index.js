// 导入组件库
import headerComponent from '@components/Header/index.js'
import leftModulesComponent from '@components/LeftModules/index.js'
import rightAttributeComponent from '@components/RightAttribute/index.js'
import bodyCanvasComponent from '@components/BodyCanvas/index.js'
import canvasErrorComponent from '@components/CanvasError/index.js'
import utils from '@utils/index.js'
import store from '@modules/store/index.js'
//测试预览
import previewData from './preview.js'
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
Vue.component('canvas-error-component', canvasErrorComponent)
// 将Vuex的辅助函数挂载到Vue原型上
Vue.prototype.$mapState = Vuex.mapState
Vue.prototype.$mapGetters = Vuex.mapGetters
Vue.prototype.$mapMutations = Vuex.mapMutations
Vue.prototype.$mapActions = Vuex.mapActions
// 创建Vue实例
var app = new Vue({
  el: '#app',
  store, // 使用Vuex状态管理
  components: {},
  provide() {
    return {}
  },
  data() {
    return {
      currentGroup: '',
      currentComponent: '',
      currentTab: 'attr',
      componentName: '',
      attrKey: '',
      previewData: previewData,
      // 添加主题相关数据
      currentTheme: localStorage.getItem('theme') || 'light',
      //画布
      canvas: {
        currentMode: 'Phone',
        currentModeItem: {},
        canvasWarning: false,
        canvasWarningStyle: {
          width: '100%',
          height: '100%',
          backgroundColor: '#f0f0f0'
        },
        currentModeStyle: {}
      }
    }
  },
  created() {
    // 初始化主题
    this.initTheme()
  },
  mounted() {
    // 监听系统主题变化
    this.watchSystemTheme()
  },
  computed: {},
  methods: {
    // 初始化主题
    initTheme() {
      document.documentElement.setAttribute('data-theme', this.currentTheme)
    },
    // 切换主题
    toggleTheme() {
      this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light'
      document.documentElement.setAttribute('data-theme', this.currentTheme)
      localStorage.setItem('theme', this.currentTheme)
    },
    // 监听系统主题变化
    watchSystemTheme() {
      if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handleThemeChange = e => {
          if (!localStorage.getItem('theme')) {
            this.currentTheme = e.matches ? 'dark' : 'light'
            this.initTheme()
          }
        }
        mediaQuery.addListener(handleThemeChange)
        handleThemeChange(mediaQuery)
      }
    },
    // 切换模式
    changeMode(item) {
      this.canvas.currentMode = item.label
      this.canvas.currentModeItem = item
      this.canvas.currentModeStyle = this.calculationCanvasModeStyle()
    },
    // 计算画布模式样式
    calculationCanvasModeStyle() {
      this.canvas.canvasWarning = false
      const vw = utils.getVW()
      const effectiveWidth = vw - 752
      const warningStyle = {
        width: effectiveWidth - 10 + 'px',
        height: '100px',
        left: '355px',
        color: '#E6A23C',
        background: '#fdf6ec',
        borderColor: '#f5dab1',
        borderRadius: '4px',
        border: '1px solid'
      }
      let { label: mode, style } = this.canvas.currentModeItem
      if (mode === 'Phone') {
        if (effectiveWidth < 390 && effectiveWidth > 300) {
          style = {
            width: effectiveWidth - 60 + 'px',
            height: (effectiveWidth - 60) * (844 / 390) + 'px',
            left: '380px'
          }
        } else if (effectiveWidth < 300) {
          style = warningStyle
          this.canvas.canvasWarning = true
        }
      } else if (mode === 'Pad') {
        if (effectiveWidth < 768 && effectiveWidth > 500) {
          style = {
            width: effectiveWidth - 60 + 'px',
            height: (effectiveWidth - 60) * (1024 / 768) + 'px',
            left: '380px'
          }
        } else if (effectiveWidth < 600) {
          style = warningStyle
          this.canvas.canvasWarning = true
        }
      } else if (mode === 'PC') {
        if (effectiveWidth < 600) {
          style = warningStyle
          this.canvas.canvasWarning = true
        }
      }
      return style
    }
  }
})
console.log('Vue实例', app)
