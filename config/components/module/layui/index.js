import AllDict from '@modules/components/main.js'
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
          label: '表单',
          name: 'form',
          children: [
            {
              label: '输入框',
              tag: 'input'
            },
            {
              label: 'select',
              tag: 'select',
              options: [
                { label: '选项1', value: '1' },
                { label: '选项2', value: '2' },
                { label: '选项3', value: '3' }
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
let dict = AllDict.layui
layuiModule.group.forEach(group => {
  group.group.forEach(item => {
    item.children = item.children.map(child => {
      if (dict[child.tag]) {
        return (child = {
          defaultValue: '',
          props: { attr: { label: child.label, tag: child.tag } },
          render: dict[child.tag](child),
          valueName: ''
        })
      }
    })
  })
})
export default layuiModule
