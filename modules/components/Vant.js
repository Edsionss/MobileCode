// 创建一个基础的适配器组件，用于简化代码
// 它接收 config (JSON节点) 和 formData
const BaseAdapter = {
  props: {
    config: {
      type: Object,
      required: true
    },
    formData: {
      type: Object,
      required: true
    }
  }
}

const Vant = {
  // 1. 页面根节点
  page: {
    extends: BaseAdapter,
    render(h) {
      // 页面只是一个容器，通常是 div
      // this.$slots.default 包含了所有子节点的渲染结果
      return h(
        'div',
        {
          style: this.config.componentProps.style,
          class: 'schema-page'
        },
        this.$slots.default
      )
    }
  },

  // 2. 表单容器
  form: {
    extends: BaseAdapter,
    render(h) {
      // 注意：Vant 的 Form 组件通过 provide 向子孙 Field 组件提供信息
      return h(
        'van-form',
        {
          // v-bind componentProps，并处理事件
          props: this.config.componentProps,
          on: this.$listeners // 将事件透传下去
        },
        this.$slots.default
      )
    }
  },

  // ------------------- 表单输入组件 -------------------

  input: {
    extends: BaseAdapter,
    render(h) {
      return h('van-field', {
        props: {
          ...this.config.componentProps,
          label: this.config.label,
          // 实现 v-model
          value: this.formData[this.config.field]
        },
        on: {
          input: value => {
            this.$set(this.formData, this.config.field, value)
          }
        }
      })
    }
  },

  // 'textarea' 可以复用 'input'，通过 componentProps.type 区分
  textarea: {
    extends: BaseAdapter,
    render(h) {
      return h('van-field', {
        props: {
          type: 'textarea', // 指定类型
          ...this.config.componentProps,
          label: this.config.label,
          value: this.formData[this.config.field]
        },
        on: {
          input: value => {
            this.$set(this.formData, this.config.field, value)
          }
        }
      })
    }
  },

  checkbox: {
    extends: BaseAdapter,
    render(h) {
      // Vant 中 CheckboxGroup 通常与 Field 结合使用
      return h('van-field', {
        props: {
          label: this.config.label
        },
        scopedSlots: {
          input: () => {
            return h(
              'van-checkbox-group',
              {
                props: {
                  ...this.config.componentProps,
                  value: this.formData[this.config.field]
                },
                on: {
                  input: value => {
                    this.$set(this.formData, this.config.field, value)
                  }
                }
              },
              // 假设选项在 componentProps.options 中定义
              (this.config.componentProps.options || []).map(opt =>
                h('van-checkbox', { props: { name: opt.value } }, opt.label)
              )
            )
          }
        }
      })
    }
  },

  radio: {
    extends: BaseAdapter,
    render(h) {
      return h('van-field', {
        props: {
          label: this.config.label
        },
        scopedSlots: {
          input: () => {
            return h(
              'van-radio-group',
              {
                props: {
                  ...this.config.componentProps,
                  value: this.formData[this.config.field]
                },
                on: {
                  input: value => {
                    this.$set(this.formData, this.config.field, value)
                  }
                }
              },
              // 假设选项在 componentProps.options 中定义
              (this.config.componentProps.options || []).map(opt =>
                h('van-radio', { props: { name: opt.value } }, opt.label)
              )
            )
          }
        }
      })
    }
  },

  switch: {
    extends: BaseAdapter,
    render(h) {
      return h('van-field', {
        props: {
          label: this.config.label
        },
        scopedSlots: {
          input: () => {
            return h('van-switch', {
              props: {
                ...this.config.componentProps,
                value: this.formData[this.config.field]
              },
              on: {
                input: value => {
                  this.$set(this.formData, this.config.field, value)
                }
              }
            })
          }
        }
      })
    }
  },

  // ------------------- 操作反馈组件 -------------------

  button: {
    extends: BaseAdapter,
    render(h) {
      return h(
        'van-button',
        {
          props: this.config.componentProps,
          on: this.$listeners
        },
        this.config.label
      ) // 按钮文字来自 label
    }
  },

  popup: {
    extends: BaseAdapter,
    render(h) {
      // Popup 的显示/隐藏通过 v-model 控制
      // 假设其状态也存储在 formData 中
      return h(
        'van-popup',
        {
          props: {
            ...this.config.componentProps,
            value: this.formData[this.config.field]
          },
          on: {
            input: value => {
              this.$set(this.formData, this.config.field, value)
            }
          }
        },
        this.$slots.default
      ) // Popup 是容器
    }
  },

  // ------------------- 展示组件 -------------------

  card: {
    extends: BaseAdapter,
    render(h) {
      // 将 componentProps 映射到 van-card 的 props
      return h(
        'van-card',
        {
          props: {
            ...this.config.componentProps,
            title: this.config.label // 使用 label 作为卡片标题
          }
        },
        {
          // Card 的插槽可以渲染子组件
          default: () => this.$slots.default,
          footer: () => this.$slots.footer // 示例：支持 footer 插槽
        }
      )
    }
  },

  'cell-group': {
    extends: BaseAdapter,
    render(h) {
      return h(
        'van-cell-group',
        {
          props: this.config.componentProps
        },
        this.$slots.default
      )
    }
  },

  cell: {
    extends: BaseAdapter,
    render(h) {
      return h(
        'van-cell',
        {
          props: {
            ...this.config.componentProps,
            title: this.config.label
          }
        },
        this.$slots.default
      )
    }
  },

  collapse: {
    extends: BaseAdapter,
    render(h) {
      return h(
        'van-collapse',
        {
          props: {
            ...this.config.componentProps,
            value: this.formData[this.config.field]
          },
          on: {
            input: value => {
              this.$set(this.formData, this.config.field, value)
            }
          }
        },
        this.$slots.default
      )
    }
  },

  'collapse-item': {
    extends: BaseAdapter,
    render(h) {
      return h(
        'van-collapse-item',
        {
          props: {
            ...this.config.componentProps,
            title: this.config.label, // label 作为标题
            name: this.config.id // 用唯一 id 作为 name
          }
        },
        this.$slots.default
      )
    }
  },

  image: {
    extends: BaseAdapter,
    render(h) {
      return h('van-image', {
        props: {
          ...this.config.componentProps
          // src 可能在 componentProps 中
        }
      })
    }
  },

  // ------------------- 布局组件 -------------------

  tabs: {
    extends: BaseAdapter,
    render(h) {
      return h(
        'van-tabs',
        {
          props: {
            ...this.config.componentProps,
            value: this.formData[this.config.field]
          },
          on: {
            input: value => {
              this.$set(this.formData, this.config.field, value)
            }
          }
        },
        this.$slots.default
      )
    }
  },

  tab: {
    // 在 Vant 中 Tab 叫 van-tab
    extends: BaseAdapter,
    render(h) {
      return h(
        'van-tab',
        {
          props: {
            ...this.config.componentProps,
            title: this.config.label
          }
        },
        this.$slots.default
      )
    }
  },

  grid: {
    extends: BaseAdapter,
    render(h) {
      return h(
        'van-grid',
        {
          props: this.config.componentProps
        },
        this.$slots.default
      )
    }
  },

  'grid-item': {
    extends: BaseAdapter,
    render(h) {
      // GridItem 的 text 来自 label
      return h(
        'van-grid-item',
        {
          props: {
            ...this.config.componentProps,
            text: this.config.label
          }
        },
        this.$slots.default
      )
    }
  },

  row: {
    extends: BaseAdapter,
    render(h) {
      return h(
        'van-row',
        {
          props: this.config.componentProps
        },
        this.$slots.default
      )
    }
  },

  col: {
    extends: BaseAdapter,
    render(h) {
      return h(
        'van-col',
        {
          props: this.config.componentProps
        },
        this.$slots.default
      )
    }
  }
}

export default Vant
