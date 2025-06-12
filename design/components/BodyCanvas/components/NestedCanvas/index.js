import main from '@config/main.js'
const { componentLoader, utils, componentsMenu } = main
const createAsyncComponent = componentLoader.createAsyncComponent
// 这个组件会自我引用以实现嵌套
const NestedCanvas = {
  name: 'NestedCanvas', // 递归组件必须有 name 属性
  props: {
    // 在当前层级需要渲染的组件列表
    componentsList: {
      type: Array,
      required: true
    },
    // 当前选中的组件ID，需要逐层传递下去用于高亮
    activeComponentId: {
      type: [String, Number, Object],
      default: null
    }
  },
  // 需要注册父组件拥有的所有动态组件
  components: {
    // draggable: window.vuedraggable
    // 'vant-canvas': VantCanvas, // 假设 VantCanvas 已在作用域中
    // 'layui-canvas': LayuiCanvas // 假设 LayuiCanvas 已在作用域中
  },
  template: `
    
  `,
  data() {
    // 你的菜单数据应该从配置中获取
    return {
      // draggableList: [],
      componentsMenu: componentsMenu.menu
    }
  },
  computed: {
    // vuedraggable 的 v-model 需要一个带 setter 的计算属性才能正确工作
    draggableList: {
      get() {
        return this.componentsList
      },
      set(newValue) {
        // 当列表变化时，我们不能直接修改 props，而是通过事件通知父组件更新数据
        this.$emit('update:componentsList', newValue)
      }
    }
    // ...Vuex.mapState(['componentAttr'])
  },
  methods: {
    getComponentName(name) {
      const dict = {
        vant: 'vant-canvas',
        layui: 'layui-canvas'
      }
      return dict[name]
    },
    // 当组件被点击时，向上冒泡事件给最外层的父组件
    onComponentClick(config) {
      this.$emit('component-clicked', config)
    },
    // 当更深层级的组件被点击时，继续将事件向上传递
    bubbleClick(config) {
      this.$emit('component-clicked', config)
    },
    // 当拖拽操作改变了列表（添加、删除、移动）
    onDragChange(event) {
      this.$emit('change', event)
    },
    // 当更深层级的拖拽发生变化时，继续冒泡
    bubbleChange(event) {
      this.$emit('change', event)
    },
    onColChange(event, index) {
      this.$emit('change', event)
    },
    clickMenu(item, config) {
      // 在这里处理菜单点击，或者同样通过事件冒泡
      item.click && item.click.bind(this)(item, config, this.componentsList)
    }
  }
}
// 使用 import.meta.url 可以帮助我们构建一个相对于当前 JS 文件的路径
// 这比硬编码 '..' 更健壮
const templateUrl = new URL('index.html', import.meta.url).href
const cssUrl = new URL('index.css', import.meta.url).href
// 4. 关键：调用加载器，将自己包装成异步组件，然后导出
export default createAsyncComponent(NestedCanvas, templateUrl, cssUrl)
