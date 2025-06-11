import main from '@config/main.js'
const { componentLoader } = main
const createAsyncComponent = componentLoader.createAsyncComponent
const canvasErrorComponent = {
  name: 'canvasErrorComponent',
  props: {},
  template: `
    <div>Loading...</div>
  `,
  data() {
    return {
      canvasWarningTitle: '当前模式下，画布宽度小于最小画布宽度，请调整画布宽度'
    }
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  methods: {}
}
// 使用 import.meta.url 可以帮助我们构建一个相对于当前 JS 文件的路径
// 这比硬编码 '..' 更健壮
const templateUrl = new URL('index.html', import.meta.url).href
const cssUrl = new URL('index.css', import.meta.url).href
// 4. 关键：调用加载器，将自己包装成异步组件，然后导出
export default createAsyncComponent(canvasErrorComponent, templateUrl, cssUrl)
