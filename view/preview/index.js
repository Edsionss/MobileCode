// 创建Vue实例
import previewData from './preview.js'
import testdata from './testdata.js'
import PreviewCanvas from './components/PreviewCanvas/index.js'
import transition from './transition.js'
Vue.component('preview-canvas', PreviewCanvas)
var app = new Vue({
  el: '#app',
  components: {},
  data() {
    return {
      previewData: previewData,
      test: testdata,
      oldData: transition.componentsConfig.form
    }
  },
  created() {
    console.log(this.recursion(testdata.modules))
  },
  mounted() {},

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
    }
  }
})
console.log('Vue实例', app)
