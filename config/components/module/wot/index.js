import { Wot } from '@modules/components/main.js'
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
            },
            {
              label: '日期时间选择器',
              tag: 'datetimePicker'
            },
            {}
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
let dict = Wot
wotDesignModule.group.forEach(group => {
  group.group.forEach(item => {
    item.children = item.children.map(child => {
      if (dict[child.tag]) {
        return (child = { ...dict[child.tag](child), _DEFAULT_CONFIG_PROPS: { ..._.cloneDeep(child) } })
      }
      return console.error(
        `[Wot] 组件 ${child.tag} 不存在,请重新查看wot的组件配置，配置文件路径为`,
        import.meta.url
      )
    })
  })
})
export default wotDesignModule
