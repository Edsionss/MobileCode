import AllDict from '@modules/components/main.js'
const vantModule = {
  defaultGroup: 'base',
  componentName: 'vant',
  icon: 'el-icon-mobile-phone',
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
              label: '计数器',
              tag: 'stepper'
            },
            {
              label: '选择器',
              tag: 'picker'
            },
            {
              label: '选择器1',
              tag: 'fieldPicker'
            }
            // {
            //   label: '时间选择器',
            //   tag: 'datetime-picker'
            // },
            // {
            //   label: '日期选择器',
            //   tag: 'date-picker'
            // }
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
        return (child = { ...dict[child.tag](child), _DEFAULT_CONFIG_PROPS: { ..._.cloneDeep(child) } })
      }
    })
  })
})
export default vantModule
