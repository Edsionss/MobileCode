import main from '@config/main.js'
const { createAsyncComponent, utils, Wot } = main

const WotCanvas = {
  name: 'WotCanvas',
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
      formData: {}
    }
  },
  created() {
    this.handelComponentValue()
  },
  mounted() {},
  computed: {
    bindValue() {
      const groupName = this.config.groupName
      if (groupName === 'form' || groupName === 'active') return this.formData[this.valueName]
      return undefined
    },
    utils() {
      return utils
    },
    valueName() {
      return this.config.valueName || this.props.valueName || this.config.id
    },
    props() {
      return this.config.props || {}
    },
    defaultValue() {
      return this.config.defaultValue || this.props.defaultValue
    }
  },
  watch: {
    config: {
      handler(newValue, oldValue) {
        this.handelComponentValue()
      },
      deep: true
    }
  },

  methods: {
    dateFormatter(val) {},
    //添加表单的v-model值
    handelComponentValue() {
      const groupName = this.config.groupName
      if (groupName === 'form' || groupName === 'active') {
        this.$set(this.formData, this.valueName, this.defaultValue)
      }
    },
    //手动更新表单值
    componentEmittedInput(inputValueOrFile, component) {
      let newValue = inputValueOrFile
      this.$set(this.formData, this.valueName, newValue)
      this.$bus.$emit('formChange', this.valueName, newValue)
    },
    defaultClick(item) {
      this.$bus.$emit('componentsClick', item)
    }
  }
}
// 使用 import.meta.url 可以帮助我们构建一个相对于当前 JS 文件的路径
// 这比硬编码 '..' 更健壮
const templateUrl = new URL('index.html', import.meta.url).href
const cssUrl = new URL('index.css', import.meta.url).href
// 4. 关键：调用加载器，将自己包装成异步组件，然后导出
export default createAsyncComponent(WotCanvas, templateUrl, cssUrl)
