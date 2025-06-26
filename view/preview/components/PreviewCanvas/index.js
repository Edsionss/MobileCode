import main from '@config/main.js'
const { createAsyncComponent, utils } = main

import LayuiCanvas from '@designComponents/BodyCanvas/components/Layui/index.js'
import VantCanvas from '@designComponents/BodyCanvas/components/Vant/index.js'
import WotCanvas from '@designComponents/BodyCanvas/components/Wot/index.js'
Vue.component('layui-canvas', LayuiCanvas.remove(['css']))
Vue.component('vant-canvas', VantCanvas.remove(['css']))
Vue.component('wot-canvas', WotCanvas.remove(['css']))
// 这个组件会自我引用以实现嵌套
const PreviewCanvas = {
  name: 'PreviewCanvas', // 递归组件必须有 name 属性
  props: {
    // 在当前层级需要渲染的组件列表
    componentsList: {
      type: Array,
      required: true
    }
  },
  // 需要注册父组件拥有的所有动态组件
  components: {},
  template: `
    
  `,
  data() {
    // 你的菜单数据应该从配置中获取
    return {}
  },
  computed: {},
  methods: {
    getComponentName(name) {
      const dict = {
        vant: 'vant-canvas',
        layui: 'layui-canvas',
        wot: 'wot-canvas'
      }
      return dict[name]
    }
  }
}
// 使用 import.meta.url 可以帮助我们构建一个相对于当前 JS 文件的路径
const templateUrl = new URL('index.html', import.meta.url).href
const cssUrl = new URL('index.css', import.meta.url).href
export default createAsyncComponent(PreviewCanvas, templateUrl, cssUrl)
