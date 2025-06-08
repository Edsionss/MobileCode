import main from '@config/main.js'
const { bodyCanvas, componentLoader } = main
const createAsyncComponent = componentLoader.createAsyncComponent
const bodyCanvasComponent = {
  name: 'bodyCanvasComponent',
  template: `<div>Loading...</div>`,
  components: {
    vuedraggable: window.vuedraggable //当前页面注册组件
  },
  data() {
    return {
      drag: false,
      myArray: [
        { people: 'cn', id: 1123123, name: 'www.itxst.com' },
        { people: 'cn', id: 2456456, name: 'www.baidu.com' },
        { people: 'cn', id: 3456456, name: 'www.taobao.com' },
        { people: 'us', id: 4564564, name: 'www.google.com' }
      ]
    }
  },
  methods: {
    onStart() {
      this.drag = true
    },
    onEnd() {
      this.drag = false
    }
  }
}
// 使用 import.meta.url 可以帮助我们构建一个相对于当前 JS 文件的路径
// 这比硬编码 '..' 更健壮
const templateUrl = new URL('index.html', import.meta.url).href
const cssUrl = new URL('index.css', import.meta.url).href
// 4. 关键：调用加载器，将自己包装成异步组件，然后导出
export default createAsyncComponent(bodyCanvasComponent, templateUrl, cssUrl)
