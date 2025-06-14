import main from '@config/main.js'
const { header, componentLoader } = main
const { titleList, modeList, buttonList, version, icon, defaultMode, defaultVersionLabel } = header
const createAsyncComponent = componentLoader.createAsyncComponent
const headerComponent = {
  name: 'headerComponent',
  props: {
    chooseTitleList: {
      type: Array,
      default: () => titleList
    },
    chooseModeList: {
      type: Array,
      default: () => modeList
    },
    chooseButtonList: {
      type: Array,
      default: () => buttonList
    },
    chooseVersion: {
      type: String,
      default: () => version
    },
    chooseIcon: {
      type: String,
      default: () => icon
    },
    chooseMode: {
      type: String,
      default: () => defaultMode
    },
    defaultVersionLabel: {
      type: String,
      default: () => defaultVersionLabel
    }
  },
  template: `
    <div>Loading...</div>
  `,
  data() {
    return {
      titleList: this.chooseTitleList,
      modeList: this.chooseModeList,
      buttonList: this.chooseButtonList,
      version: this.chooseVersion,
      versionLabel: this.defaultVersionLabel,
      icon: this.chooseIcon,
      currentModeItem: {},
      currentMode: this.chooseMode,
      // 添加主题相关数据
      currentTheme: localStorage.getItem('theme') || 'light'
    }
  },
  created() {
    // 初始化数据
    this.loadData()
  },
  // 监听拖拽事件
  mounted() {
    // 监听窗口大小变化
    window.addEventListener(
      'resize',
      function () {
        this.$emit('change-mode', this.currentModeItem)
      }.bind(this)
    )
  },
  beforeDestroy() {
    // 移除事件监听器
    window.removeEventListener('resize')
  },
  methods: {
    changeMode(item) {
      if (item.label === this.currentMode) {
        return
      }
      this.currentMode = item.label
      this.currentModeItem = item
      this.$emit('change-mode', this.currentModeItem)
    },
    defaultClick(item) {
      console.log('默认点击事件', item)
      item.click && item.click.bind(this)(item)
    },
    loadData() {
      this.currentModeItem = this.modeList.find(item => item.label === this.currentMode)
      this.$emit('change-mode', this.currentModeItem)
    },
    // 切换主题
    toggleTheme() {
      this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light'
      this.$emit('toggleTheme', this.currentTheme)
      return
      document.documentElement.setAttribute('data-theme', this.currentTheme)
      localStorage.setItem('theme', this.currentTheme)
    }
  }
}
// 使用 import.meta.url 可以帮助我们构建一个相对于当前 JS 文件的路径
// 这比硬编码 '..' 更健壮
const templateUrl = new URL('index.html', import.meta.url).href
const cssUrl = new URL('index.css', import.meta.url).href
// 4. 关键：调用加载器，将自己包装成异步组件，然后导出
export default createAsyncComponent(headerComponent, templateUrl, cssUrl)
// export default headerComponent
