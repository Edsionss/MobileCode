// 文件: Transition.js

// ... (Transition 类的定义和所有内部方法保持不变，这里省略)
// ... (class Transition { ... static async create(...) ... } 这部分完全不用动)
import utils from '@utils/index.js'
class Transition {
  constructor(pageInfo) {
    const { modules, ...pageData } = pageInfo
    this.pageInfo = pageInfo
    this.componentMappers = {
      fnsrsbh: data => this.componentMappers.input(data),
      fnsrmc: data => this.componentMappers.input(data),
      frkrq: data => {
        const oldProps = data.props
        let result = this.componentMappers.date(data)
        result.props.type = 'monthrange'
        result.props['min-date'] = new Date('2017-01')
        result.props.paramsValue = this._getDateDefaultValue(oldProps).paramsValue
        result.props.defaultValue = this._getDateDefaultValue(oldProps).defaultValue
        return result
      },
      input: data => this._createBaseComponent(data, { tag: 'wd-input', valueName: 'inputValue' }),
      number: data =>
        this._createBaseComponent(data, {
          tag: 'wd-input',
          valueName: 'inputValue',
          extraProps: { type: 'number' }
        }),
      date: data => {
        const oldProps = data.props
        let result = this._createBaseComponent(data, { tag: 'wd-calendar', valueName: 'dateValue' })
        const dateValue = this._getDateDefaultValue(oldProps).endValue
        result.props.paramsValue = dateValue
        result.props.defaultValue = new Date(dateValue)
        return result
      },
      select: data => {
        const { props, events, id } = data
        const { title, name, required, placeholder, defaultValue, params, radio } = props
        const newProps = {
          label: title,
          valueName: name,
          required,
          placeholder,
          defaultValue,
          type: radio ? 'radio' : 'checkbox',
          columns: [
            { value: '101', label: '男装' },
            { value: '102', label: '奢侈品' },
            { value: '103', label: '女装' }
          ],
          params
        }
        return { id: id, tag: 'wd-select-picker', valueName: name, props: newProps, events: events }
      },
      button: data => {
        const { props, events, id } = data
        const { title, name, params } = props
        const newProps = { label: title, valueName: name, params },
          tag = 'wd-button'
        let click = function (item) {}
        if (title === '查询') {
          click = function (item) {
            this.recursionUpdateForm(this.componentsList, 'popupVisible', !this.formData.popupVisible)
            console.log('[Button] click', this.formData.popupVisible, this.$data)
          }
        }
        return {
          id: id,
          tag,
          props: newProps,
          events: events,
          component: tag,
          slot: `<span>${title}</span>`,
          click // 这里可以直接绑定事件处理函数
        }
      },
      table: data => {
        const { props, id } = data
        const { ...tableConfig } = props
        let newProps = {
          ...tableConfig,
          other: true,
          tag: 'table',
          pageProps: { total: 1000, current: 1, pageSize: 10, pageSizeOptions: [10, 20, 30, 40, 50] }
        }
        return { id: id, tag: 'lay-table', component: 'lay-table', props: newProps }
      },
      echartsPie: data => {
        const { props } = data
        const otherOption = {
          series: [
            {
              ...props.series[0],
              radius: '50%',
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
              }
            }
          ]
        }
        return this._createBaseEcharts(data, otherOption)
      },
      echartsBarLine: data => {
        const { props } = data,
          otherOption = {
            xAxis: props.xAxis,
            yAxis: props.yAxis,
            series: props.series.map(item => {
              return {
                ...item,
                tooltip: {
                  valueFormatter: function (value) {
                    return value + item.unit
                  }
                }
              }
            })
          }
        return this._createBaseEcharts(data, otherOption)
      }
    }
    this.allComponents = this._flattenComponents(modules || [])
    this.bindParamsDict = this._getBindParams(this.allComponents)
    this.componentsConfig = this._generateComponentsConfig(this.componentMappers, this.allComponents)
    this.defaultBindParams = this._getFormDefaultValue(
      this.componentsConfig.form[0].children || [],
      this.bindParamsDict
    )
    this.StitcherData = {
      ...pageData,
      componentsConfig: this.componentsConfig,
      bindParamsDict: this.bindParamsDict,
      defaultBindParams: this.defaultBindParams,
      BeforeCreate: function () {},
      Create: function () {
        const newDiv = document.createElement('div')
        newDiv.className = 'app-head'
        newDiv.setAttribute('data-title', this.StitcherData.name)
        // 确保 previewContainer 已经被挂载
        if (this.$refs.previewHeader) {
          this.$refs.previewHeader.appendChild(newDiv)
          headerComponent.renderNavBar()
          // querySelector 直接返回元素，如果没有找到则返回 null
          const searchBtn = document.querySelector('.head-search')
          // 直接判断 searchBtn 是否存在即可
          if (searchBtn) {
            searchBtn.addEventListener('click', () => {
              this.recursionUpdateForm(this.componentsList, 'popupVisible', true)
            })
          }
        }
      },
      Mounted: function () {},
      NextTick: function () {}
    }
    console.log('最终生成的组件配置:', this.StitcherData)
  }
  static async create(pageId, layui) {
    try {
      await utils.loadResources([
        '/BPAPP/admin/style/main.css',
        '/BPAPP/admin/common/main.js',
        '/BPAPP/admin/common/baseConst.js',
        '/BPAPP/admin/common/loading.js',
        '/BPAPP/admin/common/uni.webview.1.5.4.js',
        '/BPAPP/admin/common/ajaxBase.js',
        '/BPAPP/admin/common/until.js',
        '/BPAPP/admin/common/router.js',
        '/BPAPP/admin/common/bpbasedata.js',
        '/BPAPP/admin/common/component.js'
      ])
      const pageInfo = await new Promise((resolve, reject) => {
        layui.$.ajax({
          type: 'GET',
          url: '/api/dsjfx/report/' + pageId,
          dataType: 'json',
          success: function (res) {
            if (res && res.code === 0) {
              resolve(res.data)
            } else {
              reject(new Error(res.msg || `获取页面数据失败，code: ${res.code}`))
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            reject(new Error(`网络请求失败: ${textStatus} - ${errorThrown}`))
          }
        })
      })
      const instance = new Transition(pageInfo)
      return instance
    } catch (error) {
      console.error('[Transition.create] 初始化过程中发生错误:', error)
      return null
    }
  }
  _createBaseComponent(data, { tag, valueName, extraProps = {} }) {
    const { props, events, id } = data
    const { title, name, required, placeholder, defaultValue, params } = props
    const newProps = {
      label: title,
      valueName: name,
      required: required === 'true' ? true : false,
      placeholder,
      defaultValue,
      params,
      ...extraProps
    }
    return { id: id, tag, component: tag, valueName: name, props: newProps, events }
  }
  _createBaseEcharts(data, otherOptions = {}) {
    const { props, id, type, events } = data,
      baseOption = {
        title: {
          text: props.text || '',
          subtext: props.subtext || '',
          left: props.titleAlign || 'center'
        },
        // tooltip: {
        //   trigger: 'item'
        // },
        legend: {
          orient: 'vertical',
          left: 'left',
          show: props.legend
        }
      },
      option = {
        ...baseOption,
        ...otherOptions
      }
    let newProps = {
      ...props,
      events,
      option,
      other: true,
      tag: 'lay-echarts',
      component: 'lay-echarts',
      chantType: type
    }
    return { id: id, tag: 'lay-echarts', component: 'lay-echarts', props: newProps }
  }
  _flattenComponents(array) {
    let result = []
    const recursionFun = arr => {
      arr.forEach(item => {
        const { children, ...node } = item
        result.push(node)
        if (children && children.length) {
          recursionFun(children)
        }
      })
    }
    recursionFun(array)
    return result
  }
  _getDateDefaultValue(oldProps) {
    const now = new Date(),
      nowYear = now.getFullYear(),
      nowMonth = now.getMonth() + 1,
      nowDay = now.getDate(),
      oldDefaultValue = oldProps.defaultValue,
      range = oldProps.range || '-'
    let startValue = '',
      endValue = ''
    if (oldDefaultValue == '${date-ssrq}') {
      //TODO 默认值是入库日期
      const defaultValue = this._getDefaultValueDict().defaultJson['最新税收日期'] || '',
        valYear = defaultValue.split('-')[0]
      // valMonth = defaultValue.split('-')[1]
      startValue = `${valYear}-01`
      endValue = defaultValue
    } else if (oldDefaultValue == '${date-lastMonth}') {
      //TODO 默认值是上个月
      startValue = `${nowYear}-${nowMonth - 1}-01`
      endValue = `${nowYear}-${nowMonth}-01`
    } else if (oldDefaultValue == '${date-now}') {
      //TODO 默认值是这个月
      startValue = `${nowYear}-${nowMonth}-01`
      endValue = `${nowYear}-${nowMonth}-${nowDay}`
    }
    return {
      defaultValue: [new Date(startValue), new Date(endValue)],
      startValue,
      endValue,
      paramsValue: `${startValue} ${range} ${endValue}`
    }
  }
  _getDefaultValueDict() {
    const dictData = JSON.parse(localStorage.getItem('search')) || {}
    const defaultArray = dictData.zhzs_default_value
    const defaultJson = {}
    defaultArray.map(item => {
      defaultJson[item.name] = item.value
    })
    return {
      dictData,
      defaultArray,
      defaultJson
    }
  }
  _generateComponentsConfig(dict, componentsList) {
    let result = { form: [], table: [], echarts: [] }
    componentsList.forEach(item => {
      const { type: componentType } = item
      if (dict[componentType]) {
        let newComponentConfig = dict[componentType](item)
        newComponentConfig._DEFAULT_CONFIG_PROPS = item
        if (componentType === 'table') {
          if (!result.table[0]) {
            result.table[0] = {
              tag: 'wd-cell-group',
              component: 'wd-cell-group',
              framework: 'wot',
              groupName: 'layout',
              children: [],
              props: { title: '数据表格', border: true, style: { marginTop: '20px' } }
            }
          }

          result.table[0].children.push({
            ...newComponentConfig,
            framework: 'layui',
            groupName: 'dataView',
            groupLabel: '数据展示'
          })
        } else if (componentType.includes('echarts')) {
          if (!result.echarts[0]) {
            result.echarts[0] = {
              tag: 'wd-cell-group',
              component: 'wd-cell-group',
              framework: 'wot',
              groupName: 'layout',
              children: [],
              props: { title: '图表数据', border: true, style: { marginTop: '20px' } }
            }
          }
          result.echarts[0].children.push({
            ...newComponentConfig,
            framework: 'layui',
            groupName: 'dataView',
            groupLabel: '数据展示'
          })
        } else {
          if (!result.form[0]) {
            result.form[0] = {
              tag: 'wd-cell-group',
              component: 'wd-cell-group',
              framework: 'wot',
              groupName: 'layout',
              children: [],
              props: { title: '', border: true }
            }
          }
          result.form[0].children.push({ ...newComponentConfig, framework: 'wot', groupName: 'form' })
        }
      } else {
        console.error(`[Wot Transition] 组件类型 "${item.type}" 的转换器暂未定义。`)
      }
    })
    const searchElement = {
      component: 'wd-popup',
      valueName: 'popupVisible',
      defaultValue: false,
      children: [],
      props: {
        visible: false,
        position: 'top',
        round: true,
        label: '弹出层',
        tag: 'popup',
        style: { height: '100%' }
      },
      events: {},
      slot: '',
      _DEFAULT_CONFIG_PROPS: { label: '弹出层', tag: 'popup' },
      id: 'KZNPH904',
      framework: 'wot',
      groupName: 'active',
      groupLabel: '反馈'
    }
    if (result.form[0]) {
      searchElement.children = result.form[0].children
    }
    const finalConfig = [
      searchElement,
      // result.form[0],
      result.echarts[0],
      result.table[0]
    ].filter(Boolean)
    result.componentsConfig = finalConfig
    // this._getDataViewInit(result)
    return result
  }
  _getBindParams(allComponents) {
    let result = {}
    allComponents.forEach(config => {
      const props = config.props
      props.params && (result[props.name] = props.params)
    })
    return result
  }
  _getDataViewInit(componentsConfig) {
    const { table, echarts, form, componentsConfig: componentsList } = componentsConfig,
      defaultParams = this._getFormDefaultValue(form[0].children || [])
    let tableList = table[0].children || []
    console.log('defaultParams', defaultParams)
    tableList = tableList.map(item => {
      const { props } = item
      if (props.init) {
        const { dataSource, page: isPage, pageProps } = props,
          { total = 1000, current: page, pageSize: limit } = pageProps || {},
          baseParams = { id: dataSource, limit, page }
        layui.$.ajax({
          url: '/api/dsjfx/data-source/preview',
          type: 'post',
          dataType: 'json',
          async: false,
          contentType: 'application/json',
          data: JSON.stringify({
            ...baseParams,
            page: 1,
            param: defaultParams
          }),
          success: function (res) {
            props.data = res.data || []
            pageProps.total = res.count
            return item
          }
        })
      }
    })
  }
  _getFormDefaultValue(componentsConfig, bindParamsDict = this.bindParamsDict) {
    let defaultParams = {}
    componentsConfig.forEach(item => {
      const props = item.props || {}
      const { defaultValue, paramsValue, valueName } = props
      if (bindParamsDict[valueName]) {
        const paramsIds = bindParamsDict[valueName].split(',')
        paramsIds.forEach(id => {
          defaultParams[id] = paramsValue || defaultValue
        })
      }
    })
    return defaultParams
  }
}

