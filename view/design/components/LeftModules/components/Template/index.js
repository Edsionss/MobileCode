import main from '@config/main.js'
const { createAsyncComponent } = main

const name = {
  name: 'name',

  template: `
    <div>Loading...</div>
  `,
  data() {
    return { a: 'ababababa' }
  }
}
// 使用 import.meta.url 可以帮助我们构建一个相对于当前 JS 文件的路径
// 这比硬编码 '..' 更健壮
const templateUrl = new URL('index.html', import.meta.url).href
const cssUrl = new URL('index.css', import.meta.url).href
// 4. 关键：调用加载器，将自己包装成异步组件，然后导出
export default createAsyncComponent(name, templateUrl, cssUrl)
