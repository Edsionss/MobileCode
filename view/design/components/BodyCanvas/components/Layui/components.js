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
    }
  },
  table: {
    template: `
    <div style=""> 
      <table class="layui-hide" :id="tableId" :lay-filter="tableId"></table>
      <div :style="pageStyle" :class="pageId" :id="pageId" lay-filter="pageId"></div>
    </div>
    `,
    props: ['config'],
    computed: {
      pageId() {
        const id = this.config.id
        return id + '_page'
      },
      tableId() {
        const id = this.config.id
        return id
      },
      pageStyle() {
        return {
          paddingLeft: '20px'
        }
      },
      pageParams() {
        const config = this.config,
          pageProps = config.props.pageProps
        return {
          elem: this.pageId,
          count: pageProps.total || 0, // 新的总数
          limit: pageProps.pageSize || 10, // 当前的每页条数
          curr: pageProps.current || 1, // 当前页码
          layout: ['count', 'prev', 'page', 'next', 'limit', 'skip']
        }
      }
    },
    watch: {
      config: {
        handler(newConfig) {
          if (this.tableInstance) {
            // 如果存在，就调用 reload 方法去更新它
            this.reloadTable(newConfig)
          }
        },
        deep: true
      }
    },
    data() {
      return {
        pageInstance: null, // 分页实例
        tableInstance: null
      }
    },
    methods: {
      renderTable() {
        this.$nextTick(() => {
          const props = _.cloneDeep(this.config.props),
            tableId = this.tableId,
            table = layui.table
          // 渲染，并获得实例对象
          this.tableInstance = table.render({
            ...props,
            elem: '#' + tableId, // 绑定元素选择器
            cols: props.cols || [
              [
                { type: 'checkbox', fixed: 'left' },
                { field: 'id', fixed: 'left', width: 80, title: 'ID', sort: true, totalRow: '合计：' },
                { field: 'username', width: 80, title: '用户' },
                { field: 'sex', width: 80, title: '性别', sort: true },
                { field: 'experience', width: 100, title: '积分', sort: true, totalRow: '{{= d.TOTAL_NUMS }} 😊' },
                { field: 'ip', title: 'IP', width: 120 },
                { field: 'joinTime', title: '加入时间', width: 120 }
              ]
            ],
            data: props.data || [
              {
                id: 100001,
                username: '用户1',
                sex: '男',
                experience: 100,
                ip: '192.168.1.1',
                joinTime: '2021-01-01 12:00:00'
              },
              {
                id: 100002,
                username: '用户2',
                sex: '女',
                experience: 200,
                ip: '192.168.1.2',
                joinTime: '2021-01-02 12:00:00'
              }
            ],
            page: false,
            // toolbar: true,
            // cellMinWidth: 80,
            // totalRow: true, // 开启合计行
            // page: true,
            // defaultToolbar: ['filter', 'exports'],
            // height: '400px',
            // url: '',
            done: (res, curr, count, origin) => {
              if (!origin) {
                // 如果是第一次加载，触发自定义事件
                this.$bus.$emit('tablePageChange', {
                  obj: this.pageParams,
                  config: this.config
                })
              }
              props.done && props.done(res, curr, count, origin)
            }
            // 其他属性
            // …
          })
        })
      },
      reloadTable(config) {
        const { props = {}, id } = config,
          tableId = this.tableId,
          table = layui.table,
          laypage = layui.laypage
        if (!this.pageInstance) {
          this.pageInstance = laypage.render({
            ...this.pageParams,
            // c. 【设置回调】
            jump: (obj, first) => {
              // `jump` 回调会在初始化时执行一次（first为true）
              if (!first) {
                this.$bus.$emit('tablePageChange', { obj, first, config: this.config })
              }
            }
          })
        }
        // 使用 layui.table.reload()，通过ID找到要更新的表格
        table.reloadData(tableId, {
          data: props.data || [] // 传入新的当前页数据
        })
      }
    },
    mounted() {
      this.renderTable()
    }
  },
  echarts: {
    template: `
    <div> 
      <div :style="chartStyle" :id="chartsId" :lay-filter="chartsId" :ref="chartsId"></div>
    </div>
    `,
    props: ['config'],
    created() {
      // 初始化时如果有配置项，则触发获取数据事件
      this.chartsProps.init && this.$bus.$emit('echartsGetData', this.config)
    },
    mounted() {
      this.render()
    },
    watch: {
      config: {
        handler() {
          this.render()
        },
        deep: true
      }
    },
    computed: {
      chartStyle() {
        return { width: ' 100%', height: this.config.height || '500px' }
      },
      chartsProps() {
        return this.config.props || {}
      },
      chartsId() {
        return this.config.id
      }
    },
    methods: {
      render(notFirst) {
        this.$nextTick(() => {
          const chartEl = this.$refs[this.chartsId],
            oldInt = echarts.getInstanceByDom(chartEl)
          // 销毁旧实例
          oldInt && oldInt.dispose()
          const myChart = echarts.init(chartEl),
            option =
              this.chartsProps.chartsType === 'pie'
                ? this.createPieChartOption(this.chartsProps.option)
                : this.createBarLineChartOption(this.chartsProps.option)
          option && myChart.setOption(option)
        })
      },
      createBarLineChartOption() {
        return {
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: [120, 200, 150, 80, 70, 110, 130],
              type: 'bar'
            }
          ]
        }
      },
      createPieChartOption(option) {
        if (!option) return false
        const { data, series, ...oldOption } = option || {}
        const newSeries = [{ ..._.cloneDeep(series[0]), data }]
        const resultOption = {
          ...oldOption,
          series: newSeries
        }
        return resultOption
      }
    }
  }
}
const registeredComponents = {}
// 将组件名映射为 layui 组件名
for (const key in layoutComponents) {
  let item = layoutComponents[key]
  registeredComponents['lay-' + key] = item
}
console.log('[lay] 注册组件：', registeredComponents)

export default registeredComponents
