import { Layui } from '@modules/components/main.js'
const layuiModule = {
  defaultGroup: 'base',
  componentName: 'echarts',
  icon: 'el-icon-help',
  group: [
    {
      name: 'base',
      label: '基础组件',
      icon: 'el-icon-menu',
      group: [
        {
          name: 'layout',
          label: '布局组件',
          children: [
            {
              label: '栅格布局',
              tag: 'grid'
            },
            {
              label: '卡片容器',
              tag: 'card'
            }
          ]
        },
        {
          label: '表单',
          name: 'form',
          children: [
            {
              label: '输入框',
              tag: 'input'
            },
            {
              label: '下拉选择框',
              tag: 'select',
              options: [
                { label: '选项1', name: '1' },
                { label: '选项2', name: '2' },
                { label: '选项3', name: '3' }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'special',
      label: '特色组件',
      icon: 'el-icon-menu',
      group: []
    },
    {
      name: 'custom',
      label: '自定组件',
      icon: 'el-icon-menu',
      group: []
    }
  ]
}
let dict = Layui
layuiModule.group.forEach(group => {
  group.group.forEach(item => {
    item.children = item.children.map(child => {
      let extend = {}
      if (item.name === 'layout') {
        extend = {
          children: []
        }
        if (child.tag === 'grid') {
          extend.children = Array.from({ length: child.cols || 2 }, () => [])
        }
      }
      if (dict[child.tag]) {
        extend = {
          render: dict[child.tag](child)
        }
      }
      return (child = {
        ...child,
        ...extend,
        defaultValue: '',
        props: { attr: { label: child.label, tag: child.tag } },
        valueName: '',
        tag: 'lay-' + child.tag
      })
    })
  })
})
export default layuiModule
