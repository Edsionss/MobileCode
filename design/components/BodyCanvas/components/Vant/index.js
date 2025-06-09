import main from '@config/main.js'
const { componentLoader, utils, Vant } = main
const createAsyncComponent = componentLoader.createAsyncComponent
const VantCanvas = {
  name: 'VantCanvas',
  template: `<div>Loading...</div>`,
  components: {},
  props: {
    componentsList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      drag: false,
      componentsData: this.componentsList,
      formType: ['field']
    }
  },
  created() {},
  computed: {},
  watch: {
    componentsList(val) {
      this.componentsData = val
    }
  },
  methods: {
    handelForm() {
      // this.componentsData.map(item => {
      //   item.group = '表单'
      //   item = { component: 'van-form', children: [item] }
      // })
    }
  }
}
// 使用 import.meta.url 可以帮助我们构建一个相对于当前 JS 文件的路径
// 这比硬编码 '..' 更健壮
const templateUrl = new URL('index.html', import.meta.url).href
const cssUrl = new URL('index.css', import.meta.url).href
// 4. 关键：调用加载器，将自己包装成异步组件，然后导出
export default createAsyncComponent(VantCanvas, templateUrl, cssUrl)
