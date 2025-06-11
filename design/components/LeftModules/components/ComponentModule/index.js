import main from '@config/main.js'
const { componentLoader, componentModule, utils } = main
const createAsyncComponent = componentLoader.createAsyncComponent
const ComponentModule = {
  name: 'ComponentModule',
  // props: { componentsArray: { type: Array, default: () => [] } },
  template: `
  `,
  inject: ['dragComponents'],
  data() {
    return {
      componentsArray: componentModule,
      activeFrameworkName: 'layui',
      activeTabs: {},
      groupShowStates: {}
    }
  },
  watch: {
    componentsArray: {
      handler() {
        this.initComponentsState()
      },
      deep: true
    }
  },
  created() {
    this.initComponentsState()
  },
  mounted() {},
  methods: {
    initComponentsState() {
      if (this.componentsArray.length === 0) return
      // this.activeFrameworkName = this.componentsArray[0].componentName
      this.componentsArray.forEach(framework => {
        this.$set(this.activeTabs, framework.componentName, framework.defaultGroup)
        if (framework.group) {
          framework.group.forEach(g => {
            if (g.group) {
              g.group.forEach(subG => {
                const key = `${framework.componentName}-${subG.name}`
                this.$set(this.groupShowStates, key, true)
              })
            }
          })
        }
      })
    },
    toggleFramework(frameworkName) {
      this.activeFrameworkName = this.activeFrameworkName === frameworkName ? '' : frameworkName
    },
    foldItem(frameworkName, groupName) {
      const key = `${frameworkName}-${groupName}`
      this.$set(this.groupShowStates, key, !this.groupShowStates[key])
    },
    isGroupOpen(frameworkName, groupName) {
      const key = `${frameworkName}-${groupName}`
      return this.groupShowStates[key]
    },
    getFrameworkIcon(name) {
      const icons = {
        ElementUI: 'el-icon-platform-eleme',
        VantUI: 'el-icon-mobile-phone',
        Layui: 'el-icon-monitor'
      }
      return icons[name] || 'el-icon-menu'
    },
    onClone(originalItem, parentGroup, framework) {
      let newItem = _.cloneDeep(originalItem)
      newItem.id = utils.generateUniqueId()
      newItem.framework = framework.componentName
      newItem.groupName = parentGroup.name
      newItem.groupLabel = parentGroup.label

      return newItem
    }
  }
}
// 使用 import.meta.url 可以帮助我们构建一个相对于当前 JS 文件的路径
// 这比硬编码 '..' 更健壮
const templateUrl = new URL('index.html', import.meta.url).href
const cssUrl = new URL('index.css', import.meta.url).href
// 4. 关键：调用加载器，将自己包装成异步组件，然后导出
export default createAsyncComponent(ComponentModule, templateUrl, cssUrl)
