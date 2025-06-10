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
  }
}
