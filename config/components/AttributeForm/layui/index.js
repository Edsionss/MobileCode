export default {
  componentName: 'layui',
  group: 'layui',
  attr: [
    {
      group: 'layout',
      label: '布局',
      id: 'layout',
      icon: 'el-icon-menu',
      components: [
        {
          id: 'row',
          label: '栅格',
          component: 'el-row',
          props: [
            {
              el: 'input',
              name: 'label',
              label: '标题'
            }
          ]
        }
      ]
    },
    {
      group: 'form',
      label: '表单',
      id: 'form',
      icon: 'el-icon-document',
      components: [
        {
          component: 'input',
          props: [
            {
              el: 'input',
              name: 'label',
              label: '标题',
              events: {
                change: function (val) {
                  console.log('[Event] 姓名 Input "change":', val, this.currentTabName)
                }
              }
            },
            {
              el: 'input',
              name: 'placeholder',
              label: '提示语',
              events: {
                change: function (val) {
                  console.log('[Event] 姓名 Input "change":', val, this.currentTabName)
                }
              }
            },
            {
              el: 'input',
              name: 'name',
              label: '变量名',
              // tip: '变量名',
              // value: true,
              events: {
                change: function (val) {
                  console.log('[Event] 姓名 Input "change":', val, this.currentTabName)
                }
              }
            },
            {
              el: 'input',
              name: 'defaultValue',
              // label: '默认值',
              events: {
                change: function (val) {
                  console.log('[Event] 姓名 Input "change":', val, this.currentTabName)
                }
              }
            }
          ]
        }
      ]
    }
  ]
}
