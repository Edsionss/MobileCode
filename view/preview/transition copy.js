// 导入页面配置的原始数据
// import data from './testdata.js' // 如果需要，可以保留
import utils from '@utils/index.js'

/**
 * @class Transition
 * @description 一个转换器类，用于将特定格式的页面配置数据（源数据）
 *              转换为适用于目标UI框架（如此处的'wot-design'）的组件配置（目标数据）。
 *              注意：此类应通过静态方法 Transition.create() 进行实例化。
 */
class Transition {
  /**
   * @private
   * @constructor
   * @description 构造函数现在是同步的，并假设所有需要的数据已经准备好。
   *              不应直接调用此构造函数，请使用 Transition.create()。
   * @param {object} pageInfo - 包含页面模块信息的【已获取】的配置对象。
   * @param {object} layui - layui 实例。
   */
  constructor(pageInfo, layui) {
    const { modules, ...pageData } = pageInfo
    this.pageInfo = pageInfo

    // debugger; // 调试点

    // 1. 定义组件映射器 (Component Mappers)
    // ... 这部分代码完全不变 ...
    this.componentMappers = {
      // --- 特殊别名映射 ---
      // 'fnsrsbh' 和 'fnsrmc' 都是输入框的别名，直接复用 'input' 的转换逻辑。
      fnsrsbh: data => this.componentMappers.input(data),
      fnsrmc: data => this.componentMappers.input(data),
      // 'frkrq' 是日历选择器的别名，复用 'date' 的转换逻辑。
      frkrq: data => {
        let oldProps = data.props
        let result = this.componentMappers.date(data)
        if (data.type === 'frkrq') {
          result.props.type = 'daterange'
          result.props['min-date'] = new Date('2017-01-01')
        } else {
          result.props.type = oldProps.type
          if (oldProps.type === 'year') {
          }
        }
        return result
      },
      // --- 标准表单组件映射 ---
      input: data =>
        this._createBaseComponent(data, {
          tag: 'wd-input', // 目标组件标签
          valueName: 'inputValue' // v-model 或双向绑定的值名称
        }),

      number: data =>
        this._createBaseComponent(data, {
          tag: 'wd-input',
          valueName: 'inputValue',
          // 为数字输入框添加额外的 props
          extraProps: {
            type: 'number'
          }
        }),

      date: data =>
        this._createBaseComponent(data, {
          tag: 'wd-calendar',
          valueName: 'dateValue'
        }),

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
        return {
          id: id,
          tag: 'wd-select-picker',
          valueName: name,
          props: newProps,
          events: events
        }
      },

      button: data => {
        const { props, events, id } = data
        const { title, name, params } = props
        const newProps = {
            label: title,
            valueName: name,
            params
          },
          tag = 'wd-button'
        return {
          id: id,
          tag,
          props: newProps,
          events: events,
          component: tag,
          slot: `<span>${title}</span>`,
          click: function (item) {
            this.recursionUpdateForm(this.componentsList, 'popupVisible', !this.formData.popupVisible)
            console.log('[Button] click', this.formData.popupVisible, this.$data)
          }
        }
      },
      table: data => {
        const { props, events, id } = data
        const { ...tableConfig } = props
        let newProps = { ...tableConfig, other: true, tag: 'table' }
        return {
          id: id,
          tag: 'lay-table',
          component: 'lay-table',
          props: newProps
        }
      },
      echartsPie: data => {
        const { props, id, type } = data
        const { ...echartsConfig } = props
        let newProps = {
          ...echartsConfig,
          other: true,
          tag: 'lay-echarts',
          component: 'lay-echarts',
          chantType: type
        }
        return {
          id: id,
          tag: 'lay-echarts',
          component: 'lay-echarts',
          props: newProps
        }
      },
      echartsBarLine: data => {
        const { props, id, type } = data
        const { ...echartsConfig } = props
        let newProps = {
          ...echartsConfig,
          other: true,
          tag: 'lay-echarts',
          component: 'lay-echarts',
          chantType: type
        }
        return {
          id: id,
          tag: 'lay-echarts',
          component: 'lay-echarts',
          props: newProps
        }
      }
    }

    // 2. 将嵌套的模块数据扁平化为一维数组，方便遍历处理
    this.allComponents = this._flattenComponents(modules || [])

    // 3. 根据映射器转换所有组件，并按类型（form, table, echarts）分类
    this.componentsConfig = this._generateComponentsConfig(this.componentMappers, this.allComponents)

    // 4.配置bindParams的id用于请求preview接口
    this.bindParams = this._getBindParams(this.allComponents)

