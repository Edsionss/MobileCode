// utils/componentLoader.js

const loadedCssUrls = new Set()

/**
 * 内部核心函数，负责实际的加载逻辑。
 * @param {object} componentConfig - 原始的组件配置对象。
 * @param {string|null} templateUrl - 外部模板文件的 URL。
 * @param {string|null} cssUrl - (可选) 外部 CSS 文件的 URL。
 * @param {object} [options={}] - (可选) 加载选项。
 * @param {string[]} [options.skip=[]] - 包含要跳过的模块名称的数组 (e.g., ['css', 'html'])。
 * @returns {function} - 一个标准的 Vue 异步组件定义函数。
 * @private
 */
function _create(componentConfig, templateUrl, cssUrl, options = {}) {
  const { skip = [] } = options

  // 始终需要组件的基础配置
  if (!componentConfig || !componentConfig.name) {
    throw new Error(`[ComponentLoader] Error: componentConfig must have a 'name' property.`)
  }

  const componentName = componentConfig.name

  return (resolve, reject) => {
    // 1. 条件性地加载 HTML 模板
    const shouldLoadTemplate = templateUrl && !skip.includes('html')
    const templatePromise = shouldLoadTemplate
      ? fetch(templateUrl)
          .then(response => {
            if (!response.ok)
              throw new Error(
                `HTTP error! Status: ${response.status}. Failed to fetch template for '${componentName}' from '${templateUrl}'.`
              )
            return response.text()
          })
          .catch(err => {
            console.error(`[ComponentLoader] Failed to load template for component '${componentName}'.`, {
              componentName,
              templateUrl,
              originalError: err
            })
            throw new Error(
              `[ComponentLoader] Template load failed for '${componentName}'. See console for original error.`
            )
          })
      : Promise.resolve(null) // 如果跳过加载，立即 resolve 为 null

    // 2. 条件性地加载 CSS
    const shouldLoadCss = cssUrl && !skip.includes('css') && !loadedCssUrls.has(cssUrl)
    const cssPromise = shouldLoadCss
      ? new Promise(cssResolve => {
          // 包装在 Promise 中以统一处理 catch
          fetch(cssUrl)
            .then(response => {
              if (!response.ok)
                throw new Error(
                  `HTTP error! Status: ${response.status}. Failed to fetch CSS for '${componentName}' from '${cssUrl}'.`
                )
              return response.text()
            })
            .then(cssText => {
              const style = document.createElement('style')
              style.textContent = cssText
              document.head.appendChild(style)
              loadedCssUrls.add(cssUrl)
              cssResolve()
            })
            .catch(err => {
              console.error(
                `[ComponentLoader] Failed to load CSS for '${componentName}'. Component will render without it.`,
                { componentName, cssUrl, originalError: err }
              )
              cssResolve() // 即使 CSS 失败，也继续
            })
        })
      : Promise.resolve() // 如果跳过加载，立即 resolve

    // 3. 等待所有 Promises 完成
    Promise.all([templatePromise, cssPromise])
      .then(([template]) => {
        const finalComponentConfig = { ...componentConfig }

        // 只有在成功加载了模板时，才将其添加到组件配置中
        if (template) {
          finalComponentConfig.template = template
        }

        // 如果既没有获取到模板，组件本身也没有提供 render 函数，那么这个组件是无效的。
        if (!finalComponentConfig.template && !finalComponentConfig.render) {
          const errorMessage = `[ComponentLoader] Component '${componentName}' was created without a template and does not have a render function.`
          console.error(errorMessage, { componentName })
          // 拒绝 promise，让 Vue 知道组件加载失败
          reject(new Error(errorMessage))
          return
        }

        // 成功，解析最终的组件配置
        resolve(finalComponentConfig)
      })
      .catch(err => {
        // 这个 catch 主要捕获模板加载失败时的错误
        console.error(`[ComponentLoader] Final loading error for component '${componentName}'`)
        reject(err)
      })
  }
}

/**
 * 创建一个可配置的 Vue 异步组件。
 * @param {object} componentConfig - 原始的组件配置对象 (JS 部分)。
 * @param {string} [templateUrl] - (可选) 外部模板文件的 URL。
 * @param {string} [cssUrl] - (可选) 外部 CSS 文件的 URL。
 * @returns {function & {remove: function}} - 一个增强的 Vue 异步组件函数。
 */
export default function createAsyncComponent(componentConfig, templateUrl, cssUrl) {
  // 创建默认的异步组件函数（加载所有可用模块）
  const defaultAsyncComponent = _create(componentConfig, templateUrl, cssUrl, { skip: [] })

  // 附加 .remove() 方法
  defaultAsyncComponent.remove = (modulesToSkip = []) => {
    if (!Array.isArray(modulesToSkip)) {
      console.warn(
        `[ComponentLoader] .remove() expects an array of strings (e.g., ['css', 'html']). Received:`,
        modulesToSkip
      )
      return _create(componentConfig, templateUrl, cssUrl, { skip: [] }) // 返回默认版本
    }
    // 创建并返回一个带有跳过选项的新版本
    return _create(componentConfig, templateUrl, cssUrl, { skip: modulesToSkip })
  }

  return defaultAsyncComponent
}
