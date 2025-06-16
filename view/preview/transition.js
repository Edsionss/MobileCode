// 导入页面配置的原始数据
import data from './testdata.js'

/**
 * @class Transition
 * @description 一个转换器类，用于将特定格式的页面配置数据（源数据）
 *              转换为适用于目标UI框架（如此处的'wot-design'）的组件配置（目标数据）。
 */
class Transition {
  /**
   * @constructor
   * @param {object} pageInfo - 包含页面模块信息的原始配置对象。
   */
  constructor(pageInfo) {
    const { modules } = pageInfo
    this.pageInfo = pageInfo

    // 1. 定义组件映射器 (Component Mappers)
    // 这是一个核心对象，键是源数据中的组件类型（如 'input', 'date'），
    // 值是一个函数，该函数负责将源组件数据转换为目标组件配置。
    this.componentMappers = {
      // --- 特殊别名映射 ---
      // 'fnsrsbh' 和 'fnsrmc' 都是输入框的别名，直接复用 'input' 的转换逻辑。
      fnsrsbh: data => this.componentMappers.input(data),
      fnsrmc: data => this.componentMappers.input(data),
      // 'frkrq' 是日历选择器的别名，复用 'date' 的转换逻辑。
      frkrq: data => this.componentMappers.date(data),

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
          tag: 'wd-calendar', // 注意：原代码有尾随空格，这里已修正
          valueName: 'dateValue'
        }),

      select: data => {
        // 'select' 组件逻辑相对特殊，单独处理
        const { props, events } = data
        const { title, name, required, placeholder, defaultValue, params, radio } = props

        const newProps = {
          label: title,
          valueName: name,
          required,
          placeholder,
          defaultValue,
          // 根据 radio 属性决定是单选还是多选
          type: radio ? 'radio' : 'checkbox',
          // 注意：这里的选项是硬编码的，实际应用中可能需要从 props.options 或其他地方动态获取
          columns: [
            { value: '101', label: '男装' },
            { value: '102', label: '奢侈品' },
            { value: '103', label: '女装' }
          ],
          params
        }

        return {
          tag: 'wd-select-picker',
          valueName: name, // `valueName` 用于表单数据收集，直接使用源 `name`
          props: newProps,
          events: events
        }
      },

      button: data => {
        // 'button' 组件逻辑也相对特殊
        const { props, events } = data
        // 对于按钮，通常只需要关心 title 和 params，其他属性意义不大
        const { title, name, params } = props

        const newProps = {
            label: title, // 按钮的文本
            valueName: name, // 按钮的唯一标识
            params
          },
          tag = 'wd-button'

        return {
          tag, // 假设目标按钮组件是 'wd-button'
          props: newProps,
          events: events,
          component: tag,
          slot: `<span>${title}</span>`,
          click: function (item) {
            console.log('[Button] click', this.$data)
          }
          // 'click' 事件处理器通常在业务代码中定义，而不是在这里定义一个空函数
        }
      }
    }

    // 2. 将嵌套的模块数据扁平化为一维数组，方便遍历处理
    this.allComponents = this._flattenComponents(modules || [])

    // 3. 根据映射器转换所有组件，并按类型（form, table, echarts）分类
    this.componentsConfig = this._generateComponentsConfig(this.componentMappers, this.allComponents)

    // 在控制台打印最终生成的配置，方便调试
    console.log('最终生成的组件配置:', this.componentsConfig)
  }

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
    const { props, events } = data
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
        const newComponentConfig = dict[componentType](item)

        // 根据源组件类型进行分类（此设计具有良好的扩展性）
        // 尽管当前映射器未定义 'table' 和 'echarts'，但结构上支持未来扩展。
        switch (componentType) {
          case 'table':
            result.table.push(newComponentConfig)
            break
          case 'echarts':
            result.echarts.push(newComponentConfig)
            break
          default:
            // 其他所有组件都归类为表单组件
            if (!result.form[0]) {
              result.form[0] = {
                tag: 'wd-cell-group',
                component: 'wd-cell-group',
                framework: 'wot',
                groupName: 'form',
                children: [],
                props: {
                  title: '查询条件',
                  border: true
                }
              }
            }
            result.form[0].children.push({
              ...newComponentConfig,
              framework: 'wot', // 添加额外的元信息
              groupName: 'form'
            })
            break
        }
      } else {
        // 如果找不到映射关系，打印错误信息，方便排查问题
        console.error(`[Wot Transition] 组件类型 "${item.type}" 的转换器暂未定义。`)
      }
    })
    return result
  }
}

// 实例化转换器，并传入原始数据
const transition = new Transition(data)

// 导出转换器实例，外部模块可以直接使用其 `componentsConfig` 属性
export default transition
