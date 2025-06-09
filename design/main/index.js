// 导入组件库
import headerComponent from '@components/Header/index.js'
import leftModulesComponent from '@components/LeftModules/index.js'
import rightAttributeComponent from '@components/RightAttribute/index.js'
import bodyCanvasComponent from '@components/BodyCanvas/index.js'
import utils from '@utils/index.js'
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
  provide() {
    return {
      dragComponents: this.dragComponents
    }
  },
  data() {
    return {
      currentGroup: 'form',
      currentComponent: 'input',
      currentTab: 'attr',
      //画布
      canvas: {
        currentMode: 'Phone',
        currentModeItem: {},
        canvasWarning: false,
        canvasWarningTitle: '当前模式下，画布宽度小于最小画布宽度，请调整画布宽度',
        canvasWarningStyle: {
          width: '100%',
          height: '100%',
          backgroundColor: '#f0f0f0'
        },
        currentModeStyle: {}
      }
    }
  },
  created() {},
  mounted() {},

  computed: {},
  methods: {
    dragComponents(item) {
      // console.log(item)
    },
    changeMode(item) {
      // console.log('当前模式', item)
      this.canvas.currentMode = item.label
      this.canvas.currentModeItem = item
      this.canvas.currentModeStyle = this.calculationCanvasModeStyle()
    },
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

  // 监听拖拽事件
})
console.log(app)
