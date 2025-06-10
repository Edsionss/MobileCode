import main from '@config/main.js'
const { bodyCanvas, componentLoader, utils, Vant } = main
const createAsyncComponent = componentLoader.createAsyncComponent
// import ElementCanvas from './components/Element/index.js'
// import LayuiCanvas from './components/Layui/index.js'
import VantCanvas from './components/Vant/index.js'
// import WotDesignCanvas from './components/WotDesign/index.js'
// Vue.component('Element', ElementCanvas)
// Vue.component('Layui', LayuiCanvas)
Vue.component('vant-canvas', VantCanvas)
// Vue.component('WotDesign', WotDesignCanvas)
// Vue.prototype.$componentsContextmenu = function (component, event) {
//   this.$contextmenu({
//     items: [
//       {
//         label: '返回(B)',
//         onClick: () => {
//           this.message = '返回(B)'
//           console.log('返回(B)')
//         }
//       },
//       { label: '前进(F)', disabled: true },
//       { label: '重新加载(R)', divided: true, icon: 'el-icon-refresh' },
//       { label: '另存为(A)...' },
//       { label: '打印(P)...', icon: 'el-icon-printer' },
//       { label: '投射(C)...', divided: true },
//       {
//         label: '使用网页翻译(T)',
//         divided: true,
//         minWidth: 0,
//         children: [{ label: '翻译成简体中文' }, { label: '翻译成繁体中文' }]
//       },
//       {
//         label: '截取网页(R)',
//         minWidth: 0,
//         children: [
//           {
//             label: '截取可视化区域',
//             onClick: () => {
//               this.message = '截取可视化区域'
//               console.log('截取可视化区域')
//             }
//           },
//           { label: '截取全屏' }
//         ]
//       },
//       { label: '查看网页源代码(V)', icon: 'el-icon-view' },
//       { label: '检查(N)' }
//     ],
//     event,
//     //x: event.clientX,
//     //y: event.clientY,
//     customClass: 'custom-class',
//     zIndex: 3,
//     minWidth: 230
//   })
//   return false
// }
const bodyCanvasComponent = {
  name: 'bodyCanvasComponent',
  template: `<div>Loading...</div>`,
  components: {
    vuedraggable: window.vuedraggable //当前页面注册组件
  },

  data() {
    return {
      drag: false,
      dragComponents: []
    }
  },
  computed: {},
  watch: {},
  methods: {}
}
// 使用 import.meta.url 可以帮助我们构建一个相对于当前 JS 文件的路径
// 这比硬编码 '..' 更健壮
const templateUrl = new URL('index.html', import.meta.url).href
const cssUrl = new URL('index.css', import.meta.url).href
// 4. 关键：调用加载器，将自己包装成异步组件，然后导出
export default createAsyncComponent(bodyCanvasComponent, templateUrl, cssUrl)
