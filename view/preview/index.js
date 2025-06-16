// 创建Vue实例
import previewData from './preview.js'
import PreviewCanvas from './components/PreviewCanvas/index.js'

Vue.component('preview-canvas', PreviewCanvas)
var app = new Vue({
  el: '#app',
  components: {},
  data() {
    return {
      previewData: previewData
    }
  },
  created() {},
  mounted() {},

  computed: {},
  methods: {}
})
console.log('Vue实例', app)
