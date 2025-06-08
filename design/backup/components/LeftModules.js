import main from '../../../config/main.js'
let leftModules = main.leftModules
const { module, tools } = leftModules
const leftModulesComponent = {
  name: 'leftModulesComponent',
  props: {
    defaultModule: {
      type: Array
    },
    defaultTools: {
      type: Array
    }
  },
  template: `
    <div class="components-content">
      <div class="content">
        <div class="content-module">
          <div class="module-item" v-for="item in module">
            <div class="item-icon" @click="moduleClick(item)">
              <el-tooltip class="item" effect="dark" :content="item.name" placement="right">
                <img v-if="item.src" :src="item.src" alt="">
                <el-icon v-else :class="item.icon"></el-icon>
              </el-tooltip>
            </div>
          </div>
        </div>
        <div class="content-detail" v-if="fold">
          <div class="detail-header">
            <div class="header-left-title">标题</div>
            <div class="header-right-tools">
              <div class="tools-item" v-for="item in tools" @click="defaultClick(item)">
                <el-tooltip class="item" effect="dark" :content="item.name" placement="bottom">
                  <el-icon :class="item.icon"></el-icon>
                </el-tooltip>
              </div>
            </div>
          </div>
          <div class="detail-main">

          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      fold: false, // 控制组件折叠状态
      module: module,
      tools: tools,
      foldPin: false // 控制折叠图标状态
    }
  },
  methods: {
    moduleClick(item) {
      // 处理组件点击事件
      console.log('Clicked module:', item)
      this.fold = !this.fold
    },
    defaultClick(item) {
      // 默认点击事件处理
      console.log('Default click action for:', item)
      item.click && item.click(item, this)
    }
  },

  // 监听拖拽事件
  mounted() {}
}
export default leftModulesComponent
