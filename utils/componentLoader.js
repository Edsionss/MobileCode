// utils/componentLoader.js

/**
 * 创建一个 Vue 异步组件，该组件会先加载外部 HTML 模板和可选的 CSS。
 * 具备增强的错误报告功能。
 * @param {object} componentConfig - 原始的组件配置对象。必须包含 name 属性用于调试。
 * @param {string} templateUrl - 外部模板文件的 URL。
 * @param {string} [cssUrl] - (可选) 外部 CSS 文件的 URL。
 * @returns {function} - 一个标准的 Vue 异步组件定义函数。
 */
const loadedCssUrls = new Set()

export default {
  createAsyncComponent(componentConfig, templateUrl, cssUrl) {
    // 【增强1】: 增加组件名称检查，强制要求提供 name 属性，这对于调试至关重要。
    if (!componentConfig || !componentConfig.name) {
      throw new Error(
        `[ComponentLoader] Error: componentConfig must be an object with a 'name' property. Error occurred while loading template: ${templateUrl}`
      )
    }

    const componentName = componentConfig.name

    return (resolve, reject) => {
      // 1. 加载 HTML 模板的 Promise
      const templatePromise = fetch(templateUrl)
        .then(response => {
          // 【增强2】: 检查网络请求是否成功 (例如 404 Not Found)
          if (!response.ok) {
            // 如果请求失败，立即抛出一个包含详细信息的错误
            throw new Error(
              `HTTP error! Status: ${response.status}. Failed to fetch template for component '${componentName}' from '${templateUrl}'.`
            )
          }
          return response.text()
        })
        .catch(err => {
          // 【增强3】: 在 catch 块中包装错误，提供更清晰的上下文
          console.error(`[ComponentLoader] Failed to load template for component '${componentName}'.`, {
            componentName: componentName,
            templateUrl: templateUrl,
            originalError: err
          })
          // 将原始错误包装后再次抛出，以便 Vue 的异步组件机制能捕获到 reject
          throw new Error(
            `[ComponentLoader] Template load failed for '${componentName}' from '${templateUrl}'. See console for original error.`
          )
        })

      // 2. 加载 CSS 的 Promise
      const cssPromise = new Promise(cssResolve => {
        if (!cssUrl || loadedCssUrls.has(cssUrl)) {
          cssResolve()
          return
        }

        const style = document.createElement('style')
        fetch(cssUrl)
          .then(response => {
            // 【增强4】: 同样检查 CSS 文件的网络请求
            if (!response.ok) {
              throw new Error(
                `HTTP error! Status: ${response.status}. Failed to fetch CSS for component '${componentName}' from '${cssUrl}'.`
              )
            }
            return response.text()
          })
          .then(cssText => {
            style.textContent = cssText
            document.head.appendChild(style)
            loadedCssUrls.add(cssUrl)
            cssResolve()
          })
          .catch(err => {
            // 【增强5】: 对 CSS 加载失败提供详细的错误报告
            console.error(
              `[ComponentLoader] Failed to load CSS for component '${componentName}'. The component will still attempt to render without this stylesheet.`,
              {
                componentName: componentName,
                cssUrl: cssUrl,
                originalError: err
              }
            )
            // 即使 CSS 失败，我们依然 resolve，让组件继续渲染
            cssResolve()
          })
      })

      // 3. 等待所有 Promises 完成
      Promise.all([templatePromise, cssPromise])
        .then(([template]) => {
          resolve({
            ...componentConfig,
            template: template
          })
        })
        .catch(err => {
          // 【增强6】: 最终的 catch，能捕获到模板加载失败时抛出的包装后错误
          // 这里我们直接调用 reject，并将包装后的错误传递给 Vue
          console.error(`loading error from: ${templateUrl}`)
          reject(err)
        })
    }
  }
}
