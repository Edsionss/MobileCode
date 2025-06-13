import main from '@config/main.js'
const { componentsAttrForm, rightAttribute, componentLoader, utils } = main
const { tabs, click, defaultTabs } = rightAttribute.attrTabs
const createAsyncComponent = componentLoader.createAsyncComponent
const rightAttributeComponent = {
  name: 'rightAttributeComponent',
  template: `
  `,
  props: {
    // group: { type: String, default: 'form' }, // We'll get group from component object
    component: { type: Object, default: () => ({ componentName: 'input', groupName: 'form', props: {} }) }, // Expecting an object
    tab: {
      type: String,
      default: defaultTabs
    }
  },
  components: {},
  data() {
    return {
      tabs: tabs, // tabs配置
      currentTabName: this.tab, //  当前选中的标签
      click: click, // tabs配置默认点击事件处理函数
      utils: utils, // 工具函数
      formData: {}, // 用于存储表单数据
      componentsAttrForm: componentsAttrForm, //  组件属性表单配置
      group: '', // 组件所属的组
      component: '', // 组件名称
      tab: defaultTabs, // 当前选中的 tab 名称
      framework: '', // 组件框架名称
      componentId: '', //  组件 id
      componentProps: {} //组件属性
    }
  },
  created() {
    this.tabs.forEach(tab => {
      //统一处理每个tabs里面的内容
      tab = this.handTabContent(tab)
      // 确保每个 tab 的 content 是一个数组
      let tabName = tab.name,
        tabLabel = tab.label,
        tabContent = tab.content
      if (!tabLabel || !tabName) {
        this.returnErrorMsg('缺少tabs标签页中的label和name，请检查代码配置。')
        return
      }
      // 初始化每个 tab 的 content
      if (!this.formData.hasOwnProperty(tabName) && tab.hasOwnProperty('content')) {
        //为每个 tab 初始化一个空对象
        this.$set(this.formData, tabName, {})
        if (tab.name === 'attr' && this.component && this.component.props) {
          // Initialize formData.attr with the component's current props
          this.$set(this.formData, 'attr', { ...this.component.props })
        } else {
          tabContent.forEach(item => {
            if (item.valueName) {
              // 如果 formData 中还没有这个字段，则使用组件配置的 defaultValue 初始化
              if (!this.formData[tabName].hasOwnProperty(item.valueName) && item.hasOwnProperty('defaultValue')) {
                this.$set(this.formData[tabName], item.valueName, item.defaultValue)
              }
              // 特别处理 el-upload 的 fileList，如果它是 undefined，则初始化为空数组
              if (item.component === 'el-upload' && this.formData[tabName][item.valueName] === undefined) {
                this.$set(this.formData[tabName], item.valueName, [])
              }
            }
          })
        }
      }
    })
  },
  methods: {
    handTabContent(tab) {
      if (tab.name == 'attr') {
        // 为每个 tab 初始化属性 content
        this.componentsAttrForm.forEach(item => {
          // 检查 item.group 和 item.component 是否匹配当前的 group 和 component
          if (item.group == this.component.groupName) {
            // Use this.component.groupName
            const componentsList = item.components
            componentsList.forEach(componentItem => {
              if (componentItem.component == this.component.componentName) {
                // Use this.component.componentName
                tab.content = componentItem.attr
              }
            })
          }
        })
      }

      // --- 步骤 2: 初始化结果对象 ---
      // 预先创建 props 子对象，用于存放需要移动的属性。
      const result = {
        props: {}
      }

      // --- 步骤 3: 遍历源数据的所有键，并进行分配 ---
      for (const key in sourceData) {
        // 这是一个好习惯，确保我们只处理对象自身的属性，而不是原型链上的。
        if (Object.prototype.hasOwnProperty.call(sourceData, key)) {
          // 使用映射来判断这个键的归属。
          // `valueNameMap.get(key)` 的结果会是 true, false, 或 undefined。
          //移除多余的唯一标识
          let newKey = key.replace(this.componentId + '_', '')
          if (valueNameMap.get(newKey) === true) {
            // 情况 A: 这个键在指令中，并且 isProps 为 true。
            // 将其键值对放入 result.props 中。
            result.props[newKey] = sourceData[key]
          } else {
            // 情况 B: 任何其他情况。
            // 包括：isProps 为 false 的项、不在指令中的项 (如 'tab', 'componentId')。
            // 将其键值对保留在顶层。
            result[newKey] = sourceData[key]
          }
        }
      }

      // --- 步骤 4: [可选但推荐] 清理 ---
      // 如果没有任何属性被移入 props，那么这个空的 props 对象就没意义了，可以删掉。
      if (Object.keys(result.props).length === 0) {
        delete result.props
      }

      // --- 步骤 5: 返回重构后的新对象 ---
      return result
    },
    handTabContent(tab) {
      tab.content = []
      if (!this.componentId) {
        return tab
      }
      if (tab.name == 'attr') {
        tab.contentNone = true
        // 获取当前组件的属性表单配置
        let AttrForm = this.componentsAttrForm[this.framework]
        if (AttrForm) {
          let attr = AttrForm.attr
          attr.forEach(item => {
            if (item.group == this.group) {
              let componentsList = item.components
              componentsList.forEach(components => {
                if (components.component == this.component) {
                  tab.content = components.attr
                  tab.contentNone = false // 有内容
                }
              })
            }
          })
        }
      }
      return tab
    },
    // 返回错误信息
    returnErrorMsg(errorMsg) {
      console.error(errorMsg)
      this.$message.error(errorMsg)
    },
    defaultClick() {
      click && click(this.currentTabName, this)
    },
    //  判断是否为表单
    isInputWithValue(tab, itemConfig) {
      const inputComponents = [
        'el-input',
        'el-select',
        'el-switch',
        'el-input-number',
        'el-color-picker',
        'el-radio-group',
        'el-checkbox-group',
        'el-cascader',
        'el-slider',
        'el-time-picker',
        'el-date-picker',
        'el-rate',
        'el-upload' // el-upload 的 v-model 通常是 file-list
      ]
      return (
        itemConfig &&
        itemConfig.component &&
        itemConfig.valueName &&
        inputComponents.includes(itemConfig.component)
      )
    },
    //组件事件处理
    componentEmittedInput(inputValueOrFile, tab, itemConfig) {
      if (this.isInputWithValue(tab, itemConfig)) {
        // el-upload 的 @input 事件可能不存在，它的文件列表更新通常通过 :file-list.sync 或 props 中的回调
        // 但如果 el-upload $emit('input', fileList) 也可以这样处理
        // 对于大部分组件，inputValueOrFile 就是新的值
        let valueToSet = inputValueOrFile

        // 特殊处理el-upload的onChange事件来同步fileList (如果不用.sync)
        // 更好的方式是在el-upload的props中配置onChange回调，直接操作this.formData[itemConfig.valueName]
        // 这里我们假设标准的input事件
        let valKey = this.formValueName(itemConfig.valueName)
        this.handleActualInputValueChange(tab, valKey, valueToSet)
      }
    },
    //处理实际输入值变化并且更新表单中的值
    handleActualInputValueChange(tab, valueName, newValue) {
      this.$set(this.formData[tab.name], valueName, newValue)
    },

    // 获取处理后的props
    getProcessedProps(itemConfig) {
      const props = { ...itemConfig.props }
      delete props.label // 自定义属性
      if (itemConfig.component === 'el-upload' && itemConfig.events) {
        // el-upload 的事件回调通常在 props 里，如 onPreview, onSuccess
        // 这里可以合并 itemConfig.events 到 props (如果它们是 onXXX 格式)
        for (const eventName in itemConfig.events) {
          if (itemConfig.events.hasOwnProperty(eventName) && typeof itemConfig.events[eventName] === 'function') {
            // 将驼峰式 eventName (如 'preview') 转换为 on-event (如 'onPreview')
            const onEventName = 'on' + eventName.charAt(0).toUpperCase() + eventName.slice(1)
            // 如果 props 中已有此 onEventName，避免覆盖，或者决定优先级
            if (!props[onEventName]) {
              props[onEventName] = itemConfig.events[eventName].bind(this) // 确保 this 指向
            }
          }
        }
      }
      return props
    },
    // 获取处理后的事件
    getProcessedEvents(itemConfig) {
      const events = {}
      if (itemConfig.events) {
        for (const eventName in itemConfig.events) {
          if (itemConfig.events.hasOwnProperty(eventName) && typeof itemConfig.events[eventName] === 'function') {
            // el-upload 的事件通常通过 props.onXXX 处理，避免重复绑定
            if (itemConfig.component === 'el-upload' && eventName.startsWith('on')) {
              continue
            }
            events[eventName] = itemConfig.events[eventName].bind(this) // 确保 this 指向 Vue 实例
          }
        }
      }
      return events
    },
    // 新增：条件隐藏/显示组件的方法
    isHidden(tab, itemConfig) {
      // 示例：如果 formData.category 是 'tech'，则隐藏 'age' 输入框
      // if (itemConfig.valueName === 'age' && this.formData.category === 'tech') {
      //   return true;
      // }
      // 可以在 itemConfig 中添加一个 'hiddenWhen' 或 'visibleWhen' 条件函数
      if (typeof itemConfig.hiddenWhen === 'function') {
        return itemConfig.hiddenWhen(tab, this.formData, itemConfig)
      }
      return false
    },
    addNewDemoInput() {
      const newIdSuffix = this.nextDemoItemId++
      const newItemValueName = `demoField${newIdSuffix}`
      this.$set(this.formData, newItemValueName, `Demo ${newIdSuffix}`)
      this.content.push({
        component: 'el-input',
        valueName: newItemValueName,
        defaultValue: `Demo ${newIdSuffix}`,
        props: {
          label: `演示字段 ${newIdSuffix}`,
          placeholder: '请输入演示内容',
          clearable: true
        },
        events: {}
      })
    }
  },
  mounted() {},
  watch: {
    component: {
      handler(newComponent, oldComponent) {
        if (newComponent && newComponent.id !== (oldComponent ? oldComponent.id : null)) {
          this.formData = {} // Reset form data
          this.currentTabName = this.tab // Reset to default tab or keep current
          this.tabs.forEach(tab => {
            tab = this.handTabContent(tab) // Recalculate content for 'attr' tab
            // Re-initialize formData for the new component's attributes
            if (!this.formData.hasOwnProperty(tab.name) && tab.hasOwnProperty('content')) {
              this.$set(this.formData, tab.name, {})
              if (tab.name === 'attr' && this.component.props) {
                // Pre-fill formData.attr with the component's current props
                this.$set(this.formData, 'attr', { ...this.component.props })
              } else {
                // Default initialization for other tabs or if props are not available
                ;(tab.content || []).forEach(item => {
                  if (
                    item.valueName &&
                    !this.formData[tab.name].hasOwnProperty(item.valueName) &&
                    item.hasOwnProperty('defaultValue')
                  ) {
                    this.$set(this.formData[tab.name], item.valueName, item.defaultValue)
                  }
                })
              }
            }
          })
        }
      },
      deep: true // May not be needed if only id/componentName changes trigger full refresh
    },
    'formData.attr': {
      handler(newVal, oldVal) {
        if (this.component && this.component.id && newVal) {
          this.$emit('component-props-updated', { componentId: this.component.id, newProps: { ...newVal } })
        }
      },
      deep: true
    },
    // 新增：可以添加 watcher 来处理联动逻辑
    'formData.category'(newValue, oldValue) {
      console.log(`Category changed from ${oldValue} to ${newValue}`)
      if (newValue === 'sports') {
        // 当类别为体育时，自动设置年龄为25
        if (this.formData.hasOwnProperty('age')) {
          this.$set(this.formData, 'age', 25)
          console.log('Age automatically set to 25 because category is sports.')
        }
      }
    }
  }
}
// 使用 import.meta.url 可以帮助我们构建一个相对于当前 JS 文件的路径
// 这比硬编码 '..' 更健壮
const templateUrl = new URL('index.html', import.meta.url).href
const cssUrl = new URL('index.css', import.meta.url).href
// 4. 关键：调用加载器，将自己包装成异步组件，然后导出
export default createAsyncComponent(rightAttributeComponent, templateUrl, cssUrl)
// export default headerComponent
// export default rightAttributeComponent
