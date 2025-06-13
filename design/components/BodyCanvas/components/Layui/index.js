import main from '@config/main.js'
import { Layui as layuiDict } from '@modules/components/main.js'
const { componentLoader, utils } = main
const createAsyncComponent = componentLoader.createAsyncComponent
import layoutComponents from './components.js'
const LayuiCanvas = {
  name: 'LayuiCanvas',
  template: `<div>Loading...</div>`,
  components: { ...layoutComponents },
  props: {
    config: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  data() {
    return {
      formData: {},
      props: this.config.props
    }
  },
  created() {},
  mounted() {
    this.renderForm()
  },
  computed: {
    renderHtml() {
      if (layuiDict[this.props.tag]) {
        let extend = {}
        if (this.config.groupName == 'form') {
          extend = {
            name: this.config.id
          }
        }
        return layuiDict[this.props.tag]({ ...this.props, ...extend })
      }
    }
  },
  watch: {
    config: {
      handler(val) {
        this.renderForm()
        this.$set(this.$data, 'props', this.config.props)
      },
      deep: true
    }
  },
  methods: {
    renderForm() {
      this.$nextTick(() => {
        layui.form.render()
      })
    }
  }
}
// 使用 import.meta.url 可以帮助我们构建一个相对于当前 JS 文件的路径
// 这比硬编码 '..' 更健壮
const templateUrl = new URL('index.html', import.meta.url).href
const cssUrl = new URL('index.css', import.meta.url).href
// 4. 关键：调用加载器，将自己包装成异步组件，然后导出
export default createAsyncComponent(LayuiCanvas, templateUrl, cssUrl)
