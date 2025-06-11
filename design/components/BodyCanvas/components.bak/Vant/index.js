import main from '@config/main.js'
const { componentLoader, utils, Vant } = main
const createAsyncComponent = componentLoader.createAsyncComponent
const VantCanvas = {
  name: 'VantCanvas',
  template: `<div>Loading...</div>`,
  components: {},
  props: {
    config: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  data() {
    return {
      // config: {},
      formData: {}
    }
  },
  created() {
    this.handelComponentValue()
  },

  watch: {
    config() {
      console.log(this.config)
      this.handelComponentValue()
    }
  },
  methods: {
    //添加表单的v-model值
    handelComponentValue() {
      // this.componentsData.forEach(element => {
      //   if (element.groupName === 'form') {
      //     if (!this.formData.hasOwnProperty(element.id)) {
      //       this.$set(this.formData, element.id, element.defaultValue)
      //     }
      //   }
      // })
      let config = this.config
      if (config.groupName === 'form') {
        if (!this.formData.hasOwnProperty(config.id)) {
          this.$set(this.formData, config.id, config.defaultValue)
        }
      }
    },
    //手动更新表单值
    componentEmittedInput(inputValueOrFile, component) {
      let newValue = inputValueOrFile
      this.$set(this.formData, component.id, newValue)
    }
  }
}
// 使用 import.meta.url 可以帮助我们构建一个相对于当前 JS 文件的路径
// 这比硬编码 '..' 更健壮
const templateUrl = new URL('index.html', import.meta.url).href
const cssUrl = new URL('index.css', import.meta.url).href
// 4. 关键：调用加载器，将自己包装成异步组件，然后导出
export default createAsyncComponent(VantCanvas, templateUrl, cssUrl)
