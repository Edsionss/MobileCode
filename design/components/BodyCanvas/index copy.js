import main from '@config/main.js'
const { bodyCanvas, componentLoader, utils, Vant } = main
const createAsyncComponent = componentLoader.createAsyncComponent
// import ElementCanvas from './components/Element/index.js'
import LayuiCanvas from './components/Layui/index.js'
import VantCanvas from './components/Vant/index.js'
// import WotDesignCanvas from './components/WotDesign/index.js'
// Vue.component('Element', ElementCanvas)
Vue.component('layui-canvas', LayuiCanvas)
Vue.component('vant-canvas', VantCanvas)
// Vue.component('WotDesign', WotDesignCanvas)

const bodyCanvasComponent = {
  name: 'bodyCanvasComponent',
  template: `<div>Loading...</div>`,
  components: {
    vuedraggable: window.vuedraggable //当前页面注册组件
  },

  data() {
    return {
      drag: false,
      dragComponents: [],
      activeComponentId: {},
      componentsMenu: bodyCanvas.menu
    }
  },
  computed: {
    ...Vuex.mapState(['componentAttr'])
  },
  watch: {
    componentAttr: {
      handler(newVal) {
        console.log('componentAttr changed:', newVal)
        this.dragComponents.forEach(component => {
          if (component.id === newVal.componentId) {
            component.props = newVal.props
          }
        })
      },
      deep: true
    }
  },
  methods: {
    onStart(e) {
      // console.log('onStart', e)
    },
    onEnd(e) {
      this.drag = false
      // console.log('onEnd', e)
    },
    onClone(e) {
      // console.log('onClone', e)
    },
    onAddItem(event) {
      // console.log('onAddItem', event)
    },
    dragChange(item) {
      if (item.added) {
        let newItem = item.added.element
        this.$store.commit('setComponentConfig', newItem)
        this.clickComponents(newItem)
      }
    },
    // 这里的 component 是被点击的组件对象
    clickComponents(component) {
      this.$store.commit('setComponentConfig', component)
      console.log('clickComponents', component)

      this.activeComponentId = component.id
    },
    clickMenu(item, config) {
      item.click && item.click.bind(this)(config)
    },
    getComponentName(name) {
      const dict = {
        vant: 'vant-canvas',
        layui: 'layui-canvas'
      }
      return dict[name]
    }
  }
}
// 使用 import.meta.url 可以帮助我们构建一个相对于当前 JS 文件的路径
// 这比硬编码 '..' 更健壮
const templateUrl = new URL('index.html', import.meta.url).href
const cssUrl = new URL('index.css', import.meta.url).href
// 4. 关键：调用加载器，将自己包装成异步组件，然后导出
export default createAsyncComponent(bodyCanvasComponent, templateUrl, cssUrl)
