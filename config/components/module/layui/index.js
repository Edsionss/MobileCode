import AllDict from '@modules/components/main.js'
const vantModule = {
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
              tag: 'field'
            },
            {
              label: '按钮',
              tag: 'stepper'
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
let dict = AllDict.Vant
vantModule.group.forEach(group => {
  group.group.forEach(item => {
    item.children = item.children.map(child => {
      if (dict[child.tag]) {
        return (child = dict[child.tag](child))
      }
    })
  })
})
export default vantModule
