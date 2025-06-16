// utils/componentLoader.js (或者你喜欢的任何路径)

/**
 * 创建一个 Vue 异步组件，该组件会先加载外部 HTML 模板和可选的 CSS。
 * @param {object} componentConfig - 原始的组件配置对象。
 * @param {string} templateUrl - 外部模板文件的 URL。
 * @param {string} [cssUrl] - (可选) 外部 CSS 文件的 URL。
 * @returns {function} - 一个标准的 Vue 异步组件定义函数。
 */
// 用一个 Set 来记录已经加载过的 CSS，避免重复注入
const loadedCssUrls = new Set()
export default {
  createAsyncComponent(componentConfig, templateUrl, cssUrl) {
    return (resolve, reject) => {
      // 创建两个 Promise，一个用于加载模板，一个用于加载CSS
      const templatePromise = fetch(templateUrl).then(res => res.text())

      const cssPromise = new Promise(cssResolve => {
        // 如果没有提供 cssUrl 或者已经加载过，则立即完成
        if (!cssUrl || loadedCssUrls.has(cssUrl)) {
          cssResolve()
          return
        }

        // 创建 <style> 标签来注入 CSS
        const style = document.createElement('style')
        fetch(cssUrl)
          .then(res => res.text())
          .then(cssText => {
            style.textContent = cssText
            document.head.appendChild(style)
            loadedCssUrls.add(cssUrl) // 标记为已加载
            cssResolve()
          })
          .catch(err => {
            console.error(`Failed to load CSS: ${cssUrl}`, err)
            cssResolve() // 即使CSS加载失败，也继续渲染组件
          })
      })

      // 等待模板和CSS都加载完毕
      Promise.all([templatePromise, cssPromise])
        .then(([template]) => {
          // 组装最终的组件配置
          resolve({
            ...componentConfig,
            template: template
          })
        })
        .catch(reject)
    }
  }
}
