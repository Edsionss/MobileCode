// 导入组件
import headerComponent from '@designComponents/Header/index.js'
import leftModulesComponent from '@designComponents/LeftModules/index.js'
import rightAttributeComponent from '@designComponents/RightAttribute/index.js'
import bodyCanvasComponent from '@designComponents/BodyCanvas/index.js'
import canvasErrorComponent from '@designComponents/CanvasError/index.js'
import main from '@config/main.js'
const { createAsyncComponent, utils } = main
//全局注册组件

Vue.component('header-component', headerComponent)
Vue.component('modules-component', leftModulesComponent)
Vue.component('attribute-component', rightAttributeComponent)
Vue.component('canvas-component', bodyCanvasComponent)
Vue.component('canvas-error-component', canvasErrorComponent)

// 创建Vue实例
const designComponent = {
  name: 'design',
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
      // 添加主题相关数据
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
  created() {},
  mounted() {
    this.$bus.$on('change-mode', this.changeMode)
  },
  beforeDestroy() {
    this.$bus.$off('change-mode')
  },
  computed: {},
  methods: {
    // 切换模式
    changeMode(item) {
      this.canvas.currentMode = item.label
      this.canvas.currentModeItem = item
      this.canvas.currentModeStyle = this.calculationCanvasModeStyle()
      this.$store.commit('setDesignMode', item)
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
}
const templateUrl = new URL('index.html', import.meta.url).href
const cssUrl = new URL('index.css', import.meta.url).href
export default createAsyncComponent(designComponent, templateUrl, cssUrl)
