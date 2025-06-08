// import { bodyCanvas } from '../config/global/global.js'
const bodyCanvasComponent = {
  name: 'bodyCanvasComponent',
  template: `
    <div class="canvas-container">
      <div>
        <div>{{drag?'拖拽中':'拖拽停止'}}</div>
        <draggable v-model="myArray" chosen-class="chosen" force-fallback="true" group="people" animation="1000"
          @start="onStart" @end="onEnd">
          <transition-group>
            <div class="item" v-for="element in myArray" :key="element.id">{{element.name}}</div>
          </transition-group>
        </draggable>
      </div>
    </div>
  `,
  components: {
    // vuedraggable: window.vuedraggable,//当前页面注册组件
  },
  data() {
    return {
      drag: false,
      myArray: [
        { people: 'cn', id: 1, name: 'www.itxst.com' },
        { people: 'cn', id: 2, name: 'www.baidu.com' },
        { people: 'cn', id: 3, name: 'www.taobao.com' },
        { people: 'us', id: 4, name: 'www.google.com' }
      ]
    }
  },
  methods: {
    onStart() {
      this.drag = true
    },
    onEnd() {
      this.drag = false
    }
  }
}
export default bodyCanvasComponent
