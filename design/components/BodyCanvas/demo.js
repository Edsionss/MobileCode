import main from '@config/main.js'
const { bodyCanvas, componentLoader } = main
const createAsyncComponent = componentLoader.createAsyncComponent

// 示例：源组件列表
const sourceComponents = [
  // 一个简单的、非容器组件
  {
    name: 'Vant 按钮',
    framework: 'vant',
    type: 'Button',
    props: { text: '按钮' }
  },
  // 一个可以容纳其他组件的 Vant 组件
  {
    name: 'Vant 卡片容器',
    framework: 'vant',
    type: 'Card', // 假设这是一个容器
    props: { title: '卡片' },
    children: [] // <-- 重要！
  },
  // 一个可以容纳其他组件的 Layui 组件
  {
    name: 'Layui 面板容器',
    framework: 'layui',
    type: 'Panel', // 这也是一个容器
    props: { title: '面板' },
    children: [] // <-- 重要！
  }
]

// 引入你的组件
import LayuiCanvas from './components/Layui/index.js'
import VantCanvas from './components/Vant/index.js'
// ！！！引入新的递归组件！！！
import NestedCanvas from './components/NestedCanvas.js' // 注意路径

Vue.component('layui-canvas', LayuiCanvas)
Vue.component('vant-canvas', VantCanvas)

const bodyCanvasComponent = {
  name: 'bodyCanvasComponent',
  // 模板现在从上面那个极简的 HTML 文件加载
  components: {
    // 注册递归组件，这样模板才能使用它
    NestedCanvas
  },
  data() {
    return {
      // 这是最顶层的、唯一的组件数据源
      dragComponents: [],
      activeComponentId: null, // 从对象简化为 null
      componentsMenu: bodyCanvas.menu
    }
  },
  computed: {
    ...Vuex.mapState(['componentAttr'])
  },
  watch: {
    // 这个 watcher 逻辑需要调整以支持在嵌套结构中查找组件
    componentAttr: {
      handler(newVal) {
        console.log('componentAttr changed:', newVal)
        // 需要一个递归函数来在组件树中查找并更新组件
        const findAndApply = (components, id, props) => {
          for (const component of components) {
            if (component.id === id) {
              // 使用 Vue.set 以确保响应性
              this.$set(component, 'props', props)
              return true // 找到了
            }
            // 如果有子节点，就递归查找
            if (component.children && component.children.length > 0) {
              if (findAndApply(component.children, id, props)) {
                return true // 在子节点中找到了
              }
            }
          }
          return false // 在这个分支没找到
        }
        findAndApply(this.dragComponents, newVal.componentId, newVal.props)
      },
      deep: true
    }
  },
  methods: {
    // 这是新的点击处理器，由 NestedCanvas 冒泡的事件触发
    onComponentClick(component) {
      console.log('父组件捕获到点击事件:', component)
      this.$store.commit('setComponentConfig', component)
      this.activeComponentId = component.id
    },

    // 这是新的 change 处理器，由 vuedraggable 的 change 事件触发
    onDragChange(item) {
      // `added` 事件对于新组件拖入最重要
      if (item.added) {
        let newItem = item.added.element
        // 确保新拖入的容器有一个空的 children 数组
        if (newItem.children && !Array.isArray(newItem.children)) {
          newItem.children = []
        }
        console.log('一个项目被添加到了列表中:', newItem)
        // 选中新添加的组件
        this.$store.commit('setComponentConfig', newItem)
        this.activeComponentId = newItem.id
      }
    }
    // 你原来的 onStart, onEnd 等方法可以移除了，因为 draggable 实例已不在这个组件里直接管理
  }
}

// 你的异步加载器保持不变
const templateUrl = new URL('index.html', import.meta.url).href
const cssUrl = new URL('index.css', import.meta.url).href
export default createAsyncComponent(bodyCanvasComponent, templateUrl, cssUrl)
