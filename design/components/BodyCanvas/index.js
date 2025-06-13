import main from '@config/main.js'
const createAsyncComponent = main.componentLoader.createAsyncComponent

// 引入你的组件
import LayuiCanvas from './components/Layui/index.js'
import VantCanvas from './components/Vant/index.js'
// ！！！引入新的递归组件！！！
import NestedCanvas from './components/NestedCanvas/index.js' // 注意路径

Vue.component('layui-canvas', LayuiCanvas)
Vue.component('vant-canvas', VantCanvas)
Vue.component('nested-canvas', NestedCanvas)

const bodyCanvasComponent = {
  name: 'bodyCanvasComponent',
  template: `<div>Loading...</div>`,
  components: {
    vuedraggable: window.vuedraggable //当前页面注册组件
  },
  data() {
    return {
      drag: false,
      schema: [],
      selectedComponentId: null
    }
  },
  created() {
    this.$root.$on('update-canvas-component-props', this.handleRootPropsUpdate)
    // Any other existing created hook logic
  },
  beforeDestroy() {
    // Assuming Vue 2 based on project structure
    this.$root.$off('update-canvas-component-props', this.handleRootPropsUpdate)
    // Any other existing beforeDestroy hook logic
  },
  watch: {},
  methods: {
    // 这是新的点击处理器，由 NestedCanvas 冒泡的事件触发
    onComponentClick(component) {
      console.log('父组件捕获到点击事件:', component)
      this.$store.commit('setComponentConfig', component)
      this.activeComponentId = component.id
    },
    clickPage() {
      this.$store.commit('setComponentConfig', {})
      this.activeComponentId = null
    },
    onClone(e) {
      console.log('onClone', e)
    },
    onAddItem(event) {
      console.log('onAddItem', event)
      console.log('Item added to schema:', this.schema)
      // Optional: Automatically select the newly added component
      // this.selectComponent(this.schema[event.newIndex]);
      this.selectedComponentId = this.schema[event.newIndex].id
    },
    dragChange(item) {
      console.log('change', item)
    },
    selectComponent(component) {
      this.$emit('component-selected', component)
      this.selectedComponentId = component.id
      // Optional: add some visual indication for selection on the canvas itself
      console.log('Selected component on canvas:', component)
    },
    handleRootPropsUpdate({ componentId, newProps }) {
      const componentIndex = this.schema.findIndex(c => c.id === componentId)
      if (componentIndex !== -1) {
        // Update the props of the specific component in the schema array
        // Vue.set is essential for adding reactive properties or updating array elements by index
        // For updating an existing object's property reactively:
        this.$set(this.schema[componentIndex], 'props', newProps)

        // Log for verification
        console.log('BodyCanvas schema updated for component ID:', componentId, this.schema[componentIndex])
      }
    }
  }
}

// 你的异步加载器保持不变
const templateUrl = new URL('index.html', import.meta.url).href
const cssUrl = new URL('index.css', import.meta.url).href
export default createAsyncComponent(bodyCanvasComponent, templateUrl, cssUrl)
