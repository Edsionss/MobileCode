const layuiModule = {
  defaultGroup: 'base',
  componentName: 'layui',
  icon: 'el-icon-monitor',
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
            },
            {
              label: '多选下拉框',
              tag: 'xmSelect',
              other: true,
              options: [
                { name: '选项1', value: '1' },
                { name: '选项2', value: '2' },
                { name: '选项3', value: '3' }
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
      let result = {
        ...extend,
        props: { ...child, defaultValue: '' }
      }
      child = {
        _DEFAULT_CONFIG_PROPS: { ..._.cloneDeep(result) },
        ...result,
        tag: 'lay-' + child.tag
      }
      return child
    })
  })
})
export default layuiModule
