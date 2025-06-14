/**
 * Wot Design (Vue 2.x) 组件配置字典
 *
 * 设计模式与 Element UI 版本完全一致，旨在提供一套简洁、智能、可扩展的组件生成方案。
 *
 * 特性:
 * 1.  智能扁平化API: 直接在顶层传入组件的 props，无需嵌套在 'props' 对象中。
 * 2.  安全兼容: 同时支持 'props' 对象，用于解决命名冲突或组织复杂属性。
 * 3.  颜色映射: 支持 `type: 'primary'` 自动转换为 Wot Design 的主题色码。
 * 4.  属性全面: 覆盖表单、数据、反馈等各类常用组件，并提供详尽的默认属性。
 */

const WOT_DESIGN_COLORS = {
  primary: '#3f51b5',
  success: '#4caf50',
  warning: '#ff9800',
  danger: '#f44336',
  info: '#909399' // 假设的 info 颜色
}

// 核心辅助函数 (与 Element UI 示例完全相同，可重用)
function resolveAttrs(attr, defaultProps) {
  // 从 attr 中解构出特殊字段和其余的 props
  const { name, value, events, slot, props: nestedProps, ...restProps } = attr || {}

  // 兼容 valueName 和 defaultValue 别名
  let valueName = name || attr.valueName
  let defaultValue = value ?? attr.defaultValue // 使用 ?? 确保 0, false, '' 等有效值被接受

  // 组合最终的 props，优先级: nestedProps > restProps > defaultProps
  const finalProps = { ...defaultProps, ...restProps, ...nestedProps }

  return {
    componentConfig: { valueName, defaultValue },
    finalProps,
    finalEvents: events,
    slot
  }
}

