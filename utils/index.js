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
  },
  /**
   * 一个功能强大、文档齐全、极其健 的前端数据导出函数
   *
   * @param {any} data - 要导出的数据。可以是任何可被 JSON.stringify 序列化的数据，如对象、数组等。
   *
   * @param {string} [filename='export.txt'] - 导出的文件名，包含后缀名。函数会根据后缀名（如 .json, .csv, .js）自动选择合适的格式化方式。
   *
   * @param {object} [options={}] - 一个包含高级配置的选项对象。
   *
   * @param {string} [options.type] - 显式指定导出类型。可选值为 'json', 'csv', 'js', 'txt'。
   *   当提供此参数时，将忽略 filename 的后缀名，强制使用此类型。
   *
   * @param {string} [options.jsVarName='exportedData'] - 当导出为 .js 文件时，用于声明数据变量的名称。
   *   例如，设置为 'myConfig'，导出的JS文件内容会是 `const myConfig = [...]; export default myConfig;`。
   *
   * @param {boolean} [options.bom=true] - 当导出为 .csv 文件时，是否在文件开头添加 BOM (Byte Order Mark) 头（\uFEFF）。
   *   这对于解决 Microsoft Excel 打开 UTF-8 编码的CSV文件时中文显示乱码的问题至关重要。默认为 true。
   *
   * @param {Array<string>} [options.headers] - 当导出为 .csv 文件时，手动指定表头数组。数组中字符串的顺序将决定CSV文件中的列顺序。
   *   如果未提供，函数将自动从数据（必须是对象数组）的第一项中提取 `keys` 作为表头。
   *
   * @param {Function} [options.replacer] - 一个自定义的 replacer 函数，用于 `JSON.stringify`。
   *   这允许您进行高级的、自定义的数据序列化。如果提供此函数，将覆盖内置的 `smartJsonReplacer`。
   *   函数签名：(key, value) => any
   */
  exportToFile(data, filename = 'export.txt', options = {}) {
    // --- 1. 合并默认配置与用户自定义配置 ---
    // 使用对象展开语法，用户传入的 options 会覆盖默认的 config，实现灵活配置。
    const config = {
      bom: true,
      jsVarName: 'exportedData',
      ...options
    }

    // --- 2. 核心数据处理函数 ---

    /**
     * 一个智能的 JSON replacer 函数，用于处理标准 JSON 不支持的 JS 数据类型，并防止错误。
     * @param {string} key - 当前处理的对象的键。
     * @param {any} value - 当前处理的对象的值。
     * @returns {any} - 转换后的值。
     */
    const smartJsonReplacer = (key, value) => {
      // 将 BigInt 类型转换为字符串，因为 JSON 标准不支持 BigInt。
      if (typeof value === 'bigint') return value.toString()
      // 将 Date 对象转换为 ISO 8601 格式的字符串，这是最通用的日期表示法。
      if (value instanceof Date) return value.toISOString()
      // 将 Map 对象转换为普通对象。
      if (value instanceof Map) return Object.fromEntries(value)
      // 将 Set 对象转换为数组。
      if (value instanceof Set) return [...value]

      // 【关键】防止循环引用：许多UI框架（如您提供的例子）会在数据上附加对DOM节点或父节点的引用
      // （如 __node, parent），这会导致 JSON.stringify 陷入死循环而报错。
      // 通过返回 undefined，JSON.stringify 会在最终结果中忽略这些键。
      if (key === '__node' || key === 'parent') return undefined

      // 对于所有其他安全类型，返回原始值。
      return value
    }

    /**
     * 将单个单元格数据安全地转换为 CSV 格式的字符串。
     * 遵循 RFC 4180 标准：如果内容包含逗号、双引号或换行符，则必须用双引号包裹，
     * 且内容中的双引号必须转义为两个双引号。
     * @param {any} cell - 单元格数据。
     * @returns {string} - 转义后的 CSV 单元格字符串。
     */
    const escapeCsvCell = cell => {
      if (cell === null || cell === undefined) return ''
      const str = String(cell)
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        const escapedStr = str.replace(/"/g, '""')
        return `"${escapedStr}"`
      }
      return str
    }

    /**
     * 将对象数组转换为完整的 CSV 格式字符串。
     * @param {Array<object>} arr - 要转换的对象数组。
     * @param {Array<string>} [headers] - 手动指定的表头。
     * @returns {string} - CSV 格式的字符串。
     */
    const convertToCsv = (arr, headers) => {
      if (!Array.isArray(arr) || arr.length === 0) return ''
      const finalHeaders = headers || Object.keys(arr[0])
      const headerRow = finalHeaders.map(escapeCsvCell).join(',')
      const bodyRows = arr.map(row => finalHeaders.map(header => escapeCsvCell(row[header])).join(','))
      return [headerRow, ...bodyRows].join('\n')
    }

    // --- 3. 准备导出内容 ---
    let content = ''
    let mimeType = 'application/octet-stream' // 默认的 MIME 类型，表示二进制流。

    // 优先使用用户在 options 中指定的 type，否则根据文件名后缀推断。
    const fileType = config.type || filename.split('.').pop().toLowerCase()

    // 修正了之前的致命错误：将 replacer 的定义移到 switch 外部，确保所有分支都能访问。
    const replacer = config.replacer || smartJsonReplacer

    try {
      // 使用 switch 结构，根据文件类型选择不同的处理逻辑。
      switch (fileType) {
        case 'json':
          mimeType = 'application/json'
          // 使用 JSON.stringify 将 JS 对象转换为格式化的 JSON 字符串。
          // 第三个参数 `2` 表示使用2个空格进行缩进，美化输出。
          content = JSON.stringify(data, replacer, 2)
          break

        case 'csv':
          mimeType = 'text/csv'
          content = convertToCsv(data, config.headers)
          // 根据配置决定是否添加 BOM 头。
          if (config.bom) {
            content = '\uFEFF' + content
          }
          break

        case 'js':
          mimeType = 'text/javascript'
          const dataAsString = JSON.stringify(data, replacer, 2)
          // 使用模板字符串，将数据包装成一个标准的 ES6 模块。
          content = `const ${config.jsVarName} = ${dataAsString};\n\nexport default ${config.jsVarName};`
          break

        case 'txt':
          mimeType = 'text/plain'
          // 如果数据本身就是字符串，直接使用；否则，也格式化为 JSON 字符串。
          content = typeof data === 'string' ? data : JSON.stringify(data, replacer, 2)
          break

        default:
          // 如果是不支持的后缀，给出警告，并按纯文本处理。
          console.warn(`不支持的文件类型: .${fileType}。将作为纯文本处理。`)
          mimeType = 'text/plain'
          content = JSON.stringify(data, replacer, 2)
      }
    } catch (error) {
      // 增加错误捕获，如果 JSON.stringify 因为其他未知原因（如更复杂的循环引用）失败，
      // 能给出明确的错误提示，而不是让整个应用崩溃。
      console.error('数据转换失败！请检查数据结构。', error)
      alert('导出失败：数据转换时发生错误，请查看浏览器控制台获取详细信息。')
      return // 终止执行
    }

    // --- 4. 执行下载 ---
    // 此部分代码必须在浏览器环境中运行。
    if (typeof window === 'undefined') {
      console.error('此函数只能在浏览器环境中使用。')
      return
    }

    // `Blob` (Binary Large Object) 是一个类似文件的不可变原始数据对象。
    // 我们将最终的字符串内容和 MIME 类型放入 Blob 中，把它看作一个内存中的虚拟文件。
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` })

    // `URL.createObjectURL` 会为这个 Blob 创建一个唯一的、临时的 URL。
    // 这个 URL 可以像普通的文件 URL 一样被浏览器使用（例如在 <a> 标签的 href 中）。
    const url = URL.createObjectURL(blob)

    // 创建一个隐藏的 <a> 标签来实现下载。
    const a = document.createElement('a')
    a.href = url // 指向我们刚刚创建的 Blob URL。
    a.download = filename // `download` 属性告诉浏览器，这是一个下载链接，并指定默认文件名。

    // 将 <a> 标签添加到页面中，这样它才能被“点击”。
    document.body.appendChild(a)
    // 用代码模拟用户点击这个链接，浏览器会立即触发下载。
    a.click()

    // --- 5. 清理工作 ---
    // 下载触发后，这个临时的 <a> 标签和 Blob URL 就没用了。
    // 必须进行清理，以防止内存泄漏。
    document.body.removeChild(a)
    URL.revokeObjectURL(url) // 释放 Blob URL 占用的内存。
  },
  /**
   * 一个完整、优雅且强大的 JavaScript 模块动态加载函数。
   * 它能从远程 URL 或本地 File 对象中加载 ES 模块。
   *
   * @param {string | File} source - 要加载的 JavaScript 资源。
   *   - 如果是字符串 (string)，则必须是一个可访问的 JS 模块 URL。
   *   - 如果是文件对象 (File)，则必须是用户通过 <input type="file"> 选择的 JS 文件。
   *
   * @returns {Promise<object>} - 返回一个 Promise。
   *   - 如果加载成功，Promise 会 resolve 一个模块对象 (Module)，包含了该文件 `export` 的所有内容。
   *   - 如果加载失败，Promise 会 reject 一个 Error 对象，包含了失败的原因。
   */
  loadJsModule(source) {
    // --- 1. 处理来自 URL 的加载请求 ---
    if (typeof source === 'string') {
      try {
        // 动态 import() 是加载 ES 模块的现代化标准方法。
        // 它会返回一个 Promise，该 Promise resolve 为模块的命名空间对象。
        return import(source)
      } catch (error) {
        // 捕获无效 URL 等同步错误。
        console.error(`加载模块失败，URL 可能无效: ${source}`, error)
        return Promise.reject(error)
      }
    }

    // --- 2. 处理来自本地 File 对象的加载请求 ---
    if (source instanceof File) {
      // 对于本地文件，我们需要一个更复杂的流程：
      // FileReader 读取文件 -> 创建 Blob -> 创建临时 URL -> 动态 import()
      return new Promise((resolve, reject) => {
        // 验证文件类型，增加健壮性
        if (!source.type.includes('javascript')) {
          return reject(
            new Error(`文件类型不正确: 期望是 JavaScript 文件，但得到的是 ${source.type || '未知类型'}`)
          )
        }

        const reader = new FileReader()

        // 文件读取成功时的回调
        reader.onload = () => {
          const content = reader.result // 文件内容的字符串

          // 创建一个 Blob 对象，这可以被看作是内存中的一个文件。
          const blob = new Blob([content], { type: 'text/javascript' })

          // 为这个 Blob 创建一个唯一的、临时的 URL。
          const url = URL.createObjectURL(blob)

          // 使用这个临时 URL 进行动态导入
          import(url)
            .then(module => {
              resolve(module) // 成功！返回加载的模块
            })
            .catch(error => {
              // 捕获 JS 文件内部的语法错误等
              reject(error)
            })
            .finally(() => {
              // 【关键】无论成功还是失败，都必须释放这个临时 URL，防止内存泄漏。
              URL.revokeObjectURL(url)
            })
        }

        // 文件读取失败时的回调
        reader.onerror = () => {
          reject(new Error('读取本地文件失败！'))
        }

        // 开始以文本形式读取文件
        reader.readAsText(source)
      })
    }

    // --- 3. 处理无效输入 ---
    // 如果 source 既不是字符串也不是 File 对象，则返回一个失败的 Promise。
    return Promise.reject(new Error('无效的加载源：source 必须是 URL 字符串或 File 对象。'))
  },
  formatJSONLikeImage(array) {
    // 首先，将数组中的每个对象转换为紧凑的JSON字符串
    const objectStrings = array.map(obj => {
      // 在每个对象字符串前加上缩进（例如5个空格，可以根据需要调整）
      return '     ' + JSON.stringify(obj)
    })

    // 然后，用逗号和换行符将它们连接起来
    const content = objectStrings.join(',\n')

    // 最后，在外面包上 [ 和 ]，并添加换行符
    const finalString = '[\n' + content + '\n]'

    return finalString
  },
  /**
   * 接收一个脚本 URL 数组和回调函数，在所有脚本加载成功后执行回调。
   * @param {string[]} srcArray - 包含一个或多个脚本 URL 的数组。
   * @param {Function} [onSuccess] - (可选) 所有脚本加载成功后要执行的回调函数。
   * @param {Function} [onError] - (可选) 任何一个脚本加载失败时要执行的回调函数。
   */
  loadResources(srcArray) {
    const promises = srcArray.map(src => {
      return new Promise((resolve, reject) => {
        // --- 处理 JS 文件 ---
        if (src.endsWith('.js')) {
          // 检查脚本是否已存在
          if (document.querySelector(`script[src="${src}"]`)) {
            console.log(`Script already loaded: ${src}`)
            resolve()
            return
          }
          const script = document.createElement('script')
          script.src = src
          script.async = false // 改为 false 来保证执行顺序（如果需要的话）
          script.onload = () => resolve()
          script.onerror = () => reject(new Error(`Failed to load script: ${src}`))
          document.head.appendChild(script) // 推荐将脚本添加到 <head>
        }
        // --- 处理 CSS 文件 ---
        else if (src.endsWith('.css')) {
          // 检查样式表是否已存在
          if (document.querySelector(`link[href="${src}"]`)) {
            console.log(`Stylesheet already loaded: ${src}`)
            resolve()
            return
          }
          const link = document.createElement('link')
          link.rel = 'stylesheet'
          link.type = 'text/css'
          link.href = src
          link.onload = () => resolve()
          link.onerror = () => reject(new Error(`Failed to load stylesheet: ${src}`))
          document.head.appendChild(link)
        }
        // --- 不支持的类型 ---
        else {
          reject(new Error(`Unsupported resource type for: ${src}. Only .js and .css are supported.`))
        }
      })
    })

    // 等待所有资源的 Promise 完成
    return Promise.all(promises)
  },
  /**
   * 递归地在组件树中查找并替换指定ID的组件。
   * 这是一个不可变操作，它会返回一个新的数组，而不会修改原始数组。
   *
   * @param {Array} componentsList - 要搜索的组件数组（树）。
   * @param {Object} newItem - 要插入的新组件对象，它必须包含一个 `id` 属性。
   * @returns {Array} - 一个新的、包含已替换项的组件数组。
   */
  replaceComponentById(componentsList, newItem) {
    // 健壮性检查：如果传入的不是数组，直接返回
    if (!Array.isArray(componentsList)) {
      return componentsList
    }

    // 使用 Array.prototype.map 创建一个新数组。
    // map 会遍历数组中的每一项，并根据你的逻辑返回一个新项。
    return componentsList.map(item => {
      // 1. 检查当前项的 ID 是否匹配
      if (item.id === newItem.id) {
        // 如果匹配，直接返回新项来替换当前项
        console.log(`找到了ID为 ${newItem.id} 的组件并替换它。`)
        return newItem
      }

      // 2. 如果 ID 不匹配，检查当前项是否有子节点
      if (item.children && Array.isArray(item.children)) {
        // 如果有子节点，对子节点数组递归调用此函数
        const updatedChildren = this.replaceComponentById(item.children, newItem)

        // 返回一个当前项的副本，但用更新后的子节点替换原来的子节点
        // 使用扩展运算符(...)可以轻松创建副本
        return {
          ...item,
          children: updatedChildren
        }
      }

      // 3. 如果 ID 不匹配且没有子节点，原样返回当前项
      return item
    })
  }
}
