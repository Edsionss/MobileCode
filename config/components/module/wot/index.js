import { WotDesign } from '@modules/components/main.js'
const wotDesignModule = {
  defaultGroup: 'base',
  componentName: 'wot',
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
              tag: 'input'
            },
            {
              label: '数字输入框',
              tag: 'inputNumber'
            },
            {
              label: '选择器',
              tag: 'picker'
            },
            {
              label: '多功能选择器',
              tag: 'selectPicker'
            }
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
let dict = WotDesign
wotDesignModule.group.forEach(group => {
  group.group.forEach(item => {
    item.children = item.children.map(child => {
      if (dict[child.tag]) {
        return (child = { ...dict[child.tag](child), _DEFAULT_CONFIG_PROPS: { ..._.cloneDeep(child) } })
      }
    })
  })
})
export default wotDesignModule
