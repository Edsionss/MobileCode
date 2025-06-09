import main from '@config/main.js'
const { componentLoader, componentModule, utils } = main
const createAsyncComponent = componentLoader.createAsyncComponent
const ComponentModule = {
  name: 'ComponentModule',
  props: {
    componentsArray: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  template: `
  `,
  inject: ['dragComponents'],
  data() {
    return {
      componentModule: componentModule,
      groupName: '',
      show: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    defaultClick() {},
    foldItem(item) {
      this.show = !this.show
    },
    onStart(e) {},
    onEnd(array, event) {
      if (event.pullMode === 'clone') {
        if (typeof this.dragComponents === 'function') {
          this.dragComponents(array.children[event.oldIndex])
        }
      }
    },
    // 添加新组件
    onClone(item) {
      let type = ''
      this.componentModule.group.map(group => {
        group.group.map(groupItem => {
          groupItem.children.map(child => {
            if ((child.id = item.id)) {
              child.groupLabel = groupItem.label
              child.groupName = groupItem.name
            }
          })
        })
      })
      let NewItem = {
        ...item,
        id: utils.generateUniqueId(),
        groupLabel: item.groupLabel, // 添加 groupType 属性
        groupName: item.groupName
      }
      console.log('add', NewItem)

      return NewItem
    }
  }
}
// 使用 import.meta.url 可以帮助我们构建一个相对于当前 JS 文件的路径
// 这比硬编码 '..' 更健壮
const templateUrl = new URL('index.html', import.meta.url).href
const cssUrl = new URL('index.css', import.meta.url).href
// 4. 关键：调用加载器，将自己包装成异步组件，然后导出
export default createAsyncComponent(ComponentModule, templateUrl, cssUrl)
