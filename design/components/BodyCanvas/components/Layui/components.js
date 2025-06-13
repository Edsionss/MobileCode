const layoutComponents = {
  card: {
    // 注意：容器组件必须包含 <slot></slot>
    template: `
      <div class="layui-card">
        <div class="layui-card-header">{{title||'卡片标题'}}</div>
        <div class="layui-card-body" style="min-height: 150px;">
        <div class="layui-children-content">
          <!-- 这里是魔力插槽 -->
          <slot></slot>
        </div>
        </div>
      </div>
    </div>
    `,
    props: ['title'] // 表单本身可能没有props
  },
  form: {
    template: `
      <form class="layui-form" lay-filter="form">
        <slot></slot>
      </form>
    `,
    props: []
  },
  grid: {
    template: `
      <div :class="gridRowClass">
        <div v-for="i in colsArray" :key="i" :class="gridColClass(i)">
          <div class="layui-children-content">
           <!-- 新增一层内容包裹，以避免间距影响 -->
            <slot :name="'col-slot-' + i"></slot>
          </div>
        </div>
      </div>
    `,
    computed: {
      colsArray() {
        const cols = this.config.props.cols || this.config.children.length || 2
        return Array.from({ length: cols }, (_, i) => i + 1)
      },
      gridRowClass() {
        const gap = this.config.props.gap
        let classes = ['layui-row']
        if (gap !== undefined && gap >= 0) {
          // LayUI 的间距 class 是 layui-col-spaceN
          classes.push(`layui-col-space${gap}`)
        }
        return classes
      }
    },
    methods: {
      gridColClass(i) {
        const cols = this.config.props.cols || 2
        // 计算每列应该占的栅格数
        let span = Math.floor(12 / cols)
        // 处理无法均分的情况，例如 7 列，将余数加到前面的列上
        const remainder = 12 % cols
        if (i <= remainder) {
          span += 1
        }
        // 拼接 LayUI 的栅格 Class，例如 'layui-col-md6'
        // 未来可以从 config.props 中读取响应式断点，如 'xs', 'sm', 'lg'
        const breakpoint = this.config.props.mode || 'md'
        return ['layui-col', `layui-col-${breakpoint}${span}`]
      }
    },
    props: ['config']
  },
  xmSelect: {
    template: `
      <div class="layui-form-item">
        <label class="layui-form-label">{{config.props.label}}</label>
        <div class="layui-input-block">
          <div :id="config.id"></div>
        </div>
      </div>
    `,
    props: ['config'],
    created() {},
    mounted() {
      this.$nextTick(() => {
        let config = this.config,
          props = this.config.props
        // 确保 xmSelect 已经加载
        var xmSelectInit = xmSelect.render({
          el: '#' + config.id,
          data: props.options || []
        })
      })
    },

    methods: {}
  }
}
const registeredComponents = {}
// 将组件名映射为 layui 组件名
for (const key in layoutComponents) {
  let item = layoutComponents[key]
  registeredComponents['lay-' + key] = item
}
export default registeredComponents
