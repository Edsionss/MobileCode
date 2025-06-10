import main from '@config/main.js'
const { componentLoader, utils, Vant } = main
const createAsyncComponent = componentLoader.createAsyncComponent
const VantCanvas = {
  name: 'VantCanvas',
  template: `<div>Loading...</div>`,
  components: {},
  props: {},
  inject: ['configComponentsAttr'],
  data() {
    return {
      componentsData: [],
      formData: {}
    }
  },
  created() {},
  computed: {
    ...Vuex.mapState(['componentAttr'])
  },
  watch: {
    componentAttr: {
      handler(newVal) {
        // console.log(newVal, this.componentsData, this.formData)
        this.componentsData.forEach(component => {
          if (component.id === newVal.componentId) {
            component.props = newVal.props
            this.$set(this.formData, component.id, newVal.value)
          }
        })
        console.log('this.componentsData', this.componentsData)
      },
      deep: true
    }
  },
  methods: {
    //添加表单的v-model值
    handelComponentValue() {
      this.componentsData.forEach(element => {
        if (element.groupName === 'form') {
          if (!this.formData.hasOwnProperty(element.id)) {
            this.$set(this.formData, element.id, element.defaultValue)
          }
        }
      })
    },
    //手动更新表单值
    componentEmittedInput(inputValueOrFile, component) {
      let newValue = inputValueOrFile
      this.$set(this.formData, component.id, newValue)
    },
    onStart(e) {
      // console.log('onStart', e)
    },
    onEnd(e) {
      this.drag = false
      // console.log('onEnd', e)
    },
    onClone(e) {
      // console.log('onClone', e)
    },
    onAddItem(event) {
      // console.log('onAddItem', event)
    },
    dragChange(item) {
      if (item.added) {
        this.handelComponentValue()
        this.configComponentsAttr({ ...item.added.element, componentName: 'vant' })
      }
    },
    // 点击组件时，配置组件属性
    // 这里的 component 是被点击的组件对象
    clickComponents(component) {
      this.configComponentsAttr({ ...component, componentName: 'vant' })
    }
  }
}
// 使用 import.meta.url 可以帮助我们构建一个相对于当前 JS 文件的路径
// 这比硬编码 '..' 更健壮
const templateUrl = new URL('index.html', import.meta.url).href
const cssUrl = new URL('index.css', import.meta.url).href
// 4. 关键：调用加载器，将自己包装成异步组件，然后导出
export default createAsyncComponent(VantCanvas, templateUrl, cssUrl)
