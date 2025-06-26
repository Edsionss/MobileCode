import main from '@config/main.js'
const { leftModules, createAsyncComponent } = main
const { module, tools, event, modelValue, toolsShow, defaultModule } = leftModules

import componentModule from './components/ComponentModule/index.js'
Vue.component('component-module', componentModule)
const leftModulesComponent = {
  name: 'leftModulesComponent',
  props: {
    useModule: {
      type: Array,
      default: () => []
    },
    useTools: {
      type: Array,
      default: () => []
    }
  },
  template: `
  `,
  data() {
    return {
      module: module, // 配置的模块数组的原始数据
      tools: tools, // 配置的工具数组的原始数据
      currentModule: {}, // 当前模块数据
      currentTools: {}, // 当前工具数据
      event: event, // 配置的事件对象的原始数据
      modelValueData: modelValue, // 配置的动态data值的原始数据
      toolsShowData: toolsShow, // 配置的工具显示的原始数据
      defaultModule: defaultModule, //配置的默认选择模块
      modelValue: {}, //动态数据添加处
      toolsShow: {}, //工具栏显示隐藏
      currentModuleName: '', //当前模块名称
      search: '', //搜索框的值
      MAIN_DATA: {}
    }
  },
  computed: {
    toolsIf() {
      return this.toolsShow[this.toolsShowData.name]
    }
  },
  created() {
    this.configInit()
  },
  mounted() {},
  methods: {
    // 初始化配置
    configInit() {
      // 初始化配置工具显示值到data
      this.$set(this.toolsShow, this.toolsShowData.name, this.toolsShowData.value)
      // 初始化配置模块值到data
      for (const key in this.modelValueData) {
        let item = this.modelValueData[key]
        if (!this.modelValue.hasOwnProperty(key)) {
          this.$set(this.modelValue, key, item)
        }
      }
      //填充默认模块
      this.toolsIf &&
        this.module.forEach((item, index) => {
          if (item.tag == this.defaultModule) {
            this.updateState('module', item, index)
          }
        })
    },
    // 默认点击事件处理
    defaultClick(item, index, type) {
      this.updateState(type, item, index)
      if (typeof item.click === 'function') {
        item.click.bind(this)(item, index, this.modelValue)
      } else {
        this.event[item.click].bind(this)(item, index, this.modelValue)
      }
    },
    updateState(type, item, index) {
      if (type == 'module') {
        this.currentModule = { item, index }
        this.currentModuleName = item.name
      } else {
        this.currentTools = { item, index }
      }
    }
  }
}
// 使用 import.meta.url 可以帮助我们构建一个相对于当前 JS 文件的路径
// 这比硬编码 '..' 更健壮
const templateUrl = new URL('index.html', import.meta.url).href
const cssUrl = new URL('index.css', import.meta.url).href
// 4. 关键：调用加载器，将自己包装成异步组件，然后导出
export default createAsyncComponent(leftModulesComponent, templateUrl, cssUrl)