    // 5. 组合最后的转化结果
    this.StitcherData = {
      ...pageData,
      componentsConfig: this.componentsConfig,
      bindParams: this.bindParams,
      BeforeCreate: function () {}, //禁止使用
      Create: function () {},
      Mounted: function () {},
      NextTick: function () {
        this.activeData.popupVisible = true
      }
    }
    // 在控制台打印最终生成的配置，方便调试
    console.log('最终生成的组件配置:', this.StitcherData)
  }

  /**
   * @public
   * @static
   * @async
   * @method create
   * @description 【推荐使用】静态工厂方法，用于异步创建并完全初始化一个 Transition 实例。
   * @param {string} pageId - 页面ID。
   * @param {object} layui - layui 实例。
   * @returns {Promise<Transition|null>} 返回一个完全初始化的 Transition 实例，如果失败则返回 null。
   */
  static async create(pageId, layui) {
    try {
      // 步骤 1: 异步加载所有必需的外部资源
      console.log('开始加载外部资源...')
      await utils.loadResources([
        // 如果有CSS文件，也放在这里，例如: '/BPAPP/admin/common/main.css'
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
      console.log('外部资源加载完成。')

      // 步骤 2: 异步请求页面数据
      console.log(`开始获取页面数据 (pageId: ${pageId})...`)
      const pageInfo = await new Promise((resolve, reject) => {
        layui.$.ajax({
          type: 'GET',
          url: '/api/dsjfx/report/' + pageId,
          dataType: 'json',
          success: function (res) {
            if (res.code === 0) {
              console.log('页面数据获取成功。')
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

      // 步骤 3: 使用获取到的数据，同步创建实例
      console.log('开始实例化 Transition...')
      const instance = new Transition(pageInfo, layui)
      console.log('Transition 实例创建并初始化完成。')

      // 步骤 4: 返回完全准备好的实例
      return instance
    } catch (error) {
      console.error('[Transition.create] 初始化过程中发生错误:', error)
      return null // 或者可以 throw error; 让调用者处理
    }
  }

  // _createBaseComponent, _flattenComponents, _generateComponentsConfig, _getBindParams 等
  // 私有方法保持不变，这里省略以保持简洁...
  // ...
  // ... (请将您原来的私有方法粘贴在这里) ...
  // ...
  /**
   * @private
   * @method _createBaseComponent
   * @description 一个可复用的辅助函数，用于创建基础表单组件的配置。
   *              它处理了大部分表单组件共有的属性映射逻辑。
   * @param {object} data - 源组件的数据对象 { props, events }。
   * @param {object} options - 转换选项，包含 { tag, valueName, extraProps }。
   * @returns {object} - 转换后的目标组件配置。
   */
  _createBaseComponent(data, { tag, valueName, extraProps = {} }) {
    const { props, events, id } = data
    // 从源 props 中解构出通用属性
    const { title, name, required, placeholder, defaultValue, params } = props

    // 构建目标组件的 props
    const newProps = {
      label: title,
      valueName: name,
      required: required === 'true' ? true : false,
      placeholder,
      defaultValue,
      params,
      ...extraProps // 合并额外的、特定于组件的 props (如 type: 'number')
    }

    return {
      id: id,
      tag,
      component: tag,
      valueName: name,
      props: newProps,
      events
    }
  }

  /**
   * @private
   * @method _flattenComponents
   * @description 使用递归，将具有 'children' 属性的树状结构数组扁平化为一维数组。
   * @param {Array} array - 待扁平化的组件数组。
   * @returns {Array} - 扁平化后的一维组件数组。
   */
  _flattenComponents(array) {
    let result = []
    // 定义递归函数
    const recursionFun = arr => {
      arr.forEach(item => {
        const { children, ...node } = item
        // 将当前节点（不含 children）推入结果数组
        result.push(node)
        // 如果存在子节点，则递归处理
        if (children && children.length) {
          recursionFun(children)
        }
      })
    }
    recursionFun(array)
    return result
  }

  /**
   * @private
   * @method _generateComponentsConfig
   * @description 遍历扁平化的组件列表，使用映射器将其转换为目标配置，并分类。
   * @param {object} dict - 组件映射器 (componentMappers)。
   * @param {Array} componentsList - 扁平化的源组件列表。
   * @returns {object} - 包含 'form', 'table', 'echarts' 分类后组件配置的对象。
   */
  _generateComponentsConfig(dict, componentsList) {
    // 初始化结果对象
    let result = { form: [], table: [], echarts: [] }

    componentsList.forEach(item => {
      const { type: componentType } = item
      // 检查是否存在对应的转换函数
      if (dict[componentType]) {
        // 调用转换函数生成新配置
        let newComponentConfig = dict[componentType](item)
        newComponentConfig._DEFAULT_CONFIG_PROPS = item // 保存默认配置
        // 根据源组件类型进行分类（此设计具有良好的扩展性）
        // 尽管当前映射器未定义 'table' 和 'echarts'，但结构上支持未来扩展。
        if (componentType === 'table') {
          if (!result.table[0]) {
            result.table[0] = {
              tag: 'wd-cell-group',
              component: 'wd-cell-group',
              framework: 'wot',
              groupName: 'layout',
              children: [],
              props: {
                title: '数据表格',
                border: true
              }
            }
          }
          result.table[0].children.push({
            ...newComponentConfig,
            framework: 'layui', // 添加额外的元信息
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
              props: {
                title: '图表数据',
                border: true
              }
            }
          }
          result.echarts[0].children.push({
            ...newComponentConfig,
            framework: 'layui', // 添加额外的元信息
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
              props: {
                title: '',
                border: true
              }
            }
          }
          result.form[0].children.push({
            ...newComponentConfig,
            framework: 'wot', // 添加额外的元信息
            groupName: 'form'
          })
        }
      } else {
        // 如果找不到映射关系，打印错误信息，方便排查问题
        console.error(`[Wot Transition] 组件类型 "${item.type}" 的转换器暂未定义。`)
      }
    })
    const headerElement = {}
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
      _DEFAULT_CONFIG_PROPS: {
        label: '弹出层',
        tag: 'popup'
      },
      id: 'KZNPH904',
      framework: 'wot',
      groupName: 'active',
      groupLabel: '反馈'
    }
    const footerElement = {}
    searchElement.children = result.form[0].children
    result.componentsConfig = [result.form[0], result.echarts[0], result.table[0], searchElement]
    return result
  }
  _getBindParams(allComponents) {
    let result = []
    allComponents.forEach(config => {
      const props = config.props
      props.params && result.push({ name: props.params })
    })
    // 注意：这里原代码没有 return，我已加上
    return result
  }
}

// 导出转换器类本身，而不是实例
export default Transition