/**
 * 最终导出的函数，封装了所有异步逻辑，并通过回调函数返回结果。
 * @param {string} pageId - 页面ID
 * @param {object} layui - layui 实例
 * @param {function} onComplete - 【必需】当所有操作完成后的回调函数，它会接收到最终的数据
 */
function initializeWithCallback(pageId, layui, onComplete) {
  // 检查回调函数是否存在
  if (typeof onComplete !== 'function') {
    console.error('错误：必须提供一个 onComplete 回调函数！')
    return
  }

  // 使用 Promise.resolve() 来包装异步的 create 方法，这样可以用 .then() 链式调用
  // 这样写可以避免在顶层使用 async/await
  Promise.resolve(Transition.create(pageId, layui))
    .then(transitionInstance => {
      // 当 Transition.create 成功完成时
      if (transitionInstance) {
        // 调用传入的回调函数，并把最终的数据传给它
        onComplete(transitionInstance.StitcherData)
      } else {
        // 如果创建失败，也调用回调，但传入 null
        onComplete(null)
      }
    })
    .catch(error => {
      // 如果过程中出现任何未捕获的错误
      console.error('在 initializeWithCallback 中发生严重错误:', error)
      // 同样调用回调，传入 null 表示失败
      onComplete(null)
    })
}

// 默认导出这个新的、使用回调的函数
export default initializeWithCallback
