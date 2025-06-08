export default {
  attrTabs: {
    tabs: [
      {
        label: '属性',
        name: 'attr'
      },
      {
        label: '事件',
        name: 'event'
      },
      { label: '样式', name: 'style' },
      { label: '高级', name: 'expert' }
    ],
    click(tab, vm) {
      console.log(tab, vm)
    },
    defaultTabs: 'attr' // 默认选中属性标签
  }
}
