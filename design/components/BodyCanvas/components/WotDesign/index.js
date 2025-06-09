import main from '@config/main.js'
const { bodyCanvas, componentLoader, utils, Vant } = main
const createAsyncComponent = componentLoader.createAsyncComponent
import './components/BodyCanvas/index.css'
const bodyCanvasComponent = {
  name: 'bodyCanvasComponent',
  template: `<div>Loading...</div>`,
  components: {
    vuedraggable: window.vuedraggable //当前页面注册组件
  },

  data() {
    return {
      drag: false,
      dragComponents: []
    }
  },
  computed: {
    // renderComponents() {
    //   // 这里可以根据实际的 schema 结构来调整
    //   return this.schema.components || []
    // }
  },
  watch: {},
  methods: {
    onStart(e) {
      this.drag = true
      console.log('onStart', e)
    },
    onEnd(e) {
      this.drag = false
      console.log('onEnd', e)
    },
    onClone(e) {
      console.log('onClone', e)
    },
    onAddItem(event) {
      console.log('onAddItem', event)
    },
    dragChange(item) {
      console.log('change', item)
      console.log(this.dragComponents)
    }
  }
}
// 使用 import.meta.url 可以帮助我们构建一个相对于当前 JS 文件的路径
// 这比硬编码 '..' 更健壮
const templateUrl = new URL('index.html', import.meta.url).href
const cssUrl = new URL('index.css', import.meta.url).href
// 4. 关键：调用加载器，将自己包装成异步组件，然后导出
export default createAsyncComponent(bodyCanvasComponent, templateUrl, cssUrl)
