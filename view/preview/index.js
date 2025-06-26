// 创建Vue实例
import PreviewCanvas from './components/PreviewCanvas/index.js'
import Transition from './transition.js'
Vue.component('preview-canvas', PreviewCanvas)
import main from '@config/main.js'
const { createAsyncComponent, utils } = main
const previewComponents = {
  name: 'Preview',
  components: {},
  data() {
    return {
      StitcherData: {},
      componentsList: [],
      formData: {},
      activeData: {},
      pageId: '1910535744010051584',
      bindParamsDict: {},
      requestBindParams: {}
    }
  },
  beforeCreate() {},
  created() {
    Transition(this.pageId, layui, data => {
      if (data) {
        // 在这里，可以安全地进行赋值和后续操作
        this.StitcherData = data // 赋值给组件数据
        this.componentsList = data.componentsConfig.componentsConfig // 获取组件列表
        this.bindParamsDict = data.bindParamsDict || {} // 获取绑定参数字典
        this.requestBindParams = data.defaultBindParams || {} // 获取默认绑定参数
        this.initFormData() // 初始化表单数据
        if (this.StitcherData.Create) {
          this.StitcherData.Create.bind(this)()
        }
      } else {
        // 处理初始化失败的情况
        console.error('页面初始化失败，未能获取到数据。')
      }
    })
  },
  mounted() {
    // 监听表单数据变化并更新组件数据
    this.$bus.$on('formChange', (name, value) => {
      this.recursionUpdateForm(this.componentsList, name, value)
      this.requestBindParams = this.getDataSourceParams()
    })
    // 监听组件点击事件
    this.$bus.$on('componentsClick', item => {
      item.click && item.click.bind(this)(item)
    })
    // 监听表格分页变化事件
    this.$bus.$on('tablePageChange', data => {
      this.requestTableData(data)
    })
    // 监听图表的数据请求
    this.$bus.$on('echartsGetData', data => {
      this.requestEchartsData(data)
    })
    // 调用 StitcherData 的 Mounted 方法，如果存在的话
    this.StitcherData.Mounted && this.StitcherData.Mounted.bind(this)()
    this.$nextTick(() => {
      // 调用 StitcherData 的 NextTick 方法，如果存在的话
      this.StitcherData.NextTick && this.StitcherData.NextTick.bind(this)()
    })
  },
  beforeDestroy() {
    // 在组件销毁前，移除所有事件监听器
    this.$bus.$off('formChange')
    this.$bus.$off('componentsClick')
    this.$bus.$off('tablePageChange')
  },
  watch: {},
  computed: {},
  methods: {
    // 递归将树形结构转换为一维数组
    recursion(array) {
      let result = []
      const recursionFun = array => {
        array.forEach(item => {
          const { children, ...node } = item
          result.push(node)
          if (children && children.length) {
            recursionFun(children)
          }
        })
      }
      recursionFun(array)
      return result
    },
    // 递归更新表单数据
    recursionUpdateForm(array, valueName, newVal) {
      for (const item of array) {
        const itemValueName = item.valueName || item.id
        if (itemValueName == valueName) {
          this.$set(item, 'defaultValue', newVal)
          this.$set(item.props, 'defaultValue', newVal)
          this.$set(this.formData, valueName, newVal)
          return true // 找到了，返回 true 并终止所有层级的循环
        }
        if (item.children && item.children.length > 0) {
          // 递归调用，如果子调用返回了 true，说明找到了，也立刻终止当前循环
          if (this.recursionUpdateForm(item.children, valueName, newVal)) {
            return true
          }
        }
      }
      return false // 在当前层级没找到
    },
    //初始化表单数据
    initFormData() {
      const tiledArray = this.recursion(this.componentsList)
      tiledArray.forEach(item => {
        const valueName = item.valueName || item.id,
          groupName = item.groupName
        if (!this.formData.hasOwnProperty(valueName)) {
          if (groupName === 'form' || groupName === 'active') {
            const Val = item.defaultValue || item.props.paramsValue || item.props.defaultValue
            this.$set(this.formData, valueName, Val)
          }
        }
      })
    },
    // requestDataSource(components, requestBindParams) {
    //   const flattenedComponents = this.recursion(components)
    //   flattenedComponents.forEach(config => {
    //     if (config.groupName === 'dataView') {
    //       const { tag, props, id: componentId } = config // 解构出组件ID
    //       if (tag === 'lay-table') {
    //         const { dataSource, page: isPage, pageProps } = props,
    //           { current: page, pageSize: limit } = pageProps || {},
    //           baseParams = { id: dataSource, limit, page },
    //           where = {
    //             ...baseParams,
    //             page: 1,
    //             param: requestBindParams
    //           }
    //         this.requestTableData(where, componentId)
    //         // layui.$.ajax({
    //         //   url: '/api/dsjfx/data-source/preview',
    //         //   type: 'post',
    //         //   dataType: 'json',
    //         //   contentType: 'application/json',
    //         //   data: JSON.stringify({
    //         //     ...baseParams,
    //         //     page: 1,
    //         //     param: requestBindParams
    //         //   }),
    //         //   success: res => {
    //         //     //  在 this.componentsList 中找到原始的组件对象
    //         //     const targetComponent = this.findComponentById(this.componentsList, componentId)
    //         //     if (targetComponent) {
    //         //       //  使用 this.$set 来更新数据，确保响应式！
    //         //       const oldProps = _.cloneDeep(targetComponent.props),
    //         //         newPageProps = { ...oldProps.pageProps, total: res.count },
    //         //         // 确保 data 和 pageProps 都是响应式的,
    //         //         newProps = { ...oldProps, data: res.data || [], pageProps: newPageProps }
    //         //       this.$set(targetComponent, 'props', newProps)
    //         //       console.log('组件数据已响应式更新:', targetComponent)
    //         //     } else {
    //         //       console.error(`未能找到ID为 ${componentId} 的组件进行更新。`)
    //         //     }
    //         //   },
    //         //   error: err => {
    //         //     console.error('数据源请求失败:', err)
    //         //   }
    //         // })
    //       } else if (tag === 'lay-echarts') {
    //         // ECharts 的逻辑也应遵循此模式
    //       }
    //     }
    //   })
    // },

    // 请求数据源的通用方法
    requestDataSource(where, done) {
      layui.$.ajax({
        url: '/api/dsjfx/data-source/preview',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(where),
        success: res => {
          done && done.bind(this)(res)
        },
        error: err => {
          console.error('数据源请求失败:', err)
        }
      })
    },
    // 请求表格数据
    requestTableData(data) {
      const { config, obj: pagePros } = data,
        { id: componentId, props } = config,
        { curr: page, limit } = pagePros,
        where = { ...this.getRequestParams(config), limit, page }
      this.requestDataSource(where, res => {
        const oldProps = _.cloneDeep(props),
          newPageProps = { ...oldProps.pageProps, total: res.count, current: page, pageSize: limit },
          newProps = { ...oldProps, data: res.data || [], pageProps: newPageProps }
        this.updateComponentValueById(componentId, 'props', newProps)
      })
    },
    //请求echarts数据
    requestEchartsData(data) {
      const { props, id } = data,
        { option } = props,
        where = this.getRequestParams(data)
      this.requestDataSource(where, res => {
        const chartData = res.data || [],
          newOption = { ..._.cloneDeep(option), data: chartData },
          newProps = { ..._.cloneDeep(props), option: newOption }
        this.updateComponentValueById(id, 'props', newProps)
      })
    },
    //拼接好请求参数
    getRequestParams(config) {
      const param = this.getDataSourceParams()
      const { props } = config // 解构出组件ID
      const { dataSource } = props,
        baseParams = { id: dataSource },
        where = {
          ...baseParams,
          param
        }
      return where
    },
    // 获取数据源参数
    getDataSourceParams(bindParamsDict = this.bindParamsDict, formData = this.formData) {
      let resultParams = {}
      for (const key in formData) {
        if (Object.prototype.hasOwnProperty.call(formData, key)) {
          const item = formData[key]
          if (bindParamsDict[key]) {
            const paramsIds = bindParamsDict[key].split(',')
            paramsIds.forEach(id => {
              resultParams[id] = item
            })
          }
        }
      }
      return resultParams
    },
    // 根据组件ID查找组件
    findComponentById(componentList, id) {
      for (const component of componentList) {
        if (component.id === id) {
          return component // 找到了，返回对象引用
        }
        if (component.children && component.children.length) {
          const found = this.findComponentById(component.children, id)
          if (found) {
            return found // 在子节点中找到了
          }
        }
      }
      return null // 没找到
    },
    //根据组件id更新值
    updateComponentValueById(id, valueName, newValue) {
      const targetComponent = this.findComponentById(this.componentsList, id)
      if (targetComponent) {
        // 使用 this.$set 来更新数据，确保响应式！
        this.$set(targetComponent, valueName, newValue)
        console.log('组件数据已响应式更新:', targetComponent)
      } else {
        console.error(`未能找到ID为 ${id} 的组件进行更新。`)
      }
    }
  }
}
const templateUrl = new URL('index.html', import.meta.url).href
const cssUrl = new URL('index.css', import.meta.url).href
export default createAsyncComponent(previewComponents, templateUrl, cssUrl)
