export default {
  componentName: 'Vant',
  group: 'Vant',
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
          attr: [
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
          component: 'van-field',
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
              el: 'switch',
              name: 'clearable',
              label: '可清空',
              tip: '输入框是否可清空',
              value: true,
              events: {
                change: function (val) {
                  console.log('[Event] 姓名 Input "change":', val, this.currentTabName)
                }
              }
            },
            {
              el: 'select',
              name: 'type',
              label: '类型',
              tip: '输入框类型',
              value: 'text',
              options: [
                { label: '文本', value: 'text' },
                { label: '密码', value: 'password' },
                { label: '数字', value: 'number' }
              ],
              events: {
                change: function (val) {
                  console.log('[Event] 姓名 Input "change":', val, this.currentTabName)
                }
              }
            }
          ],
          attr: [
            {
              el: 'input',
              name: 'defaultValue',
              label: '默认值',
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
