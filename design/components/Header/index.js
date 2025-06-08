import main from '@config/main.js'
const { header, componentLoader } = main
const { titleList, modeList, buttonList, version, icon } = header
const createAsyncComponent = componentLoader.createAsyncComponent
const headerComponent = {
  name: 'headerComponent',
  props: {
    defaultTitle: {
      type: Array
    },
    defaultMode: {
      type: Array
    },
    defaultButton: {
      type: Array
    },
    defaultVersion: {
      type: String
    },
    defaultIcon: {
      type: String
    }
  },
  template: `
    <div>Loading...</div>
  `,
  data() {
    return {
      titleList: [],
      modeList: [],
      buttonList: [],
      version: '',
      icon: ''
    }
  },
  methods: {
    defaultClick(item) {
      console.log('默认点击事件', item)
    },
    loadDefaultData() {
      this.titleList = this.defaultTitle || titleList
      this.modeList = this.defaultMode || modeList
      this.buttonList = this.defaultButton || buttonList
      this.version = this.defaultVersion || version
      this.icon = this.defaultIcon || icon
    }
  },
  created() {
    // 初始化数据
    this.loadDefaultData()
  },
  // 监听拖拽事件
  mounted() {}
}
// 使用 import.meta.url 可以帮助我们构建一个相对于当前 JS 文件的路径
// 这比硬编码 '..' 更健壮
const templateUrl = new URL('index.html', import.meta.url).href
const cssUrl = new URL('index.css', import.meta.url).href
// 4. 关键：调用加载器，将自己包装成异步组件，然后导出
export default createAsyncComponent(headerComponent, templateUrl, cssUrl)
// export default headerComponent
