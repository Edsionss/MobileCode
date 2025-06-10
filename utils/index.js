import componentsDict from '@modules/components/main.js'
export default {
  // 生成唯一ID（5个大写字母 + 3个数字）
  generateUniqueId() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let id = ''
    for (let i = 0; i < 5; i++) {
      id += letters.charAt(Math.floor(Math.random() * letters.length))
    }
    for (let i = 0; i < 3; i++) {
      id += Math.floor(Math.random() * 10)
    }
    return id
  },

  // 获取视口宽度（100vw 对应的像素值）
  getVW() {
    const div = document.createElement('div')
    div.style.width = '100vw'
    div.style.position = 'absolute'
    div.style.left = '-9999px'
    document.body.appendChild(div)
    const vwValue = div.offsetWidth
    document.body.removeChild(div)
    return vwValue
  },

  /**
   * 递归遍历数据结构，仅为数组内的对象添加ID。
   * @param {any} data - 要处理的数据（对象、数组等）。
   * @param {function} [idGenerator=this.generateUniqueId] - 用于生成ID的函数。
   * @returns {any} - 处理后的新数据。
   */
  generateDataId(data, idGenerator) {
    // 如果没有提供ID生成器，则使用模块自身的默认方法
    const genId = idGenerator || this.generateUniqueId.bind(this)
    // 1. 如果当前数据是数组 (这是添加ID的关键区域)
    if (Array.isArray(data)) {
      // 使用 map 创建一个新数组
      return data.map(item => {
        let processedItem = item
        // 检查数组中的这个'item'是否是一个需要添加ID的对象
        // 条件：是对象、不是null、并且不是数组
        if (item && typeof item === 'object' && !Array.isArray(item)) {
          // 创建一个新对象，复制原有属性，并添加ID
          processedItem = { ...item, id: genId() }
        }
        // 关键：对处理后的 item (无论是否添加了ID) 进行递归调用
        // 以便处理嵌套在 item 内部的更深层次的数组
        return this.generateDataId(processedItem, genId)
      })
    }
    // 2. 如果当前数据是对象但不是数组 (此区域只负责遍历，不添加ID)
    else if (data && typeof data === 'object') {
      const newObj = {}
      // 遍历对象的每个属性
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          // 只对属性值进行递归调用，然后将结果赋给新对象
          newObj[key] = this.generateDataId(data[key], genId)
        }
      }
      return newObj
    }
    // 3. 如果是原始类型 (string, number, null等)，直接返回
    return data
  },
  // 简单判断是否包含 HTML 标签，用于 v-html
  isHtmlString(str) {
    return /<[a-z][\s\S]*>/i.test(str)
  },
  /**
   * 处理组件配置，转换并合并 props 和 attr。
   *
   * @param {object} config - 原始的组件配置对象。
   * @param {object} dict - 用于转换的组件字典。
   * @returns {object} 返回一个经过处理的全新配置对象。
   */
  processComponentAttrConfig(config, dict) {
    // --- 内部辅助函数，用于处理核心的转换逻辑 ---
    /**
     * 接收一个项目数组，使用字典进行转换。
     * @param {Array} itemsArray - 可能是 props 或 attr 数组。
     * @returns {Array} 返回转换后的新数组。
     */
    const transformArray = (itemsArray, extraData = {}) => {
      // 步骤1：健壮性检查，确保输入是数组。
      if (!Array.isArray(itemsArray)) {
        return []
      }

      // 步骤2：遍历并处理每一项。
      return itemsArray.map(item => {
        item.name = item.name.replace(/\s/g, '') // 去除空格
        // 步骤2a：使用字典进行基础转换。
        const transformFn = dict[item.el]
        const transformedItem = typeof transformFn === 'function' ? transformFn(item) : item

        // 步骤2b：将转换后的结果与额外数据合并。
        // 使用展开运算符，将 isProps: true 添加到对象中。
        return { ...transformedItem, ...extraData }
      })
    }

    // --- 主函数逻辑开始 ---

    // 步骤A：深拷贝。创建一个原始配置的完整副本，避免修改原始数据。
    const newConfig = _.cloneDeep(config)

    // 步骤B：遍历数据结构，找到需要处理的目标。
    // 安全地获取第一层级的 attr 数组（我们称之为 groups）。
    const groups = newConfig.attr || []

    for (const group of groups) {
      // 安全地获取 group 下的 components 数组。
      const components = group.components || []

      for (const component of components) {
        // 步骤C：调用辅助函数，分别转换 props 和 attr 数组。
        const transformedProps = transformArray(component.props, { isProps: true })
        const transformedAttr = transformArray(component.attr)

        // 步骤D：合并。将转换后的两个数组合并成一个，并赋值给 component.attr。
        // 使用展开运算符 `...` 是最现代和清晰的合并方式。
        component.attr = [...transformedProps, ...transformedAttr]

        // 步骤E：清理。删除已经处理完且不再需要的 props 属性。
        delete component.props
      }
    }

    // 步骤F：返回结果。返回这个全新的、经过完整处理的配置对象。
    return newConfig
  }
}
