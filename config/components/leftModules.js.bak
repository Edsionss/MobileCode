export default {
  module: [
    {
      name: '组件',
      tag: 'component-module',
      icon: 'el-icon-guide',
      src: '',
      click: 'moduleClick',
      search: true
    },
    {
      name: '数据源',
      tag: 'datasource',
      icon: 'el-icon-coin',
      src: '',
      click: 'moduleClick',
      search: false
    },
    {
      name: '帮助',
      tag: 'help',
      icon: 'el-icon-warning-outline',
      src: '',
      click: 'moduleClick',
      search: true
    },
    {
      name: '模板',
      tag: 'template',
      icon: 'el-icon-document-copy',
      src: '',
      click: 'moduleClick'
    }
  ],
  defaultModule: 'component-module',
  modelValue: {
    foldPin: false,
    lastClickModule: '',
    lastClickTool: ''
  },
  toolsShow: {
    name: 'tShow',
    value: true
  },
  tools: [
    {
      name: '固定面板',
      icon: 'el-icon-upload2',
      style: {},
      click: function (item, index, modelValue) {
        modelValue.foldPin = !modelValue.foldPin
        modelValue.foldPin && (item.style = { color: '#409EFF' })
        modelValue.foldPin || (item.style = {})
      }
    },
    {
      name: '关闭面板',
      icon: 'el-icon-close',
      style: {},
      click: function (item, index, modelValue) {
        this.toolsShow.tShow = false
      }
    }
  ],
  event: {
    moduleClick: function (item, index, modelValue) {
      let { lastClickModule, foldPin } = modelValue
      if (!lastClickModule) {
        this.toolsShow.tShow = true
      } else if (lastClickModule == item.name && !foldPin) {
        this.toolsShow.tShow = !this.toolsShow.tShow
      } else {
        this.toolsShow.tShow = true
        //切换不同的模块内容
      }
      modelValue.lastClickModule = item.name
    }
  }
}
