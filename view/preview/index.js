// 创建Vue实例
import previewData from './preview.js'
import testdata from './testdata.js'
import PreviewCanvas from './components/PreviewCanvas/index.js'
import transition from './transition.js'
Vue.component('preview-canvas', PreviewCanvas)
import main from '@config/main.js'
const { createAsyncComponent, utils } = main
const previewComponents = {
  name: 'Preview',
  components: {},
  data() {
    return {
      StitcherData: {},
      componentsList: [],
      formData: {},
      activeData: {}
    }
  },
  beforeCreate() {},
  created() {
    this.StitcherData = transition.StitcherData
    this.componentsList = transition.StitcherData.componentsConfig.componentsConfig
    this.initFormData()
    this.StitcherData.Create && this.StitcherData.Create.bind(this)()
  },
  mounted() {
    this.$bus.$on('formChange', (name, value) => {
      this.recursionUpdateForm(this.componentsList, name, value)
    })
    this.$bus.$on('componentsClick', item => {
      item.click && item.click.bind(this)(item)
    })
    this.StitcherData.Mounted && this.StitcherData.Mounted.bind(this)()
    this.$nextTick(() => {
      this.StitcherData.NextTick && this.StitcherData.NextTick.bind(this)()
    })
  },
  beforeDestroy() {
    this.$bus.$off('formChange')
    this.$bus.$off('componentsClick')
  },
  watch: {},
  computed: {},
  methods: {
    recursion(array) {
      let result = []
      const recursionFun = array => {
        array.forEach(item => {
          const { children, ...node } = item
          result.push(node)
          if (children && children.length) {
            recursionFun(children)
          }
        })
      }
      recursionFun(array)
      return result
    },
    recursionUpdateForm(array, valueName, newVal) {
      for (const item of array) {
        const itemValueName = item.valueName || item.id
        if (itemValueName == valueName) {
          this.$set(item, 'defaultValue', newVal)
          this.$set(item.props, 'defaultValue', newVal)
          this.$set(this.formData, valueName, newVal)
          return true // 找到了，返回 true 并终止所有层级的循环
        }
        if (item.children && item.children.length > 0) {
          // 递归调用，如果子调用返回了 true，说明找到了，也立刻终止当前循环
          if (this.recursionUpdateForm(item.children, valueName, newVal)) {
            return true
          }
        }
      }
      return false // 在当前层级没找到
    },
    initFormData() {
      const tiledArray = this.recursion(this.componentsList)
      tiledArray.forEach(item => {
        const valueName = item.valueName || item.id,
          groupName = item.groupName
        if (!this.formData.hasOwnProperty(valueName)) {
          if (groupName === 'form' || groupName === 'active') {
            this.$set(this.formData, valueName, item.defaultValue)
          }
        }
      })
    }
  }
}
const templateUrl = new URL('index.html', import.meta.url).href
const cssUrl = new URL('index.css', import.meta.url).href
export default createAsyncComponent(previewComponents, templateUrl, cssUrl)
