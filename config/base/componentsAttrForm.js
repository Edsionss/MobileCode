import dict from '@modules/componentsDict.js'
const componentsAttrForm = [
  {
    group: 'layout',
    label: '布局',
    id: 'layout',
    icon: 'el-icon-menu',
    components: [
      {
        id: 'row',
        label: '栅格',
        component: 'el-row'
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
        attr: [
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
            name: 'defaultValue',
            label: '默认值',
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
          }
        ]
      }
    ]
  },
  {
    group: 'dataShow',
    label: '数据展示',
    id: 'dataShow',
    icon: 'el-icon-document',
    components: [
      {
        id: 'div',
        label: 'div',
        component: 'div'
      }
    ]
  },
  {
    group: 'other',
    label: '其他',
    id: 'other',
    icon: 'el-icon-document',
    components: [
      {
        id: 'div',
        label: 'div',
        component: 'div'
      }
    ]
  }
]
// componentsAttrForm.forEach(group => {
//   let componentsList = group.components
//   componentsList.forEach(component => {
//     let componentAttr = component.attr
//     componentAttr &&
//       componentAttr.forEach(item => {
//         item = dict[item.el](item)
//       })
//   })
// })
componentsAttrForm.forEach(group => {
  group.components.forEach(component => {
    if (component.attr) {
      component.attr = component.attr.map(item => dict[item.el](item))
    }
  })
})
export default componentsAttrForm
// 其他组件可以继续添加到对应的组中
