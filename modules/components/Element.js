/**
 * Element UI (Vue 2.x) 组件配置字典 (V4 - 智能扁平化完整版)
 *
 * 特性:
 * 1.  智能扁平化API: 直接在顶层传入组件的 props, 无需嵌套在 'props' 对象中, 调用更简单。
 * 2.  安全兼容: 同时支持 'props' 对象, 用于解决命名冲突或组织复杂属性。
 * 3.  颜色映射: 依然支持 `type: 'primary'` 自动转换为颜色码。
 * 4.  属性全面: 覆盖表单、数据、反馈等各类常用组件，并提供详尽的默认属性。
 */

const ELEMENT_UI_COLORS = {
  primary: '#409EFF',
  success: '#67C23A',
  warning: '#E6A23C',
  danger: '#F56C6C',
  info: '#909399'
}

// 核心辅助函数 (同上)
function resolveAttrs(attr, defaultProps) {
  const { name, value, events, slot, props: nestedProps, ...restProps } = attr || {}
  let valueName = name || attr.valueName
  let defaultValue = value || attr.defaultValue
  const componentConfig = { valueName, defaultValue }
  const finalProps = { ...defaultProps, ...restProps, ...nestedProps }
  return { componentConfig, finalProps, finalEvents: events, slot }
}