const componentsDict = {
  // --- 表单组件 (Form Components) ---
  input: attr => {
    const defaultProps = {
      type: 'text',
      placeholder: '请输入内容',
      clearable: true
      // Wot Design 没有 autocomplete 属性，这里省略
    }
    const { componentConfig, finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'wd-input',
      valueName: componentConfig.valueName || 'inputValue',
      defaultValue: componentConfig.defaultValue ?? '',
      props: finalProps,
      events: finalEvents || { change: val => console.log(`[Wot Input] change:`, val) },
      slot: slot || ''
    }
  },

  textarea: attr => {
    const defaultProps = {
      type: 'textarea',
      placeholder: '请输入详细内容',
      clearable: true,
      showWordLimit: false,
      autosize: false
    }
    const { componentConfig, finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'wd-input', // Wot Design 中 Textarea 是 Input 的一种 type
      valueName: componentConfig.valueName || 'textareaValue',
      defaultValue: componentConfig.defaultValue ?? '',
      props: finalProps,
      events: finalEvents || { change: val => console.log(`[Wot Textarea] change:`, val) },
      slot: slot || ''
    }
  },

  inputNumber: attr => {
    const defaultProps = { min: -Infinity, max: Infinity, step: 1, allowEmpty: false }
    const { componentConfig, finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'wd-input-number',
      valueName: componentConfig.valueName || 'numberValue',
      defaultValue: componentConfig.defaultValue ?? 0,
      props: finalProps,
      events: finalEvents || { change: val => console.log(`[Wot InputNumber] change:`, val) },
      slot: slot || ''
    }
  },

  // Wot Design 没有独立的 Select，其功能由 Picker 实现，这里模拟一个 Picker 的工厂
  picker: attr => {
    const defaultProps = {
      // Picker 的 props 通常在弹窗时设置，这里留空或设置通用项
      title: '请选择',
      'show-toolbar': true,
      columns: ['选项1', '选项2', '选项3', '选项4', '选项5', '选项6', '选项7']
    }
    const { componentConfig, finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    // Picker 本身不直接 v-model，而是通过事件更新外部值。
    // 这个工厂主要用于定义 Picker 的属性和事件。
    return {
      component: 'wd-picker',
      valueName: componentConfig.valueName || 'pickerValue',
      defaultValue: componentConfig.defaultValue ?? '',
      props: finalProps,
      // Wot 的事件是 confirm, cancel, change
      events: finalEvents || { confirm: val => console.log(`[Wot Picker] confirm:`, val) },
      slot: slot || ''
    }
  },
  selectPicker: attr => {
    const defaultProps = {
      // Picker 的 props 通常在弹窗时设置，这里留空或设置通用项
      title: '请选择',
      'show-toolbar': true,
      columns: [
        {
          value: '101',
          label: '男装'
        },
        {
          value: '102',
          label: '奢侈品'
        },
        {
          value: '103',
          label: '女装'
        }
      ]
    }
    const { componentConfig, finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    // Picker 本身不直接 v-model，而是通过事件更新外部值。
    // 这个工厂主要用于定义 Picker 的属性和事件。
    return {
      component: 'wd-select-picker',
      valueName: componentConfig.valueName || 'selectPickerValue',
      defaultValue: componentConfig.defaultValue ?? '',
      props: finalProps,
      // Wot 的事件是 confirm, cancel, change
      events: finalEvents || { confirm: val => console.log(`[Wot Picker] confirm:`, val) },
      slot: slot || ''
    }
  },

  switch: attr => {
    const defaultProps = { activeValue: true, inactiveValue: false }
    const { componentConfig, finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    const colorType = finalProps.type && WOT_DESIGN_COLORS[finalProps.type]
    if (colorType) {
      finalProps.activeColor = finalProps.activeColor || colorType
    }
    return {
      component: 'wd-switch',
      valueName: componentConfig.valueName || 'switchValue',
      defaultValue: componentConfig.defaultValue ?? false,
      props: finalProps,
      events: finalEvents || { change: val => console.log(`[Wot Switch] change:`, val) },
      slot: slot || ''
    }
  },

  radioGroup: attr => {
    const defaultProps = { shape: 'circle' } // Wot Design 支持 shape
    const { componentConfig, finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'wd-radio-group',
      valueName: componentConfig.valueName || 'radioValue',
      defaultValue: componentConfig.defaultValue ?? '',
      props: finalProps,
      events: finalEvents || { change: val => console.log(`[Wot RadioGroup] change:`, val) },
      // Wot Design 的 Radio 子组件 value 绑定在自身
      slot:
        slot || `<wd-radio v-for="item in options" :key="item.value" :value="item.value">{{item.label}}</wd-radio>`
    }
  },

  checkboxGroup: attr => {
    const defaultProps = { shape: 'square' }
    const { componentConfig, finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'wd-checkbox-group',
      valueName: componentConfig.valueName || 'checkboxValues',
      defaultValue: componentConfig.defaultValue || [],
      props: finalProps,
      events: finalEvents || { change: val => console.log(`[Wot CheckboxGroup] change:`, val) },
      // Wot Design 的 Checkbox 子组件 value 绑定在自身
      slot:
        slot ||
        `<wd-checkbox v-for="item in options" :key="item.value" :value="item.value">{{item.label}}</wd-checkbox>`
    }
  },

  // Wot Design 日期时间选择器
  datetimePicker: attr => {
    const defaultProps = {
      type: 'date',
      title: '选择日期'
    }
    const { componentConfig, finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'wd-datetime-picker',
      valueName: componentConfig.valueName || 'dateValue',
      defaultValue: componentConfig.defaultValue || new Date(),
      props: finalProps,
      events: finalEvents || { confirm: val => console.log(`[Wot DateTimePicker] confirm:`, val) },
      slot: slot || ''
    }
  },

  slider: attr => {
    const defaultProps = { min: 0, max: 100, step: 1, disabled: false }
    const { componentConfig, finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    // Wot Slider v-model 直接是单个值，不支持 range
    return {
      component: 'wd-slider',
      valueName: componentConfig.valueName || 'sliderValue',
      defaultValue: componentConfig.defaultValue ?? 0,
      props: finalProps,
      events: finalEvents || { change: val => console.log(`[Wot Slider] change:`, val) },
      slot: slot || ''
    }
  },

  rate: attr => {
    const defaultProps = { count: 5, readonly: false }
    const { componentConfig, finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'wd-rate',
      valueName: componentConfig.valueName || 'rateValue',
      defaultValue: componentConfig.defaultValue ?? 0,
      props: finalProps,
      events: finalEvents || { change: val => console.log(`[Wot Rate] change:`, val) },
      slot: slot || ''
    }
  },

  uploader: attr => {
    const defaultProps = {
      // Wot Uploader 的 action 是必需的
      action: '#'
      // Wot 使用 'on-success' 事件，而不是 props
    }
    const { componentConfig, finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'wd-upload',
      valueName: componentConfig.valueName || 'fileList', // v-model 绑定的是 fileList
      defaultValue: componentConfig.defaultValue || [],
      props: finalProps,
      events: finalEvents || { success: (res, file) => console.log(`[Wot Upload] success:`, file.name) },
      slot: slot || `<wd-button>点击上传</wd-button>`
    }
  },

  // --- 数据展示、操作等组件 ---

  button: attr => {
    const defaultProps = { type: 'primary', block: false, round: false }
    const { finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'wd-button',
      valueName: null,
      defaultValue: null,
      props: finalProps,
      events: finalEvents || { click: () => console.log('[Wot Button] click') },
      slot: slot || `<span>按钮</span>`
    }
  },

  tag: attr => {
    const defaultProps = { type: 'primary', plain: false, round: false, closable: false }
    const { finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'wd-tag',
      valueName: null,
      defaultValue: null,
      props: finalProps,
      events: finalEvents || { close: () => console.log('[Wot Tag] close') },
      slot: slot || '标签'
    }
  },

  progress: attr => {
    const defaultProps = { strokeWidth: 8, showPivot: true }
    const { componentConfig, finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    const colorType = finalProps.type && WOT_DESIGN_COLORS[finalProps.type]
    if (colorType) {
      finalProps.color = finalProps.color || colorType
    }
    return {
      component: 'wd-progress',
      valueName: componentConfig.valueName || 'percentage',
      defaultValue: componentConfig.defaultValue ?? 0,
      props: finalProps,
      events: finalEvents || {},
      slot: slot || ''
    }
  },

  divider: attr => {
    const defaultProps = {}
    const { finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'wd-divider',
      valueName: null,
      defaultValue: null,
      props: finalProps,
      events: finalEvents || {},
      slot: slot || ''
    }
  },

  // Wot Design Cell 可用于展示信息
  cell: attr => {
    const defaultProps = { title: '单元格', value: '内容', isLink: false }
    const { finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'wd-cell',
      valueName: null,
      defaultValue: null,
      props: finalProps,
      events: finalEvents || { click: () => console.log('[Wot Cell] click') },
      slot: slot || ''
    }
  },

  // Wot Design 没有头像，但可以用 wd-img 代替
  img: attr => {
    const defaultProps = {
      width: '80px',
      height: '80px',
      round: false,
      fit: 'cover',
      // Wot Design 需要一个有效的 src
      src: 'https://img01.yzcdn.cn/vant/cat.jpeg'
    }
    const { finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'wd-img',
      valueName: null,
      defaultValue: null,
      props: finalProps,
      events: finalEvents || {},
      slot: slot || ''
    }
  }
}

export default componentsDict
