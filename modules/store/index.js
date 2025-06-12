Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    componentAttr: {}, // 当前组件属性
    componentConfig: {}, // 当前组件配置
    componentsList: [] // 当前组件列表
  },
  mutations: {
    setComponentAttr(state, payload) {
      state.componentAttr = _.cloneDeep(payload)
    },
    setComponentConfig(state, payload) {
      state.componentConfig = _.cloneDeep(payload)
    },
    setComponentsList(state, payload) {
      state.componentsList = _.cloneDeep(payload)
    }
  },
  actions: {},
  getters: {}
})