const componentsDict = {
  // --- 表单组件 (Form Components) ---
  input: attr => {
    const defaultProps = {
      type: 'text',
      placeholder: '请输入内容',
      clearable: true,
      autocomplete: 'off',
      size: 'small'
    }
    const { componentConfig, finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'el-input',
      valueName: componentConfig.valueName || 'inputValue',
      defaultValue: componentConfig.defaultValue || '',
      props: finalProps,
      events: finalEvents || { change: val => console.log(`[Input] change:`, val) },
      slot: slot || ''
    }
  },

  textarea: attr => {
    const defaultProps = {
      type: 'textarea',
      placeholder: '请输入详细内容',
      clearable: true,
      rows: 2,
      resize: 'vertical'
    }
    const { componentConfig, finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'el-input',
      valueName: componentConfig.valueName || 'textareaValue',
      defaultValue: componentConfig.defaultValue || '',
      props: finalProps,
      events: finalEvents || { change: val => console.log(`[Textarea] change:`, val) },
      slot: slot || ''
    }
  },

  inputNumber: attr => {
    const defaultProps = { min: -Infinity, max: Infinity, step: 1, controlsPosition: 'right' }
    const { componentConfig, finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'el-input-number',
      valueName: componentConfig.valueName || 'numberValue',
      defaultValue: componentConfig.defaultValue ?? 0,
      props: finalProps,
      events: finalEvents || { change: val => console.log(`[InputNumber] change:`, val) },
      slot: slot || ''
    }
  },

  select: attr => {
    const defaultProps = {
      placeholder: '请选择',
      multiple: false,
      clearable: true,
      filterable: false,
      loadingText: '加载中',
      noMatchText: '无匹配数据',
      noDataText: '无数据'
    }
    const { componentConfig, finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    const finalDefaultValue = finalProps.multiple
      ? componentConfig.defaultValue || []
      : componentConfig.defaultValue ?? undefined
    return {
      component: 'el-select',
      valueName: componentConfig.valueName || 'selectValue',
      defaultValue: finalDefaultValue,
      props: finalProps,
      events: finalEvents || { change: val => console.log(`[Select] change:`, val) },
      slot:
        slot ||
        `<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>`
    }
  },

  cascader: attr => {
    const defaultProps = { placeholder: '请选择', props: { expandTrigger: 'hover' }, clearable: true }
    const { componentConfig, finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'el-cascader',
      valueName: componentConfig.valueName || 'cascaderValue',
      defaultValue: componentConfig.defaultValue || [],
      props: finalProps,
      events: finalEvents || { change: val => console.log(`[Cascader] change:`, val) },
      slot: slot || ''
    }
  },

  switch: attr => {
    const defaultProps = { width: 40, activeValue: true, inactiveValue: false }
    const { componentConfig, finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    const colorType = finalProps.type && ELEMENT_UI_COLORS[finalProps.type]
    finalProps.activeColor =
      finalProps.activeColor || (colorType && finalProps.type !== 'danger' ? colorType : '#409EFF')
    finalProps.inactiveColor =
      finalProps.inactiveColor || (colorType && finalProps.type === 'danger' ? colorType : '#333')
    return {
      component: 'el-switch',
      valueName: componentConfig.valueName || 'switchValue',
      defaultValue: componentConfig.defaultValue ?? false,
      props: finalProps,
      events: finalEvents || { change: val => console.log(`[Switch] change:`, val) },
      slot: slot || ''
    }
  },

  radioGroup: attr => {
    const defaultProps = {}
    const { componentConfig, finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'el-radio-group',
      valueName: componentConfig.valueName || 'radioValue',
      defaultValue: componentConfig.defaultValue || '',
      props: finalProps,
      events: finalEvents || { change: val => console.log(`[RadioGroup] change:`, val) },
      slot:
        slot || `<el-radio v-for="item in options" :key="item.value" :label="item.value">{{item.label}}</el-radio>`
    }
  },

  checkboxGroup: attr => {
    const defaultProps = {}
    const { componentConfig, finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'el-checkbox-group',
      valueName: componentConfig.valueName || 'checkboxValues',
      defaultValue: componentConfig.defaultValue || [],
      props: finalProps,
      events: finalEvents || { change: val => console.log(`[CheckboxGroup] change:`, val) },
      slot:
        slot ||
        `<el-checkbox v-for="item in options" :key="item.value" :label="item.value">{{item.label}}</el-checkbox>`
    }
  },

  datePicker: attr => {
    const defaultProps = {
      type: 'date',
      placeholder: '选择日期',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      rangeSeparator: '-',
      valueFormat: 'yyyy-MM-dd',
      clearable: true,
      editable: true
    }
    const { componentConfig, finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'el-date-picker',
      valueName: componentConfig.valueName || 'dateValue',
      defaultValue: componentConfig.defaultValue || null,
      props: finalProps,
      events: finalEvents || { change: val => console.log(`[DatePicker] change:`, val) },
      slot: slot || ''
    }
  },

  timePicker: attr => {
    const defaultProps = { placeholder: '选择时间', rangeSeparator: '-', valueFormat: 'HH:mm:ss', clearable: true }
    const { componentConfig, finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'el-time-picker',
      valueName: componentConfig.valueName || 'timeValue',
      defaultValue: componentConfig.defaultValue || '',
      props: finalProps,
      events: finalEvents || { change: val => console.log(`[TimePicker] change:`, val) },
      slot: slot || ''
    }
  },

  slider: attr => {
    const defaultProps = { min: 0, max: 100, step: 1, showTooltip: true, range: false }
    const { componentConfig, finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    const finalDefaultValue = finalProps.range
      ? componentConfig.defaultValue || [0, 0]
      : componentConfig.defaultValue ?? 0
    return {
      component: 'el-slider',
      valueName: componentConfig.valueName || 'sliderValue',
      defaultValue: finalDefaultValue,
      props: finalProps,
      events: finalEvents || { change: val => console.log(`[Slider] change:`, val) },
      slot: slot || ''
    }
  },

  rate: attr => {
    const defaultProps = { max: 5 }
    const { componentConfig, finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'el-rate',
      valueName: componentConfig.valueName || 'rateValue',
      defaultValue: componentConfig.defaultValue ?? 0,
      props: finalProps,
      events: finalEvents || { change: val => console.log(`[Rate] change:`, val) },
      slot: slot || ''
    }
  },

  colorPicker: attr => {
    const defaultProps = { showAlpha: false }
    const { componentConfig, finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'el-color-picker',
      valueName: componentConfig.valueName || 'colorValue',
      defaultValue: componentConfig.defaultValue || '#409EFF',
      props: finalProps,
      events: finalEvents || { change: val => console.log(`[ColorPicker] change:`, val) },
      slot: slot || ''
    }
  },

  upload: attr => {
    const defaultProps = { action: '#', listType: 'text', autoUpload: true, showFileList: true }
    const { componentConfig, finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'el-upload',
      valueName: componentConfig.valueName || 'fileList',
      defaultValue: componentConfig.defaultValue || [],
      props: finalProps,
      events: finalEvents || { 'on-success': (res, file) => console.log(`[Upload] success:`, file.name) },
      slot: slot || `<el-button size="small" type="primary">点击上传</el-button>`
    }
  },

  // --- 数据展示、操作等组件 ---

  button: attr => {
    const defaultProps = { type: 'primary', nativeType: 'button' }
    const { finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'el-button',
      valueName: null,
      defaultValue: null,
      props: finalProps,
      events: finalEvents || { click: () => console.log('[Button] click') },
      slot: slot || `<span>按钮</span>`
    }
  },

  progress: attr => {
    const defaultProps = { type: 'line', strokeWidth: 6, showText: true, width: 126 }
    const { componentConfig, finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    const colorType = finalProps.type && ELEMENT_UI_COLORS[finalProps.type]
    finalProps.color = finalProps.color || colorType || ''
    return {
      component: 'el-progress',
      valueName: componentConfig.valueName || 'percentage',
      defaultValue: componentConfig.defaultValue ?? 0,
      props: finalProps,
      events: finalEvents || {},
      slot: slot || ''
    }
  },

  tag: attr => {
    const defaultProps = { type: 'info', effect: 'light' }
    const { finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'el-tag',
      valueName: null,
      defaultValue: null,
      props: finalProps,
      events: finalEvents || { close: () => console.log('[Tag] close') },
      slot: slot || '标签'
    }
  },

  alert: attr => {
    const defaultProps = { title: '提示', type: 'info', closable: true, effect: 'light' }
    const { finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'el-alert',
      valueName: null,
      defaultValue: null,
      props: finalProps,
      events: finalEvents || { close: () => console.log('[Alert] close') },
      slot: slot || ''
    }
  },

  divider: attr => {
    const defaultProps = { direction: 'horizontal', contentPosition: 'center' }
    const { finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'el-divider',
      valueName: null,
      defaultValue: null,
      props: finalProps,
      events: finalEvents || {},
      slot: slot || ''
    }
  },

  avatar: attr => {
    const defaultProps = { size: 'medium', shape: 'circle', icon: 'el-icon-user-solid' }
    const { finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'el-avatar',
      valueName: null,
      defaultValue: null,
      props: finalProps,
      events: finalEvents || {},
      slot: slot || ''
    }
  },

  card: attr => {
    const defaultProps = { header: '卡片标题', shadow: 'always' }
    const { finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'el-card',
      valueName: null,
      defaultValue: null,
      props: finalProps,
      events: finalEvents || {},
      slot: slot || '<div>卡片内容区</div>'
    }
  },

  text: attr => {
    const defaultProps = { style: { color: '#606266', fontSize: '14px', margin: 0 } }
    const { componentConfig, finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: finalProps.tag || 'p', // 允许通过 tag 属性指定渲染的 HTML 标签
      valueName: componentConfig.valueName || 'textValue',
      defaultValue: componentConfig.defaultValue || '这是一段静态文本',
      props: finalProps,
      events: finalEvents || {},
      slot: slot || ''
    }
  }
}
export default componentsDict
