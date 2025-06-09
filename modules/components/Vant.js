/**
 * Vant UI (Vue 2.x) 组件配置字典
 *
 * 借鉴了 Element UI 字典的优秀设计，并为 Vant 2 全面优化。
 *
 * 特性:
 * 1.  智能扁平化API: 直接在顶层传入 Vant 组件的 props, 调用更简单。
 * 2.  安全兼容: 同时支持 'props' 对象, 用于解决命名冲突或组织复杂属性。
 * 3.  Vant 风格: 所有默认属性、组件名和插槽都完全符合 Vant 2 的规范。
 * 4.  组合模式: 为 Vant 常见的组合用法（如 Field+Popup+Picker）提供了便捷的封装。
 */

// Vant 的主题色，用于在需要时手动映射
const VANT_COLORS = {
  primary: '#409EFF', // Vant 的主色是绿色
  success: '#07c160',
  warning: '#ff976a',
  danger: '#ee0a24',
  info: '#969799'
}

// 核心辅助函数 (与 Element UI 示例中的逻辑完全相同，用于处理属性)
function resolveAttrs(attr, defaultProps) {
  // 从配置对象中解构出标准字段和其余的 props
  const { name, id, value, events, slot, props: nestedProps, ...restProps } = attr || {}

  // 确定 value 的字段名和默认值
  let valueName = name || attr.valueName
  let defaultValue = value ?? attr.defaultValue // 使用 ?? 确保 0, false, '' 等有效值被接受

  const componentConfig = { valueName, defaultValue }

  // 合并 props: 默认 props < 顶层 props < 嵌套的 props
  const finalProps = { ...defaultProps, ...restProps, ...nestedProps, attr }

  return { componentConfig, finalProps, finalEvents: events, slot }
}

