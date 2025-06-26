// utils/componentLoader.js

/**
 * 一个缓存已加载CSS的集合，防止重复插入样式表到<head>。
 */
const loadedCssUrls = new Set()

/**
 * 为Vue Router创建一个健壮的异步组件加载器。
 * 它可以从外部文件加载HTML模板和CSS样式。
 *
 * @param {object} componentOptions - 组件的JavaScript选项对象 (必须包含 name)。
 * @param {string} templateUrl - 模板文件的URL。
 * @param {string} [cssUrl] - (可选) CSS文件的URL。
 * @returns {function} 一个符合Vue异步组件规范的函数，可直接在路由定义中使用。
 */
export default function createRouterComponent(componentOptions, templateUrl, cssUrl) {
  // 检查基础的组件配置
  if (!componentOptions || typeof componentOptions.name !== 'string') {
    throw new Error('[ComponentLoader] `componentOptions` must be an object with a `name` property.')
  }
  if (typeof templateUrl !== 'string') {
    throw new Error('[ComponentLoader] `templateUrl` must be a valid string URL.')
  }

  const componentName = componentOptions.name

  // 返回一个标准的Vue异步组件函数
  return () => {
    // 使用Promise包装，以便在加载失败时可以reject
    return new Promise((resolve, reject) => {
      const promises = []

      // 1. 创建加载HTML模板的Promise
      const templatePromise = fetch(templateUrl).then(response => {
        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status} - Failed to fetch template for '${componentName}' from ${templateUrl}`
          )
        }
        return response.text()
      })
      promises.push(templatePromise)

      // 2. 如果提供了CSS URL，创建加载CSS的Promise
      if (cssUrl && !loadedCssUrls.has(cssUrl)) {
        const cssPromise = fetch(cssUrl)
          .then(response => {
            if (!response.ok) {
              // CSS加载失败不应该阻塞组件渲染，所以我们只打印警告
              console.warn(
                `[ComponentLoader] HTTP ${response.status} - Failed to fetch CSS for '${componentName}' from ${cssUrl}. The component will render without it.`
              )
              return null // 返回null，让Promise.all继续
            }
            return response.text()
          })
          .then(cssText => {
            if (cssText) {
              const style = document.createElement('style')
              style.textContent = cssText
              document.head.appendChild(style)
              loadedCssUrls.add(cssUrl)
            }
          })
          .catch(error => {
            console.warn(`[ComponentLoader] An error occurred while loading CSS for '${componentName}'.`, error)
            // 同样，即使捕获到错误，也继续执行
          })
        promises.push(cssPromise)
      }

      // 3. 等待所有资源加载完成
      Promise.all(promises)
        .then(([templateContent]) => {
          // templateContent 是 templatePromise 的结果
          const finalComponent = {
            ...componentOptions,
            template: templateContent
          }

          // 成功！解析最终的组件对象
          resolve(finalComponent)
        })
        .catch(error => {
          // 这个catch主要捕获templatePromise的失败，因为它是唯一会throw的
          console.error(`[ComponentLoader] Failed to load component '${componentName}'.`, error)
          // 关键：加载失败时，必须调用reject！
          reject(error)
        })
    })
  }
}
