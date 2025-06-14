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
            {
              label: '单选框',
              tag: 'radio'
            },
            {
              label: '复选框',
              tag: 'checkbox'
            },
            {
              label: '开关',
              tag: 'switch'
            },
            {
              label: '滑块',
              tag: 'slider'
            },
            {
              label: '评分',
              tag: 'rate'
            },
            {
              label: '上传',
              tag: 'uploader'
            }
          ]
        },
        {
          label: '布局',
          name: 'layout',
          children: [
            {
              label: '单元格',
              tag: 'cell'
            },
            {
              label: '单元格组',
              tag: 'cellGroup'
            },
            {
              label: '分割线',
              tag: 'divider'
            }
          ]
        },
        {
          label: '反馈',
          name: 'feedback',
          children: [
            {
              label: '弹出层',
              tag: 'popup'
            },
            {
              label: '对话框',
              tag: 'dialog'
            },
            {
              label: '轻提示',
              tag: 'toast'
            },
            {
              label: '加载',
              tag: 'loading'
            }
          ]
        },
        {
          label: '展示',
          name: 'display',
          children: [
            {
              label: '按钮',
              tag: 'button'
            },
            {
              label: '标签',
              tag: 'tag'
            },
            {
              label: '进度条',
              tag: 'progress'
            },
            {
              label: '图片',
              tag: 'img'
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