const Vant = {
  // --- 表单组件 (Form Components) ---
  field: attr => {
    // van-field 是 Vant 中最基础的输入框，可替代 input 和 textarea
    const defaultProps = {
      type: 'text',
      placeholder: '请输入内容',
      clearable: true,
      autocomplete: 'off',
      label: '字段'
    }
    const { componentConfig, finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'van-field',
      valueName: componentConfig.valueName || 'fieldValue',
      defaultValue: componentConfig.defaultValue ?? '',
      props: finalProps,
      // Vant 中实时更新事件是 'input'
      events: finalEvents || { input: val => console.log(`[Field] input:`, val) },
      slot: slot || ''
    }
  },

  stepper: attr => {
    // Vant 的数字输入器叫 Stepper
    const defaultProps = { min: -Infinity, max: Infinity, step: 1, integer: false }
    const { componentConfig, finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'van-stepper',
      valueName: componentConfig.valueName || 'stepperValue',
      defaultValue: componentConfig.defaultValue ?? 0,
      props: finalProps,
      events: finalEvents || { change: val => console.log(`[Stepper] change:`, val) },
      slot: slot || ''
    }
  },

  // 这是一个组合组件的例子，模拟用户点击一个字段后弹出选择器
  fieldPicker: attr => {
    // 这个组件本身是一个只读的 Field，用于显示选择结果和触发弹窗
    // 实际的 Picker 组件需要在弹窗中另外实现，这里只处理“壳”
    const defaultProps = {
      isLink: true,
      readonly: true,
      placeholder: '点击选择',
      label: '选择器'
    }
    const { componentConfig, finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'van-field',
      // 它自己的值是用来显示的，可能与实际 value 不同
      valueName: componentConfig.valueName || 'pickerDisplayValue',
      defaultValue: componentConfig.defaultValue ?? '',
      props: finalProps,
      // 通常是 click 事件来打开弹窗
      events: finalEvents || { click: () => console.log(`[FieldPicker] click: 应打开Popup`) },
      slot: slot || ''
    }
  },

  switch: attr => {
    const defaultProps = { size: '24px', activeValue: true, inactiveValue: false }
    const { componentConfig, finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    // 为 Switch 的颜色应用 Vant 的主题色
    const colorType = finalProps.type && VANT_COLORS[finalProps.type]
    finalProps.activeColor = finalProps.activeColor || (colorType ? colorType : '#07c160')

    return {
      component: 'van-switch',
      valueName: componentConfig.valueName || 'switchValue',
      defaultValue: componentConfig.defaultValue ?? false,
      props: finalProps,
      events: finalEvents || { change: val => console.log(`[Switch] change:`, val) },
      slot: slot || ''
    }
  },

  radioGroup: attr => {
    const defaultProps = { direction: 'horizontal' }
    const { componentConfig, finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'van-radio-group',
      valueName: componentConfig.valueName || 'radioValue',
      defaultValue: componentConfig.defaultValue ?? '',
      props: finalProps,
      events: finalEvents || { change: val => console.log(`[RadioGroup] change:`, val) },
      // 插槽使用 Vant 的 van-radio
      slot:
        slot ||
        `<van-radio v-for="item in options" :key="item.value" :name="item.value" style="margin-right: 8px;">{{item.label}}</van-radio>`
    }
  },

  checkboxGroup: attr => {
    const defaultProps = { direction: 'horizontal' }
    const { componentConfig, finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'van-checkbox-group',
      valueName: componentConfig.valueName || 'checkboxValues',
      defaultValue: componentConfig.defaultValue || [],
      props: finalProps,
      events: finalEvents || { change: val => console.log(`[CheckboxGroup] change:`, val) },
      slot:
        slot ||
        `<van-checkbox v-for="item in options" :key="item.value" :name="item.value" shape="square" style="margin-right: 8px;">{{item.label}}</van-checkbox>`
    }
  },

  // Vant 中日期/时间选择器通常通过 Popup 触发，这里我们定义选择器本身
  datetimePicker: attr => {
    const defaultProps = {
      type: 'date',
      title: '选择日期',
      'min-date': new Date(1970, 0, 1),
      'max-date': new Date(2099, 11, 31)
    }
    const { componentConfig, finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'van-datetime-picker',
      valueName: componentConfig.valueName || 'dateValue',
      defaultValue: componentConfig.defaultValue || new Date(),
      props: finalProps,
      events: finalEvents || { confirm: val => console.log(`[DatetimePicker] confirm:`, val) },
      slot: slot || ''
    }
  },

  slider: attr => {
    const defaultProps = { min: 0, max: 100, step: 1, barHeight: '2px' }
    const { componentConfig, finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    const finalDefaultValue = finalProps.range
      ? componentConfig.defaultValue || [20, 80]
      : componentConfig.defaultValue ?? 50
    return {
      component: 'van-slider',
      valueName: componentConfig.valueName || 'sliderValue',
      defaultValue: finalDefaultValue,
      props: finalProps,
      events: finalEvents || { change: val => console.log(`[Slider] change:`, val) },
      slot: slot || ''
    }
  },

  rate: attr => {
    const defaultProps = { count: 5, size: '20px', color: '#ffd21e', voidColor: '#c8c9cc' }
    const { componentConfig, finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'van-rate',
      valueName: componentConfig.valueName || 'rateValue',
      defaultValue: componentConfig.defaultValue ?? 0,
      props: finalProps,
      events: finalEvents || { change: val => console.log(`[Rate] change:`, val) },
      slot: slot || ''
    }
  },

  uploader: attr => {
    // Vant 的 Uploader 核心是 after-read 事件，用于客户端处理文件
    const defaultProps = { 'max-count': 1 }
    const { componentConfig, finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'van-uploader',
      // v-model 绑定的是一个文件对象数组
      valueName: componentConfig.valueName || 'fileList',
      defaultValue: componentConfig.defaultValue || [],
      props: finalProps,
      events: finalEvents || { 'after-read': file => console.log(`[Uploader] after-read:`, file) },
      // 默认插槽提供一个上传按钮
      slot: slot || `<van-button icon="plus" type="primary">上传文件</van-button>`
    }
  },

  // --- 数据展示、操作等组件 ---

  button: attr => {
    const defaultProps = { type: 'primary', nativeType: 'button', size: 'normal' }
    const { finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'van-button',
      valueName: null, // 按钮没有v-model
      defaultValue: null,
      props: finalProps,
      events: finalEvents || { click: () => console.log('[Button] click') },
      slot: slot || `<span>按钮</span>`
    }
  },

  popup: attr => {
    const defaultProps = { position: 'bottom', 'close-on-click-overlay': true, 'safe-area-inset-bottom': true }
    const { componentConfig, finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'van-popup',
      // v-model 控制显示/隐藏
      valueName: componentConfig.valueName || 'popupVisible',
      defaultValue: componentConfig.defaultValue ?? false,
      props: finalProps,
      events: finalEvents || {},
      slot: slot || '<div>弹窗内容</div>'
    }
  },

  progress: attr => {
    const defaultProps = { showPivot: true, color: '#07c160' }
    const { componentConfig, finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'van-progress',
      // v-model 控制百分比
      valueName: componentConfig.valueName || 'percentage',
      defaultValue: componentConfig.defaultValue ?? 0,
      props: finalProps,
      events: finalEvents || {},
      slot: slot || ''
    }
  },

  tag: attr => {
    const defaultProps = { type: 'primary', size: 'medium' } // Vant 默认主色是蓝色，但按钮是绿色，这里跟随按钮
    const { finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'van-tag',
      valueName: null,
      defaultValue: null,
      props: finalProps,
      events: finalEvents || { close: () => console.log('[Tag] close') },
      slot: slot || '标签'
    }
  },

  noticeBar: attr => {
    // Vant 的 NoticeBar 类似于 Element 的 Alert
    const defaultProps = { leftIcon: 'volume-o', scrollable: false, wrapable: true }
    const { finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'van-notice-bar',
      valueName: null,
      defaultValue: null,
      props: finalProps,
      events: finalEvents || { close: () => console.log('[NoticeBar] close') },
      slot: slot || '这是一条通知信息。'
    }
  },

  divider: attr => {
    const defaultProps = { contentPosition: 'center' }
    const { finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'van-divider',
      valueName: null,
      defaultValue: null,
      props: finalProps,
      events: finalEvents || {},
      slot: slot || ''
    }
  },

  card: attr => {
    const defaultProps = { title: '卡片标题', desc: '描述信息' }
    const { finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: 'van-card',
      valueName: null,
      defaultValue: null,
      props: finalProps,
      events: finalEvents || {},
      // Vant Card 有很多具名插槽，默认插槽通常不直接使用
      // 这里提供一个 footer 插槽的例子
      slot:
        slot ||
        `<div slot="footer">
                      <van-button size="mini">按钮</van-button>
                      <van-button size="mini">按钮</van-button>
                    </div>`
    }
  },

  text: attr => {
    // 这个是自定义的文本组件，与UI库无关，直接复用
    const defaultProps = { style: { color: '#323233', fontSize: '14px', margin: 0, padding: 0 } }
    const { componentConfig, finalProps, finalEvents, slot } = resolveAttrs(attr, defaultProps)
    return {
      component: finalProps.tag || 'div', // 允许通过 tag 属性指定渲染的 HTML 标签
      // 它也可以有 v-model，用于动态文本
      valueName: componentConfig.valueName || 'textValue',
      defaultValue: componentConfig.defaultValue || '这是一段静态文本',
      props: finalProps,
      events: finalEvents || {},
      slot: slot || ''
    }
  }
}

export default Vant
