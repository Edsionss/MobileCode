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
      previewData: previewData,
      test: testdata,
      oldData: transition.componentsConfig.componentsConfig,
      formData: {}
    }
  },
  created() {
    this.initFormData()
  },
  mounted() {
    this.$bus.$on('formChange', (name, value) => {
      this.$set(this.formData, name, value)
    })
    this.$bus.$on('componentsClick', item => {
      item.click && item.click.bind(this)(item)
    })
  },
  beforeDestroy() {
    this.$bus.$off('formChange')
  },

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
    initFormData() {
      const tiledArray = this.recursion(this.oldData)
      tiledArray.forEach(item => {
        const valueName = item.valueName || item.id
        if (!this.formData.hasOwnProperty(valueName)) {
          this.$set(this.formData, valueName, item.defaultValue)
        }
      })
    }
  }
}
const templateUrl = new URL('index.html', import.meta.url).href
const cssUrl = new URL('index.css', import.meta.url).href
export default createAsyncComponent(previewComponents, templateUrl, cssUrl)
