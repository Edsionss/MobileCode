Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    componentAttr: {} // 当前组件属性
  },
  mutations: {
    setComponentAttr(state, payload) {
      state.componentAttr = payload
    }
  },
  actions: {},
  getters: {}
})
