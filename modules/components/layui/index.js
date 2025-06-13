const layuiComponentDictionary = {
  /**
   * 生成一个 Layui 输入框 (input)
   * @param {object} config - 配置对象
   * @param {string} [config.label='标签'] - 左侧标签文本
   * @param {string} [config.name=''] - input 的 name 属性，用于表单提交
   * @param {string} [config.value=''] - 默认值
   * @param {string} [config.placeholder='请输入...'] - 提示文字
   * @param {string} [config.type='text'] - input 类型 (text, password, number, etc.)
   * @param {boolean} [config.disabled=false] - 是否禁用
   * @param {boolean} [config.readonly=false] - 是否只读
   * @param {string} [config.layVerify=''] - Layui 的表单验证规则 (e.g., 'required|phone')
   * @returns {string} - 生成的 HTML 字符串
   */
  input: (config = {}) => {
    // 使用解构赋值和默认值，如果config中没有对应属性，则使用等号右边的值
    const {
      label = '标签',
      name = '',
      value = '',
      placeholder = '请输入...',
      type = 'text',
      disabled = false,
      readonly = false,
      layVerify = '',
      defaultValue = ''
    } = config

    return `
      <div class="layui-form-item">
        <label class="layui-form-label">${label}</label>
        <div class="layui-input-block">
          <input 
            type="${type}" 
            name="${name}" 
            value="${value}"
            placeholder="${placeholder}" 
            autocomplete="off" 
            class="layui-input"
            lay-verify="${layVerify}"
            value="${defaultValue}"
            ${disabled ? 'disabled' : ''}
            ${readonly ? 'readonly' : ''}
          >
        </div>
      </div>
    `
  },

  /**
   * 生成一个 Layui 文本域 (textarea)
   * @param {object} config - 配置对象, 参数同 input
   * @returns {string} - 生成的 HTML 字符串
   */
  textarea: (config = {}) => {
    const {
      label = '文本域',
      name = '',
      value = '',
      placeholder = '请输入内容',
      disabled = false,
      readonly = false,
      layVerify = ''
    } = config

    return `
      <div class="layui-form-item layui-form-text">
        <label class="layui-form-label">${label}</label>
        <div class="layui-input-block">
          <textarea 
            name="${name}" 
            placeholder="${placeholder}" 
            class="layui-textarea"
            lay-verify="${layVerify}"
            ${disabled ? 'disabled' : ''}
            ${readonly ? 'readonly' : ''}
          >${value}</textarea>
        </div>
      </div>
    `
  },

  /**
   * 生成一个 Layui 下拉选择框 (select)
   * @param {object} config - 配置对象
   * @param {Array<object>} [config.options=[]] - 选项数组, e.g., [{value: '1', text: '北京'}, {value: '2', text: '上海'}]
   * @param {string|number} [config.selectedValue=''] - 默认选中的值
   * @returns {string} - 生成的 HTML 字符串
   */
  select: (config = {}) => {
    const {
      label = '选择框',
      name = '',
      options = [],
      selectedValue = '',
      disabled = false,
      layVerify = ''
    } = config

    // 动态生成 <option> 列表
    const optionsHtml = options
      .map(
        opt =>
          `<option value="${opt.value || opt.name}" ${
            (opt.value || opt.name) == selectedValue ? 'selected' : ''
          }>${opt.text || opt.label}</option>`
      )
      .join('')

    return `
      <div class="layui-form-item">
        <label class="layui-form-label">${label}</label>
        <div class="layui-input-block">
          <select name="${name}" lay-verify="${layVerify}" ${disabled ? 'disabled' : ''}>
            <option value="">请选择</option>
            ${optionsHtml}
          </select>
        </div>
      </div>
    `
  },

  /**
   * 生成一个 Layui 开关 (switch)
   * @param {object} config - 配置对象
   * @param {boolean} [config.checked=false] - 是否默认选中
   * @param {string} [config.text='ON|OFF'] - 开关的文本，用'|'分隔
   * @returns {string} - 生成的 HTML 字符串
   */
  switch: (config = {}) => {
    const { label = '开关', name = '', checked = false, disabled = false, text = 'ON|OFF' } = config

    return `
      <div class="layui-form-item">
        <label class="layui-form-label">${label}</label>
        <div class="layui-input-block">
          <input 
            type="checkbox" 
            name="${name}" 
            lay-skin="switch" 
            lay-text="${text}" 
            ${checked ? 'checked' : ''}
            ${disabled ? 'disabled' : ''}
          >
        </div>
      </div>
    `
  },

  /**
   * 生成 Layui 日期选择器
   * 注意: 需要额外调用 layui.laydate.render()
   * @param {object} config - 配置对象
   * @param {string} [config.id=laydate- + 随机数] - 必须有一个唯一的ID
   */
  date: (config = {}) => {
    const {
      label = '日期选择',
      name = '',
      value = '',
      placeholder = 'yyyy-MM-dd',
      // 为日期选择器生成一个唯一的ID，以便JS可以绑定它
      id = 'laydate-' + Math.random().toString(36).substr(2, 9)
    } = config

    // 提醒用户需要在JS中进行渲染
    console.log(`提示：请为ID为 "${id}" 的日期选择器调用 layui.laydate.render()。`)

    return `
        <div class="layui-form-item">
          <label class="layui-form-label">${label}</label>
          <div class="layui-input-block">
            <input 
              type="text" 
              id="${id}"
              name="${name}" 
              value="${value}"
              placeholder="${placeholder}" 
              autocomplete="off" 
              class="layui-input"
            >
          </div>
        </div>
      `
  }
}
export default layuiComponentDictionary
