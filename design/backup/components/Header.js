import main from '../../../config/main.js'
let header = main.header
const { titleList, modeList, buttonList, version, icon } = header
const headerComponent = {
  name: 'headerComponent',
  props: {
    defaultTitle: {
      type: Array
    },
    defaultMode: {
      type: Array
    },
    defaultButton: {
      type: Array
    },
    defaultVersion: {
      type: String
    },
    defaultIcon: {
      type: String
    }
  },
  template: `
    <div class="header-box">
      <div class="left-title">
        <div class="left-title-icon"><img :src="icon" alt=""></div>
        <div class="title-box">
          <div class="title-content" v-for="item in titleList" :key="item.id">
            {{ item.label }}
          </div>
        </div>
        <div class="left-title-version"><el-tag type="primary">V {{version}}</el-tag></div>
      </div>
      <div class="center-mode">
        <div class="mode-box" v-for="item in modeList" :key="item.id">
          <div class="mode-content">
            <div class="mode-content-icon"><img :src="item.icon" alt=""></div>
            <div class="mode-content-text">
              {{ item.label }}
            </div>
          </div>
        </div>
      </div>
      <div class="right-btn">
        <div class="button-box">
          <div class="button-item" v-for="item in buttonList" :key="item.id">
            <el-button :type="item.type || 'primary'" :icon="item.icon||'el-icon-thumb'"
              :disabled="item.disabled||false" :plain="item.plain||false" :round="item.round||false"
              :circle="item.circle||false" :size="item.size||'medium'" :loading="item.loading||false"
              :loading-text="item.loadingText||'加载中'" @click="item.click||defaultClick(item)">{{item.label}}</el-button>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      titleList: [],
      modeList: [],
      buttonList: [],
      version: '',
      icon: ''
    }
  },
  methods: {
    defaultClick(item) {
      console.log('默认点击事件', item)
    },
    loadDefaultData() {
      this.titleList = this.defaultTitle || titleList
      this.modeList = this.defaultMode || modeList
      this.buttonList = this.defaultButton || buttonList
      this.version = this.defaultVersion || version
      this.icon = this.defaultIcon || icon
    }
  },
  created() {
    // 初始化数据
    this.loadDefaultData()
  },
  // 监听拖拽事件
  mounted() {}
}
export default headerComponent
